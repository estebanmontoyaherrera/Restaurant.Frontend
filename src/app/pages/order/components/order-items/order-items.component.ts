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

  // 🔹 CARGA INICIAL
  loadDishes(): void {
    this.selectsService.listDishSelect().subscribe((resp) => {
      this.dishes = resp;
      this.loadItems();
    });
  }

  // 🔹 BACKEND SOURCE OF TRUTH
  loadItems(): void {
    this.loading = true;

    this.orderDetailService.getByOrderId(this.order.orderId).subscribe({
      next: (resp) => {
        const data = resp.data ?? [];

        // 🔥 MAPEO CLAVE
        this.details = data.map((item) => ({
          ...item,
          dishName:
            item.dishName ??
            this.dishes.find((d) => Number(d.code) === Number(item.dishId))
              ?.description ??
            `Plato ${item.dishId}`,
        }));

        this.loading = false;
      },
      error: () => {
        this.details = [];
        this.loading = false;
      },
    });
  }

  // 🔹 TRAER PRECIO + NOMBRE
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

    if (this.editing) {
      this.updateItem(data);
    } else {
      this.createItem(data);
    }
  }

  createItem(data: OrderDetailCreateRequest): void {
    this.loading = true;

    const request: OrderDetailCreateRequest = {
      dishId: Number(data.dishId),
      quantity: Number(data.quantity),
      notes: data.notes,
    };

    this.orderDetailService
      .addOrderItem(this.order.orderId, request)
      .subscribe({
        next: (resp) => this.afterSave(resp),
        error: () => (this.loading = false),
      });
  }

  updateItem(data: OrderDetailUpdateRequest): void {
    this.loading = true;

    const detailId = Number(data.orderDetailId);

    const request: OrderDetailUpdateRequest = {
      dishId: Number(data.dishId),
      quantity: Number(data.quantity),
      unitPrice: Number(data.unitPrice),
      notes: data.notes,
      state: data.state,
    };

    this.orderDetailService
      .updateOrderItem(this.order.orderId, detailId, request)
      .subscribe({
        next: (resp) => this.afterSave(resp),
        error: () => (this.loading = false),
      });
  }

  afterSave(resp: any): void {
    if (resp.isSuccess) {
      this.alertService.success('Excelente', resp.message);
      this.loadItems();
      this.cancelEdit();
    } else {
      this.alertService.warn('Atencion', resp.message);
      this.loading = false;
    }
  }

  // 🔥 DELETE CON POPUP BIEN POSICIONADO + NOMBRE
  deleteDetail(detail: OrderDetailResponse): void {
    if (this.loading) return;

    Swal.fire({
      title: 'Eliminar item',
      text: `¿Deseas retirar "${detail.dishName}" de la orden?`,
      icon: 'warning',
      target:
        (document.querySelector('.cdk-global-overlay-wrapper') as HTMLElement) ||
        document.body,
      showCancelButton: true,
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;

        this.orderDetailService
          .deleteOrderItem(this.order.orderId, detail.orderDetailId)
          .subscribe({
            next: () => {
              // 🔥 SOLO elimina el correcto
              this.details = this.details.filter(
                (x) => x.orderDetailId !== detail.orderDetailId
              );
              this.loading = false;
            },
            error: () => {
              this.loading = false;
              this.alertService.error('Error', 'No se pudo eliminar');
            },
          });
      }
    });
  }

  get total(): number {
    return this.details.reduce((sum, d) => sum + d.subtotal, 0);
  }

  private getDishCode(dishId: number): any {
    return (
      this.dishes.find((dish) => Number(dish.code) === Number(dishId))?.code ??
      dishId
    );
  }
}