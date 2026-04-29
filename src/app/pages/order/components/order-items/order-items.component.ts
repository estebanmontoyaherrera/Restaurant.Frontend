import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SelectResponse } from '@app/shared/models/core/selects-response.interface';
import { AlertService } from '@app/shared/services/alert.service';
import { SelectsService } from '@app/shared/services/selects.service';
import { statesSelect } from '@app/shared/utils/global-constants.util';
import { DishService } from '@app/pages/dish/services/dish.service';
import { GsSelectComponent } from '@app/shared/components/reusables/form-inputs/simple/gs-select/gs-select.component';
import { GsTextComponent } from '@app/shared/components/reusables/form-inputs/simple/gs-text/gs-text.component';
import Swal from 'sweetalert2';
import {
  OrderDetailCreateRequest,
  OrderDetailUpdateRequest,
} from '../../models/order-request.interface';
import {
  OrderDetailResponse,
  OrderResponse,
} from '../../models/order-response.interface';
import { OrderDetailService } from '../../services/order-detail.service';
import { canEditOrderItems } from '../../utils/order-status.util';

@Component({
  standalone: true,
  selector: 'app-order-items',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    GsSelectComponent,
    GsTextComponent,
  ],
  templateUrl: './order-items.component.html',
})
export class OrderItemsComponent {
  private readonly fb$ = inject(FormBuilder);
  private readonly orderDetailService = inject(OrderDetailService);
  private readonly selectsService = inject(SelectsService);
  private readonly dishService = inject(DishService);
  private readonly alertService = inject(AlertService);
  readonly dialogRef = inject(MatDialogRef<OrderItemsComponent>);

