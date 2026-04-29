import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ExportExcelComponent } from '@app/shared/components/reusables/export-excel/export-excel.component';
import { ExportPdf } from '@app/shared/components/reusables/export-pdf/export-pdf';
import { FilterDateRangeYmdComponent } from '@app/shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component';
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
import { OrderResponse } from '../../models/order-response.interface';
import { OrderService } from '../../services/order.service';
import { getNextOrderStatus } from '../../utils/order-status.util';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { OrderManagementComponent } from '../order-management/order-management.component';
import { componentOrderSetting } from './order-list-config';

@Component({
  selector: 'app-order-list',
  imports: [
    MatIcon,
    GenericButtonComponent,
    ExportExcelComponent,
    ExportPdf,
    FilterMenuStatesComponent,
    FilterDateRangeYmdComponent,
    SearchBoxComponent,
    SplitButtonComponent,
    ListTableComponent,
  ],
  templateUrl: './order-list.component.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class OrderListComponent {
  public readonly orderService = inject(OrderService);
  public readonly dialog = inject(MatDialog);

  iconOrder$ = 'room_service';
  componentOrder$: any;
  resetChecks: boolean = false;

  ngOnInit(): void {
    this.componentOrder$ = componentOrderSetting;
  }

  formatGetInputs() {
    let str = '';

    if (this.componentOrder$.filters.stateFilter != null) {
      str += `&stateFilter=${this.componentOrder$.filters.stateFilter}`;
    }

    if (this.componentOrder$.filters.waiterName) {
      str += `&waiterName=${encodeURIComponent(
        this.componentOrder$.filters.waiterName
      )}`;
    }

    if (
      this.componentOrder$.filters.startDate &&
      this.componentOrder$.filters.endDate
    ) {
      str += `&startDate=${this.componentOrder$.filters.startDate}&endDate=${this.componentOrder$.filters.endDate}`;
    }

    if (this.componentOrder$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentOrder$.filters.refresh = false;
    }

    this.componentOrder$.getInputs = str;
  }

  search(data: SearchBox) {
    this.componentOrder$.filters.waiterName = data.searchData;
    this.formatGetInputs();
  }

  setDataFilterStates(data: []) {
    if (data.length) {
      this.componentOrder$.filters.stateFilter = data.join('-');
    } else {
      this.componentOrder$.filters.stateFilter = '0';
    }

    this.formatGetInputs();
  }

  setDateRange(data: any) {
    this.componentOrder$.filters.startDate = data.startDate;
    this.componentOrder$.filters.endDate = data.endDate;
    this.formatGetInputs();
  }

  initFilterReset() {
    this.componentOrder$.filters = {
      ...this.componentOrder$.initFilters,
    };
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    switch (action) {
      case 1:
        this.componentOrder$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  newOrder() {
    this.dialog
      .open(OrderManagementComponent, {
        disableClose: true,
        width: '460px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.setGetInputsOrder(true);
      });
  }

  rowClick(rowClick: RowClick<OrderResponse>) {
    const action = rowClick.action;
    const order = rowClick.row;

    switch (action) {
      case 'items':
        this.orderItems(order);
        break;
      case 'advance':
        this.orderAdvance(order);
        break;
      case 'edit':
        this.orderEdit(order);
        break;
      case 'delete':
        this.orderDelete(order);
        break;
    }
  }

  orderItems(order: OrderResponse) {
    this.dialog
      .open(OrderItemsComponent, {
        disableClose: true,
        width: '900px',
        maxWidth: '95vw',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { order },
      })
      .afterClosed()
      .subscribe(() => this.setGetInputsOrder(true));
  }

  async orderEdit(orderData: OrderResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = orderData;
    const orderDetail = await firstValueFrom(
      this.orderService.orderById(orderData.orderId)
    );

    let dialogRef = this.dialog.open(OrderManagementComponent, {
      data: { mode: 'update', orderDetail },
      disableClose: true,
      width: '460px',
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.setGetInputsOrder(true);
    });
  }

  orderAdvance(orderData: OrderResponse) {
    const nextStatus = getNextOrderStatus(orderData.status);
    if (!nextStatus) {
      Swal.fire('Flujo completado', 'Esta orden ya esta cerrada.', 'info');
      return;
    }

    Swal.fire({
      title: 'Avanzar estado',
      text: `Deseas pasar la orden de ${orderData.status} a ${nextStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, avanzar',
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.orderAdvanceStatus(orderData.orderId).subscribe(() => {
          this.setGetInputsOrder(true);
        });
      }
    });
  }

  orderDelete(orderData: OrderResponse) {
    Swal.fire({
      title: 'Eliminar orden',
      text: `Realmente deseas eliminar la orden de la mesa ${orderData.tableNumber}?`,
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
        this.orderService.orderDelete(orderData.orderId).subscribe(() => {
          this.setGetInputsOrder(true);
        });
      }
    });
  }

  setGetInputsOrder(refresh: boolean) {
    this.componentOrder$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrlExcel() {
    return 'Order/Excel';
  }

  get getDownloadUrlPdf() {
    return 'Order/Pdf';
  }
}
