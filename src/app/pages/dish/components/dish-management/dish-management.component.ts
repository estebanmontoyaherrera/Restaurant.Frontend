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
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  DishCreateRequest,
  DishUpdateRequest,
} from '../../models/dish-request.interface';
import { DishService } from '../../services/dish.service';

@Component({
  standalone: true,
  selector: 'app-dish-management',
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
    MatCheckboxModule,
  ],
  templateUrl: './dish-management.component.html',
})
export class DishManagementComponent {
  private readonly fb$ = inject(FormBuilder);
  private readonly dishService = inject(DishService);
  readonly dialogRef = inject(MatDialogRef<DishManagementComponent>);
  private readonly alertService = inject(AlertService);

  mode: 'create' | 'update';
  loading = false;
  dish!: FormGroup;
  dishDialog;
  states$ = statesSelect;

  initForm(): void {
    this.dish = this.fb$.group({
      dishId: new FormControl(0),
      name: new FormControl(null),
      description: new FormControl(null),
      price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      category: new FormControl(null),
      isAvailable: new FormControl(true),
      state: new FormControl('1'),
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    this.dishDialog = data.dishDetail;
    this.initForm();
    this.initMode();
  }

  initMode() {
    switch (this.mode) {
      case 'create':
        break;
      case 'update':
        this.initUpdateMode();
        break;
      default:
        break;
    }
  }

  initUpdateMode() {
    this.initCurrentValuesForm();
  }

  initCurrentValuesForm() {
    this.dish.patchValue(this.dishDialog);
  }

  dishSave() {
    if (this.dish.valid) {
      this.loading = true;
      let data = this.dish.getRawValue();
      data.price = Number(data.price);
      this.dishSaveByMode(data);
    }
  }

  dishSaveByMode(data: any) {
    switch (this.mode) {
      case 'create':
        this.dishCreate(data);
        break;
      case 'update':
        this.dishUpdate(data);
    }
  }

  dishCreate(data: DishCreateRequest) {
    const request: DishCreateRequest = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
    };

    this.dishService.dishCreate(request).subscribe((response) => {
      this.loading = false;
      if (response.isSuccess) {
        this.alertService.success('Excelente', response.message);
        this.dialogRef.close(true);
      } else {
        this.alertService.warn('Atencion', response.message);
      }
    });
  }

  dishUpdate(data: DishUpdateRequest) {
    this.dishService.dishUpdate(data).subscribe((response) => {
      this.loading = false;
      if (response.isSuccess) {
        this.alertService.success('Excelente', response.message);
        this.dialogRef.close(true);
      } else {
        this.alertService.warn('Atencion', response.message);
      }
    });
  }
}
