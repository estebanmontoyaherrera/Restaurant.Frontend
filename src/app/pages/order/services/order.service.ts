import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import { AlertService } from '@app/shared/services/alert.service';
import { DefaultService } from '@app/shared/services/default.service';
import { endpoint } from '@app/shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@app/shared/utils/functions.util';
import { environment as env } from '@env/environment.development';
import { map, Observable } from 'rxjs';
import { OrderCreateRequest, OrderUpdateRequest } from '../models/order-request.interface';
import { OrderByIdResponse, OrderResponse } from '../models/order-response.interface';
import { getNextOrderStatus, getOrderStatusBadge } from '../utils/order-status.util';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends DefaultService {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(AlertService);

  override getAll(
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<OrderResponse[]>> {
    const dateFilter = this.getDateFilter(getInputs);
    const waiterNameFilter = this.getWaiterNameFilter(getInputs);
    const apiInputs = this.removeClientFilters(getInputs);
    const hasClientFilters = !!dateFilter || !!waiterNameFilter;
    const requestSize = hasClientFilters ? 10000 : size;
    const requestPage = hasClientFilters ? 1 : numPage + 1;
    const requestUrl = `${env.apiIdentity}${
      endpoint.LIST_ORDERS
    }?records=${requestSize}&sort=${sort}&order=${order}&numPage=${requestPage}${apiInputs}`;

    return this.httpClient.get<BaseApiResponse<OrderResponse[]>>(requestUrl).pipe(
      map((resp) => {
        resp.data = resp.data ?? [];

        if (dateFilter) {
          resp.data = this.filterByCreateDate(resp.data, dateFilter);
        }

        if (waiterNameFilter) {
          resp.data = this.filterByWaiterName(resp.data, waiterNameFilter);
        }

        if (hasClientFilters) {
          resp.totalRecords = resp.data.length;
          resp.data = resp.data.slice(numPage * size, numPage * size + size);
        }

        resp.data.forEach((order: OrderResponse) => {
          const nextStatus = getNextOrderStatus(order.status);
          order.statusDescription = getOrderStatusBadge(order.status);
          order.stateDescription = getStateBadge(order.stateDescription);
          order.icItems = getIcon('receipt_long', 'Gestionar items', true);
          order.icAdvance = getIcon(
            nextStatus ? 'arrow_forward' : 'check_circle',
            nextStatus ? `Avanzar a ${nextStatus}` : 'Flujo completado',
            true
          );
          order.icEdit = getIcon('edit', 'Actualizar orden', true);
          order.icDelete = getIcon('delete', 'Eliminar orden', true);
        });
        return resp;
      })
    );
  }

  private getDateFilter(
    getInputs: string
  ): { startDate: string; endDate: string } | null {
    const params = new URLSearchParams(getInputs.replace(/^&/, ''));
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');

    return startDate && endDate ? { startDate, endDate } : null;
  }

  private removeDateFilter(getInputs: string): string {
    return this.removeClientFilters(getInputs);
  }

  private getWaiterNameFilter(getInputs: string): string {
    const params = new URLSearchParams(getInputs.replace(/^&/, ''));
    return params.get('waiterName')?.trim().toLowerCase() ?? '';
  }

  private removeClientFilters(getInputs: string): string {
    const params = new URLSearchParams(getInputs.replace(/^&/, ''));
    params.delete('startDate');
    params.delete('endDate');
    params.delete('waiterName');
    const query = params.toString();
    return query ? `&${query}` : '';
  }

  private filterByCreateDate(
    orders: OrderResponse[],
    filter: { startDate: string; endDate: string }
  ): OrderResponse[] {
    const start = this.startOfDay(filter.startDate);
    const end = this.endOfDay(filter.endDate);

    return orders.filter((order) => {
      const createdAt = new Date(order.auditCreateDate).getTime();
      return createdAt >= start && createdAt <= end;
    });
  }

  private startOfDay(value: string): number {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
  }

  private endOfDay(value: string): number {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
  }

  private filterByWaiterName(
    orders: OrderResponse[],
    waiterName: string
  ): OrderResponse[] {
    return orders.filter((order) =>
      order.waiterName?.toLowerCase().includes(waiterName)
    );
  }

  orderById(orderId: number): Observable<OrderByIdResponse> {
    const requestUrl = `${env.apiIdentity}${endpoint.ORDER_BY_ID}${orderId}`;
    return this.httpClient
      .get<BaseApiResponse<OrderByIdResponse>>(requestUrl)
      .pipe(map((resp) => resp.data));
  }

  orderCreate(order: OrderCreateRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.ORDER_CREATE}`;
    return this.httpClient.post<BaseApiResponse<boolean>>(requestUrl, order);
  }

  orderUpdate(order: OrderUpdateRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.ORDER_UPDATE}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, order);
  }

  orderAdvanceStatus(orderId: number): Observable<void> {
    const requestUrl = `${env.apiIdentity}${endpoint.ORDER_ADVANCE_STATUS}${orderId}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, '').pipe(
      map((resp: BaseApiResponse<boolean>) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
        } else {
          this.alertService.warn('Atencion', resp.message);
        }
      })
    );
  }

  orderDelete(orderId: number): Observable<void> {
    const requestUrl = `${env.apiIdentity}${endpoint.ORDER_DELETE}${orderId}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, '').pipe(
      map((resp: BaseApiResponse<boolean>) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
        } else {
          this.alertService.warn('Atencion', resp.message);
        }
      })
    );
  }
}
