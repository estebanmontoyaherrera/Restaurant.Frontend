import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
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
import { GsSelectComponent } from '@app/shared/components/reusables/form-inputs/simple/gs-select/gs-select.component';
import { GsTextComponent } from '@app/shared/components/reusables/form-inputs/simple/gs-text/gs-text.component';
import { AlertService } from '@app/shared/services/alert.service';
import { statesSelect } from '@app/shared/utils/global-constants.util';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  OrderCreateRequest,
  OrderUpdateRequest,
} from '../../models/order-request.interface';
import { OrderService } from '../../services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-management',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    GsTextComponent,
    GsSelectComponent,
    NgxSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './order-management.component.html',
})
export class OrderManagementComponent {
  private readonly fb$ = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  readonly dialogRef = inject(MatDialogRef<OrderManagementComponent>);
  private readonly alertService = inject(AlertService);

  mode: 'create' | 'update';
  order!: FormGroup;
  orderDialog;
  states$ = statesSelect;

  initForm(): void {
    this.order = this.fb$.group({
      orderId: new FormControl(0),
      tableNumber: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(50),
      ]),
      waiterName: new FormControl(null),
      status: new FormControl('Abierto'),
      state: new FormControl('1'),
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    this.orderDialog = data.orderDetail;
    this.initForm();
    if (this.mode === 'update') this.order.patchValue(this.orderDialog);
  }

  orderSave() {
    if (this.order.valid) {
      const data = this.order.getRawValue();
      data.tableNumber = Number(data.tableNumber);
      this.mode === 'create' ? this.orderCreate(data) : this.orderUpdate(data);
    }
  }

  orderCreate(data: OrderCreateRequest) {
    const request: OrderCreateRequest = {
      tableNumber: data.tableNumber,
      waiterName: data.waiterName,
    };

    this.orderService.orderCreate(request).subscribe((response) => {
      if (response.isSuccess) {
        this.alertService.success('Excelente', response.message);
        this.dialogRef.close(true);
      } else {
        this.alertService.warn('Atencion', response.message);
      }
    });
  }

  orderUpdate(data: OrderUpdateRequest) {
    this.orderService.orderUpdate(data).subscribe((response) => {
      if (response.isSuccess) {
        this.alertService.success('Excelente', response.message);
        this.dialogRef.close(true);
      } else {
        this.alertService.warn('Atencion', response.message);
      }
    });
  }
}
