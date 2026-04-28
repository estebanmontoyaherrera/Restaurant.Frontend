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
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { RoleService } from '../../services/role.service';
import { AlertService } from '@app/shared/services/alert.service';
import { statesSelect } from '@app/shared/utils/global-constants.util';
import {
  RoleCreateRequest,
  RoleUpdateRequest,
} from '../../models/role-request.interface';

import { ActivatedRoute, Router } from '@angular/router';
import { componentRoleSetting } from '../role-list/role-list-config';
import {
  PermissionsByRoleResponse,
  PermissionsResponse,
} from '../../models/role-response.interface';
import { CheckboxComponent } from '@shared/components/reusables/checkbox/checkbox.component';
import { SpinnerComponent } from '@shared/components/reusables/spinner/spinner.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { scaleIn400ms } from '@app/shared/animations/scale-in.animation';
import { fadeInRight400ms } from '@app/shared/animations/fade-in-right.animation';

@Component({
  selector: 'app-role-management',
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    GsTextComponent,
    GsSelectComponent,
    NgxSpinnerModule,
    MatIconModule,
    CheckboxComponent,
    SpinnerComponent
],
  templateUrl: './role-management.component.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class RoleManagementComponent {
  private readonly fb$ = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private spinner = inject(NgxSpinnerService);

  indexMenu = 0;
  form$!: FormGroup;
  component;
  permissions!: PermissionsResponse[];
  menuPermissions!: PermissionsByRoleResponse[];
  private selectedPermissions: PermissionsResponse[] = [];
  selectedPermissionsList!: PermissionsResponse[];

  roleId?: any | number = 0;

  states$ = statesSelect;

  initForm(): void {
    this.form$ = this.fb$.group({
      roleId: [''],
      name: [''],
      description: [''],
      state: new FormControl(null),
    });
  }

  constructor() {
    this.component = componentRoleSetting;
    this.initForm();
    this.activatedRoute.params.subscribe((params) => {
      this.roleId = params['roleId'];
    });
  }

  ngOnInit(): void {
    let indexMenu = 0;
    if (this.roleId > 0) {
      this.roleById(this.roleId);
    }
    this.roleId = this.roleId == undefined ? 0 : this.roleId;
    this.spinner.show('spinnerxxx');
    this.roleService.permissionByRoleId(this.roleId).subscribe((resp) => {
      resp = resp.filter((menu: any) => menu.fatherId !== null);
      this.menuPermissions = resp;
      // this.menuPermissions = resp.map((menu: any) => ({
      //   ...menu,
      //   selected: menu.permissions.some((p: any) => p.selected),
      //   permissions: menu.permissions.map((p: any) => ({
      //     ...p,
      //     disabled: !menu.permissions.some((p2: any) => p2.selected), // o simplemente !menu.selected
      //   })),
      // }));
      this.spinner.hide('spinnerxxx');
      this.setIndexMenu(indexMenu);
    });
  }

  roleById(roleId: number): void {
    this.roleService.roleById(roleId).subscribe((resp) => {
      this.form$.reset({
        roleId: resp.roleId,
        name: resp.name,
        description: resp.description,
        state: resp.state,
      });
    });
  }

  setIndexMenu(indexMenu: number) {
    this.indexMenu = indexMenu;
    this.permissions = this.menuPermissions[indexMenu].permissions;
  }

  roleSave(): void {
    if (this.form$.invalid) {
      return Object.values(this.form$.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    const roleId = this.roleId;

    if (roleId > 0) {
      this.roleEdit(roleId);
    } else {
      this.roleRegister();
    }
  }

  roleRegister(): void {
    // Obtener menús seleccionados y sus padres
    const selectedMenusSet = new Set<number>();
    this.menuPermissions.forEach((menu) => {
      if (menu.permissions.some((perm) => perm.selected)) {
        selectedMenusSet.add(menu.menuId);
        // Si tiene parent, agregar el padre
        if (menu.fatherId) {
          selectedMenusSet.add(menu.fatherId);
        }
      }
    });
    // const selectedMenus = this.menuPermissions
    //   .filter((menu) => menu.permissions.some((perm) => perm.selected)) // Solo menús con permisos seleccionados
    //   .map((menu) => ({
    //     menuId: menu.menuId,
    //   }));

    const selectedMenus = Array.from(selectedMenusSet).map((menuId) => ({
      menuId,
    }));

    const role: RoleCreateRequest = {
      name: this.form$.value.name,
      description: this.form$.value.description,
      state: this.form$.value.state,
      permissions: this.selectedPermissionsList.map((perm) => {
        return {
          permissionId: perm.permissionId,
          permissionName: perm.permissionName,
          permissionDescription: perm.permissionDescription,
        };
      }),
      menus: selectedMenus,
    };

    this.roleService.roleCreate(role).subscribe((resp) => {
      if (resp.isSuccess) {
        this.alertService.success('Excelente', resp.message);
        this.route.navigate(['roles']);
      } else {
        this.alertService.warn('Atención', resp.message);
      }
    });
  }

  roleEdit(roleId: number): void {
    const allPermissions = this.menuPermissions
      .reduce(
        (accumulator, menu: any) => accumulator.concat(menu.permissions),
        []
      )
      .map((permission: PermissionsResponse) => ({
        permissionId: permission.permissionId,
        permissionName: permission.permissionName,
        permissionDescription: permission.permissionDescription,
        selected: permission.selected,
      }));

    // Obtener menús seleccionados y sus padres
    const selectedMenusSet = new Set<number>();
    this.menuPermissions.forEach((menu) => {
      if (menu.permissions.some((perm) => perm.selected)) {
        selectedMenusSet.add(menu.menuId);
        // Si tiene parent, agregar el padre
        if (menu.fatherId) {
          selectedMenusSet.add(menu.fatherId);
        }
      }
    });

    // const selectedMenus = this.menuPermissions
    //   .filter((menu) => menu.permissions.some((perm) => perm.selected)) // Solo menús con permisos seleccionados
    //   .map((menu) => ({
    //     menuId: menu.menuId,
    //   }));

    const selectedMenus = Array.from(selectedMenusSet).map((menuId) => ({
      menuId,
    }));

    const role: RoleUpdateRequest = {
      roleId: roleId,
      name: this.form$.value.name,
      description: this.form$.value.description,
      state: this.form$.value.state,
      permissions: allPermissions,
      menus: selectedMenus,
    };

    this.roleService.roleUpdate(role).subscribe((resp) => {
      if (resp.isSuccess) {
        this.alertService.success('Excelente', resp.message);
        this.route.navigate(['roles']);
      } else {
        this.alertService.warn('Atención', resp.message);
      }
    });
  }

  optionChecked(selectedPermissions: PermissionsResponse) {
    selectedPermissions.selected = !selectedPermissions.selected;
    this.togglePermissionSelection(selectedPermissions);

    this.selectedPermissionsList = this.getSelectedPermissions();
  }

  getSelectedPermissions(): PermissionsResponse[] {
    return this.selectedPermissions;
  }

  togglePermissionSelection(permission: PermissionsResponse) {
    const index = this.selectedPermissions.findIndex(
      (p) => p.permissionName === permission.permissionName
    );

    if (index !== -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permission);
    }
  }

  back() {
    this.route.navigate(['roles']);
  }
}
