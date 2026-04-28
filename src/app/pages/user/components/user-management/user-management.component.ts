import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
  UserCreateRequest,
  UserUpdateRequest,
} from '../../models/user-request.interface';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-user-management',
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
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent {
  private readonly fb$ = inject(FormBuilder);
  private readonly userService = inject(UserService);
  readonly dialogRef = inject(MatDialogRef<UserManagementComponent>);
  private readonly alertService = inject(AlertService);

  mode: 'create' | 'update';
  visible = false;
  loading = false;
  user!: FormGroup;
  userDialog;
  states$ = statesSelect;

  initForm(): void {
    this.user = this.fb$.group({
      userId: new FormControl(0),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
      state: new FormControl(null),
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    this.userDialog = data.userDetail;
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
    this.visible = false;
  }

  initCurrentValuesForm() {
    this.user.patchValue(this.userDialog);
  }

  userSave() {
    if (this.user.valid) {
      this.loading = true;
      let data = this.user.getRawValue();
      this.userSaveByMode(data);
    }
  }

  userSaveByMode(data: any) {
    switch (this.mode) {
      case 'create':
        this.userCreate(data);
        break;
      case 'update':
        this.userUpdate(data);
    }
  }

  userCreate(data: UserCreateRequest) {
    this.userService.userCreate(data).subscribe((response) => {
      if (response.isSuccess) {
        this.alertService.success('Excelente', response.message);
        this.dialogRef.close(true);
      } else {
        this.alertService.warn('Atención', response.message);
      }
    });
  }

  userUpdate(data: UserUpdateRequest) {
    this.userService.userUpdate(data).subscribe((response) => {
      if (response.isSuccess) {
        this.alertService.success('Excelente', response.message);
        this.dialogRef.close(true);
      } else {
        this.alertService.warn('Atención', response.message);
      }
    });
  }
}
