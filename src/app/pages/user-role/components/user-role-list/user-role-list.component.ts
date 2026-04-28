import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { fadeInRight400ms } from '@app/shared/animations/fade-in-right.animation';
import { scaleIn400ms } from '@app/shared/animations/scale-in.animation';
import { ExportExcelComponent } from '@app/shared/components/reusables/export-excel/export-excel.component';
import { FilterMenuStatesComponent } from '@app/shared/components/reusables/filter-menu-states/filter-menu-states.component';
import { GenericButtonComponent } from '@app/shared/components/reusables/generic-button/generic-button.component';
import { ListTableComponent } from '@app/shared/components/reusables/list-table/list-table.component';
import { SearchBoxComponent } from '@app/shared/components/reusables/search-box/search-box.component';
import { SplitButtonComponent } from '@app/shared/components/reusables/split-button/split-button.component';
import { RowClick } from '@app/shared/models/reusables/rowclick-interface';
import { SearchBox } from '@app/shared/models/reusables/search-options.interface';
import { Actions } from '@app/shared/models/reusables/split-button.interface';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { UserRoleResponse } from '../../models/user-role-response.interface';
import { UserRoleService } from '../../services/user-role.service';
import { UserRoleManagementComponent } from '../user-role-management/user-role-management.component';
import { componentUserRoleSetting } from './user-role-list-config';

@Component({
    selector: 'app-user-role-list',
    imports: [
        MatIcon,
        GenericButtonComponent,
        SearchBoxComponent,
        ExportExcelComponent,
        FilterMenuStatesComponent,
        SplitButtonComponent,
        ListTableComponent,
    ],
    templateUrl: './user-role-list.component.html',
    animations: [scaleIn400ms, fadeInRight400ms]
})
export class UserRoleListComponent {
  public readonly userRoleService = inject(UserRoleService);
  public readonly dialog = inject(MatDialog);

  iconUserRole$ = 'admin_panel_settings';
  componentUserRole$: any;
  resetChecks: boolean = false;

  ngOnInit(): void {
    this.componentUserRole$ = componentUserRoleSetting;
  }

  formatGetInputs() {
    let str = '';

    if (this.componentUserRole$.filters.textFilter != null) {
      str += `&numFilter=${this.componentUserRole$.filters.numFilter}&textFilter=${this.componentUserRole$.filters.textFilter}`;
    }

    if (this.componentUserRole$.filters.stateFilter != null) {
      str += `&stateFilter=${this.componentUserRole$.filters.stateFilter}`;
    }

    if (this.componentUserRole$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentUserRole$.filters.refresh = false;
    }

    this.componentUserRole$.getInputs = str;
  }

  search(data: SearchBox) {
    this.componentUserRole$.filters.numFilter = data.searchValue;
    this.componentUserRole$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  setDataFilterStates(data: []) {
    if (data.length) {
      this.componentUserRole$.filters.stateFilter = data.join('-');
    } else {
      this.componentUserRole$.filters.stateFilter = '0';
    }

    this.formatGetInputs();
  }

  initFilterReset() {
    this.componentUserRole$.filters = {
      ...this.componentUserRole$.initFilters,
    };
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    switch (action) {
      case 1:
        this.componentUserRole$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  newUserRole() {
    this.dialog
      .open(UserRoleManagementComponent, {
        disableClose: true,
        width: '450px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsUserRole(true);
        }
      });
  }

  rowClick(rowClick: RowClick<UserRoleResponse>) {
    let action = rowClick.action;
    let userRole = rowClick.row;

    switch (action) {
      case 'edit':
        this.userRoleEdit(userRole);
        break;
      case 'delete':
        this.userRoleDelete(userRole);
        break;
    }
  }

  async userRoleEdit(userRoleData: UserRoleResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = userRoleData;
    const userRoleDetail = await firstValueFrom(
      this.userRoleService.userRoleById(userRoleData.userRoleId)
    );

    let dialogRef = this.dialog.open(UserRoleManagementComponent, {
      data: { mode: 'update', userRoleDetail: userRoleDetail },
      disableClose: true,
      width: '450px',
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.setGetInputsUserRole(true);
    });
  }

  userRoleDelete(userRoleData: UserRoleResponse) {
    Swal.fire({
      title: 'Eliminar usuario',
      text: `¿Realmente deseas eliminar el rol de usuario ${userRoleData.user} - ${userRoleData.role}?`,
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar',
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userRoleService
          .userRoleDelete(userRoleData.userRoleId)
          .subscribe(() => {
            this.setGetInputsUserRole(true);
          });
      }
    });
  }

  setGetInputsUserRole(refresh: boolean) {
    this.componentUserRole$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `UserRole?sort=Id&download=true`;
  }
}
