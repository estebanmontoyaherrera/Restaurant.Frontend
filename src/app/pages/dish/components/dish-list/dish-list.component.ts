import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ExportExcelComponent } from '@app/shared/components/reusables/export-excel/export-excel.component';
import { ExportPdf } from '@app/shared/components/reusables/export-pdf/export-pdf';
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
import { DishResponse } from '../../models/dish-response.interface';
import { DishService } from '../../services/dish.service';
import { DishManagementComponent } from '../dish-management/dish-management.component';
import { componentDishSetting } from './dish-list-config';

@Component({
  selector: 'app-dish-list',
  imports: [
    MatIcon,
    GenericButtonComponent,
    SearchBoxComponent,
    ExportExcelComponent,
    FilterMenuStatesComponent,
    SplitButtonComponent,
    ListTableComponent,
    ExportPdf,
  ],
  templateUrl: './dish-list.component.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class DishListComponent {
  public readonly dishService = inject(DishService);
  public readonly dialog = inject(MatDialog);

  iconDish$ = 'restaurant_menu';
  componentDish$: any;
  resetChecks: boolean = false;

  ngOnInit(): void {
    this.componentDish$ = componentDishSetting;
  }

  formatGetInputs() {
    let str = '';

    if (this.componentDish$.filters.category) {
      str += `&category=${this.componentDish$.filters.category}`;
    }

    if (this.componentDish$.filters.stateFilter != null) {
      str += `&stateFilter=${this.componentDish$.filters.stateFilter}`;
    }

    if (this.componentDish$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentDish$.filters.refresh = false;
    }

    this.componentDish$.getInputs = str;
  }

  search(data: SearchBox) {
    this.componentDish$.filters.category = data.searchData;
    this.formatGetInputs();
  }

  setDataFilterStates(data: []) {
    if (data.length) {
      this.componentDish$.filters.stateFilter = data.join('-');
    } else {
      this.componentDish$.filters.stateFilter = '0';
    }

    this.formatGetInputs();
  }

  initFilterReset() {
    this.componentDish$.filters = {
      ...this.componentDish$.initFilters,
    };
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    switch (action) {
      case 1:
        this.componentDish$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  newDish() {
    this.dialog
      .open(DishManagementComponent, {
        disableClose: true,
        width: '480px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsDish(true);
        }
      });
  }

  rowClick(rowClick: RowClick<DishResponse>) {
    let action = rowClick.action;
    let dish = rowClick.row;

    switch (action) {
      case 'edit':
        this.dishEdit(dish);
        break;
      case 'toggle':
        this.dishToggle(dish);
        break;
      case 'delete':
        this.dishDelete(dish);
        break;
    }
  }

  async dishEdit(dishData: DishResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dishData;
    const dishDetail = await firstValueFrom(
      this.dishService.dishById(dishData.dishId)
    );

    let dialogRef = this.dialog.open(DishManagementComponent, {
      data: { mode: 'update', dishDetail: dishDetail },
      disableClose: true,
      width: '480px',
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.setGetInputsDish(true);
    });
  }

  dishToggle(dishData: DishResponse) {
    const action = dishData.isAvailable ? 'deshabilitar' : 'habilitar';

    Swal.fire({
      title: 'Cambiar disponibilidad',
      text: `Deseas ${action} el plato ${dishData.name}?`,
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, continuar',
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dishService.dishToggle(dishData.dishId).subscribe(() => {
          this.setGetInputsDish(true);
        });
      }
    });
  }

  dishDelete(dishData: DishResponse) {
    Swal.fire({
      title: 'Eliminar plato',
      text: `Realmente deseas eliminar el plato ${dishData.name}?`,
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar',
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dishService.dishDelete(dishData.dishId).subscribe(() => {
          this.setGetInputsDish(true);
        });
      }
    });
  }

  setGetInputsDish(refresh: boolean) {
    this.componentDish$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrlExcel() {
    return 'Dish/Excel';
  }

  get getDownloadUrlPdf() {
    return 'Dish/Pdf';
  }
}