  order: OrderResponse;
  item!: FormGroup;
  dishes: SelectResponse[] = [];
  details: OrderDetailResponse[] = [];
  states$ = statesSelect;
  editing = false;
  loading = false;
  canEditItems = false;
  private tempDetailId = -1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.order = data.order;
    this.canEditItems = canEditOrderItems(this.order.status);
    this.initForm();
    this.item.get('dishId')?.valueChanges.subscribe(() => this.dishChanged());
  }

  ngOnInit(): void {
    this.loadDishes();
  }

  initForm(): void {
    this.item = this.fb$.group({
      orderDetailId: new FormControl(0),
      dishId: new FormControl(null),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      unitPrice: new FormControl(0),
      notes: new FormControl(null),
      state: new FormControl('1'),
    });
  }

  loadDishes(): void {
    this.selectsService.listDishSelect().subscribe((resp) => {
      this.dishes = resp;
      this.loadLocalDetails();
    });
  }

  loadLocalDetails(): void {
    this.loading = false;
    const cached = localStorage.getItem(this.storageKey);
    this.details = cached ? JSON.parse(cached) : [];
  }

  persistLocalDetails(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.details));
  }

  dishChanged(): void {
    const dishId = Number(this.item.get('dishId')?.value);
    if (!dishId) return;

    this.dishService.dishById(dishId).subscribe((dish) => {
      this.item.get('unitPrice')?.setValue(dish.price);
    });
  }

  editDetail(detail: OrderDetailResponse): void {
    this.editing = true;
    this.item.patchValue({
      ...detail,
      dishId: this.getDishCode(detail.dishId),
    });
  }

  cancelEdit(): void {
    this.editing = false;
    this.item.reset({
      orderDetailId: 0,
      dishId: null,
      quantity: 1,
      unitPrice: 0,
      notes: null,
      state: '1',
    });
  }

  saveItem(): void {
    if (this.item.invalid) {
      this.item.markAllAsTouched();
      return;
    }

    const data = this.item.getRawValue();
    data.dishId = Number(data.dishId);
    data.quantity = Number(data.quantity);
    data.unitPrice = Number(data.unitPrice);

    if (this.editing) {
      this.updateItem(data);
    } else {
      this.createItem(data);
    }
  }

  createItem(data: OrderDetailCreateRequest): void {
    const request: OrderDetailCreateRequest = {
      dishId: data.dishId,
      quantity: data.quantity,
      notes: data.notes,
    };

    this.orderDetailService.addOrderItem(this.order.orderId, request).subscribe((resp) => {
      this.afterSave(resp);
    });
  }

  updateItem(data: OrderDetailUpdateRequest): void {
    const detailId = Number(data.orderDetailId);
    const request: OrderDetailUpdateRequest = {
      dishId: data.dishId,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      notes: data.notes,
      state: data.state,
    };

    if (detailId < 0) {
      this.upsertLocalDetail();
      this.cancelEdit();
      return;
    }

    this.orderDetailService
      .updateOrderItem(this.order.orderId, detailId, request)
      .subscribe((resp) => this.afterSave(resp));
  }

  afterSave(resp: any): void {
    if (resp.isSuccess) {
      this.alertService.success('Excelente', resp.message);
      this.upsertLocalDetail();
      this.cancelEdit();
    } else {
      this.alertService.warn('Atencion', resp.message);
    }
  }

  upsertLocalDetail(): void {
    const data = this.item.getRawValue();
    const dishId = Number(data.dishId);
    const quantity = Number(data.quantity);
    const unitPrice = Number(data.unitPrice);
    const dishName =
      this.dishes.find((dish) => Number(dish.code) === dishId)?.description ??
      `Plato ${dishId}`;

    const detail: OrderDetailResponse = {
      orderDetailId: this.editing ? Number(data.orderDetailId) : this.tempDetailId--,
      orderId: this.order.orderId,
      dishId,
      dishName,
      quantity,
      unitPrice,
      subtotal: quantity * unitPrice,
      notes: data.notes,
      state: data.state ?? '1',
      stateDescription: 'Activo',
      auditCreateDate: new Date().toISOString(),
      icEdit: '',
      icDelete: '',
    };

    const index = this.editing
      ? this.details.findIndex(
        (item) => item.orderDetailId === detail.orderDetailId
      )
      : this.details.findIndex((item) => item.dishId === dishId);

    if (index >= 0 && this.editing) {
      this.details[index] = detail;
    } else if (index >= 0) {
      this.details[index] = {
        ...this.details[index],
        quantity: this.details[index].quantity + quantity,
        subtotal: (this.details[index].quantity + quantity) * unitPrice,
        notes: data.notes,
      };
    } else {
      this.details = [...this.details, detail];
    }

    this.persistLocalDetails();
  }

  deleteDetail(detail: OrderDetailResponse): void {
    Swal.fire({
      title: 'Eliminar item',
      text: `¿Deseas retirar ${detail.dishName} de la orden?`,
      icon: 'warning',
      target: document.querySelector('.cdk-global-overlay-wrapper') as HTMLElement || document.body,
      showCancelButton: true,
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        // 1. Si el item es nuevo (ID temporal negativo)
        if (detail.orderDetailId < 0) {
          // FILTRO CRÍTICO: Usamos el ID único temporal
          this.details = this.details.filter(item => item.orderDetailId !== detail.orderDetailId);
          this.persistLocalDetails();
          return;
        }

        // 2. Si el item ya existe en la base de datos
        this.orderDetailService.deleteOrderItem(this.order.orderId, detail.orderDetailId)
          .subscribe({
            next: () => {
              // Filtramos solo el ID que devolvió el servidor como eliminado
              this.details = this.details.filter(item => item.orderDetailId !== detail.orderDetailId);
              this.persistLocalDetails();
            },
            error: (err) => {
              this.alertService.error('Error', 'No se pudo eliminar el item del servidor');
            }
          });
      }
    });
  }

  get total(): number {
    return this.details.reduce((sum, detail) => sum + detail.subtotal, 0);
  }

  get storageKey(): string {
    return `order-items-${this.order.orderId}`;
  }

  private getDishCode(dishId: number): any {
    return (
      this.dishes.find((dish) => Number(dish.code) === Number(dishId))?.code ??
      dishId
    );
  }

  private forceAlertOverDialog(): void {
    const container = document.querySelector(
      '.swal2-container'
    ) as HTMLElement | null;
    const popup = document.querySelector('.swal2-popup') as HTMLElement | null;

    if (container) {
      container.style.zIndex = '2147483647';
      container.style.position = 'fixed';
    }

    if (popup) {
      popup.style.zIndex = '2147483647';
      popup.style.position = 'relative';
    }
  }
}
