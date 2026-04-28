import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ExportExcelComponent } from '@app/shared/components/reusables/export-excel/export-excel.component';
import { FilterMenuStatesComponent } from '@app/shared/components/reusables/filter-menu-states/filter-menu-states.component';
import { GenericButtonComponent } from '@app/shared/components/reusables/generic-button/generic-button.component';
import { ListTableComponent } from '@app/shared/components/reusables/list-table/list-table.component';
import { SearchBoxComponent } from '@app/shared/components/reusables/search-box/search-box.component';
import { SplitButtonComponent } from '@app/shared/components/reusables/split-button/split-button.component';
import { RowClick } from '@app/shared/models/reusables/rowclick-interface';
import { SearchBox } from '@app/shared/models/reusables/search-options.interface';
import { Actions } from '@app/shared/models/reusables/split-button.interface';
import { fadeInRight400ms } from '@shared/animations/fade-in-right.animation';
import { scaleIn400ms } from '@shared/animations/scale-in.animation';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { UserResponse } from '../../models/user-response.interface';
import { UserService } from '../../services/user.service';
import { UserManagementComponent } from '../user-management/user-management.component';
import { componentUserSetting } from './user-list-config';
import { ExportPdf } from "@app/shared/components/reusables/export-pdf/export-pdf";

@Component({
  selector: 'app-user-list',
  imports: [
    MatIcon,
    GenericButtonComponent,
    SearchBoxComponent,
    ExportExcelComponent,
    FilterMenuStatesComponent,
    SplitButtonComponent,
    ListTableComponent,
    ExportPdf
],
  templateUrl: './user-list.component.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class UserListComponent {
  public readonly userService = inject(UserService);
  public readonly dialog = inject(MatDialog);

  iconUser$ = 'group';
  componentUser$: any;
  resetChecks: boolean = false;

  ngOnInit(): void {
    this.componentUser$ = componentUserSetting;
  }

  formatGetInputs() {
    let str = '';

    if (this.componentUser$.filters.textFilter != null) {
      str += `&numFilter=${this.componentUser$.filters.numFilter}&textFilter=${this.componentUser$.filters.textFilter}`;
    }

    if (this.componentUser$.filters.stateFilter != null) {
      str += `&stateFilter=${this.componentUser$.filters.stateFilter}`;
    }

    if (this.componentUser$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentUser$.filters.refresh = false;
    }

    this.componentUser$.getInputs = str;
  }

  search(data: SearchBox) {
    this.componentUser$.filters.numFilter = data.searchValue;
    this.componentUser$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  setDataFilterStates(data: []) {
    if (data.length) {
      this.componentUser$.filters.stateFilter = data.join('-');
    } else {
      this.componentUser$.filters.stateFilter = '0';
    }

    this.formatGetInputs();
  }

  initFilterReset() {
    this.componentUser$.filters = {
      ...this.componentUser$.initFilters,
    };
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    console.log('action ', action);
    switch (action) {
      case 1:
        this.componentUser$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  newUser() {
    this.dialog
      .open(UserManagementComponent, {
        disableClose: true,
        width: '450px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsUser(true);
        }
      });
  }

  rowClick(rowClick: RowClick<UserResponse>) {
    let action = rowClick.action;
    let user = rowClick.row;

    switch (action) {
      case 'edit':
        this.userEdit(user);
        break;
      case 'delete':
        this.userDelete(user);
        break;
    }
  }

  async userEdit(userData: UserResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = userData;
    const userDetail = await firstValueFrom(
      this.userService.userById(userData.userId)
    );

    let dialogRef = this.dialog.open(UserManagementComponent, {
      data: { mode: 'update', userDetail: userDetail },
      disableClose: true,
      width: '450px',
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.setGetInputsUser(true);
    });
  }

  userDelete(userData: UserResponse) {
    Swal.fire({
      title: 'Eliminar usuario',
      text: `¿Realmente deseas eliminar el usuario ${userData.firstName} ${userData.lastName}}?`,
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
        this.userService.userDelete(userData.userId).subscribe(() => {
          this.setGetInputsUser(true);
        });
      }
    });
  }

  setGetInputsUser(refresh: boolean) {
    this.componentUser$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrlExcel() {
    return 'User/Excel';
  }
  get getDownloadUrlPdf() {
    return 'User/Pdf';
  }
}
