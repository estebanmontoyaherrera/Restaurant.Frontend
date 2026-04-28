import { Component, Inject, inject, OnInit } from '@angular/core';
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
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserRoleService } from '../../services/user-role.service';
import { AlertService } from '@app/shared/services/alert.service';
import { statesSelect } from '@app/shared/utils/global-constants.util';
import {
  UserRoleCreateRequest,
  UserRoleUpdateRequest,
} from '../../models/user-role-request.interface';
import { SelectResponse } from '@app/shared/models/core/selects-response.interface';
import { SelectsService } from '@app/shared/services/selects.service';

@Component({
  selector: 'app-user-role-management',
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

    GsSelectComponent,
    NgxSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './user-role-management.component.html'
})
export class UserRoleManagementComponent implements OnInit {
  private readonly fb$ = inject(FormBuilder);
  private readonly userRoleService = inject(UserRoleService);
  private readonly selectService = inject(SelectsService);
  readonly dialogRef = inject(MatDialogRef<UserRoleManagementComponent>);
  private readonly alertService = inject(AlertService);

  mode: 'create' | 'update';
  visible = false;
  loading = false;
  userRole!: FormGroup;
  userRoleDialog;
  states$ = statesSelect;
  users$: SelectResponse[] = [];
  roles$: SelectResponse[] = [];

  initForm(): void {
    this.userRole = this.fb$.group({
      userRoleId: new FormControl(0),
      userId: new FormControl(null),
      roleId: new FormControl(null),
      state: new FormControl(null),
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    this.userRoleDialog = data.userRoleDetail;
    this.initForm();
    this.listUserSelect();
    this.listRoleSelect();
    this.initMode();
  }

  ngOnInit(): void {
    this.listUserSelect();
    this.listRoleSelect();
  }

  listUserSelect(): void {
    this.selectService.listUserSelect().subscribe((response) => {
      this.users$ = response;
      this.initCurrentValuesForm();
    });
  }

  listRoleSelect(): void {
    this.selectService.listRoleSelect().subscribe((response) => {
      this.roles$ = response;
      this.initCurrentValuesForm();
    });
  }

  // setDataModeUpdate() {
  //   if (this.mode === 'update') {
  //     this.userRole.patchValue(this.userRoleDialog);
  //   }
  // }

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
    this.userRole.patchValue(this.userRoleDialog);
  }

  userRoleSave() {
    if (this.userRole.valid) {
      this.loading = true;
      let data = this.userRole.getRawValue();
      this.userRoleSaveByMode(data);
    }
  }

  userRoleSaveByMode(data: any) {
    switch (this.mode) {
      case 'create':
        this.userRoleCreate(data);
        break;
      case 'update':
        this.userRoleUpdate(data);
    }
  }

  userRoleCreate(data: UserRoleCreateRequest) {
    this.userRoleService.userRoleCreate(data).subscribe((response) => {
      if (response.isSuccess) {
        this.alertService.success('Excelente', response.message);
        this.dialogRef.close(true);
      } else {
        this.alertService.warn('Atención', response.message);
      }
    });
  }

  userRoleUpdate(data: UserRoleUpdateRequest) {
    this.userRoleService.userRoleUpdate(data).subscribe((response) => {
      if (response.isSuccess) {
        this.alertService.success('Excelente', response.message);
        this.dialogRef.close(true);
      } else {
        this.alertService.warn('Atención', response.message);
      }
    });
  }
}
