import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
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
import Swal from 'sweetalert2';
import { RoleResponse } from '../../models/role-response.interface';
import { RoleService } from '../../services/role.service';
import { componentRoleSetting } from './role-list-config';

@Component({
  standalone: true,
  selector: 'app-role-list',
  imports: [
    MatIcon,
    GenericButtonComponent,
    SearchBoxComponent,
    ExportExcelComponent,
    FilterMenuStatesComponent,
    SplitButtonComponent,
    ListTableComponent,
  ],
  templateUrl: './role-list.component.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class RoleListComponent {
  public readonly roleService = inject(RoleService);
  public readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  iconRole$ = 'manage_accounts';
  componentRole$: any;
  resetChecks: boolean = false;

  ngOnInit(): void {
    this.componentRole$ = componentRoleSetting;
  }

  formatGetInputs() {
    let str = '';

    if (this.componentRole$.filters.textFilter != null) {
      str += `&numFilter=${this.componentRole$.filters.numFilter}&textFilter=${this.componentRole$.filters.textFilter}`;
    }

    if (this.componentRole$.filters.stateFilter != null) {
      str += `&stateFilter=${this.componentRole$.filters.stateFilter}`;
    }

    if (this.componentRole$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentRole$.filters.refresh = false;
    }

    this.componentRole$.getInputs = str;
  }

  search(data: SearchBox) {
    this.componentRole$.filters.numFilter = data.searchValue;
    this.componentRole$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  setDataFilterStates(data: []) {
    if (data.length) {
      this.componentRole$.filters.stateFilter = data.join('-');
    } else {
      this.componentRole$.filters.stateFilter = '0';
    }

    this.formatGetInputs();
  }

  initFilterReset() {
    this.componentRole$.filters = {
      ...this.componentRole$.initFilters,
    };
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    console.log('action ', action);
    switch (action) {
      case 1:
        this.componentRole$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  newRole() {
    this.router.navigate(['/roles/crear']);
  }

  // newRole() {
  //   this.dialog
  //     .open(RoleManagementComponent, {
  //       disableClose: true,
  //       width: '450px',
  //       enterAnimationDuration: 250,
  //       exitAnimationDuration: 250,
  //       data: { mode: 'create' },
  //     })
  //     .afterClosed()
  //     .subscribe((res) => {
  //       if (res) {
  //         this.setGetInputsRole(true);
  //       }
  //     });
  // }

  rowClick(rowClick: RowClick<RoleResponse>) {
    let action = rowClick.action;
    let role = rowClick.row;

    switch (action) {
      case 'edit':
        this.roleEdit(role);
        break;
      case 'delete':
        this.roleDelete(role);
        break;
    }
  }

  roleEdit(roleData: RoleResponse) {
    this.router.navigate(['/roles/editar', roleData.roleId]);
  }

  roleDelete(roleData: RoleResponse) {
    Swal.fire({
      title: 'Eliminar rol',
      text: `¿Realmente deseas eliminar el rol ${roleData.name}?`,
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
        this.roleService.roleDelete(roleData.roleId).subscribe(() => {
          this.setGetInputsRole(true);
        });
      }
    });
  }

  setGetInputsRole(refresh: boolean) {
    this.componentRole$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `Role?sort=Id&download=true`;
  }
}
