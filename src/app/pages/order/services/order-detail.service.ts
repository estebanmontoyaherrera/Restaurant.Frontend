import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import { AlertService } from '@app/shared/services/alert.service';
import { endpoint } from '@app/shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@app/shared/utils/functions.util';
import { environment as env } from '@env/environment.development';
import { map, Observable } from 'rxjs';
import {
  OrderDetailCreateRequest,
  OrderDetailUpdateRequest,
} from '../models/order-request.interface';
import { OrderDetailResponse } from '../models/order-response.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(AlertService);

  getAll(
    size: number = 200,
    sort: string = 'Id',
    order: string = 'desc',
    numPage: number = 1,
    getInputs: string = ''
  ): Observable<BaseApiResponse<OrderDetailResponse[]>> {
    const requestUrl = `${env.apiIdentity}${
      endpoint.LIST_ORDER_DETAILS
    }?records=${size}&sort=${sort}&order=${order}&numPage=${numPage}${getInputs}`;

    return this.httpClient
      .get<BaseApiResponse<OrderDetailResponse[]>>(requestUrl)
      .pipe(map((resp) => this.decorateDetails(resp)));
  }

  orderDetailById(orderDetailId: number): Observable<OrderDetailResponse> {
    const requestUrl = `${env.apiIdentity}${endpoint.ORDER_DETAIL_BY_ID}${orderDetailId}`;
    return this.httpClient
      .get<BaseApiResponse<OrderDetailResponse>>(requestUrl)
      .pipe(map((resp) => resp.data));
  }

  addOrderItem(
    orderId: number,
    item: OrderDetailCreateRequest
  ): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${this.orderItemsBaseUrl()}orders/${orderId}/items`;
    return this.httpClient.post<BaseApiResponse<boolean>>(requestUrl, item);
  }

  updateOrderItem(
    orderId: number,
    detailId: number,
    item: OrderDetailUpdateRequest
  ): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${this.orderItemsBaseUrl()}orders/${orderId}/items/${detailId}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, item);
  }

  deleteOrderItem(orderId: number, detailId: number): Observable<void> {
    const requestUrl = `${this.orderItemsBaseUrl()}orders/${orderId}/items/${detailId}`;
    return this.httpClient.delete<BaseApiResponse<boolean> | null>(requestUrl).pipe(
      map((resp) => {
        if (!resp || resp.isSuccess) {
          this.alertService.success(
            'Excelente',
            resp?.message ?? 'Registro eliminado exitosamente.'
          );
        } else {
          this.alertService.warn('Atencion', resp.message);
        }
      })
    );
  }

  private decorateDetails(
    resp: BaseApiResponse<OrderDetailResponse[]>
  ): BaseApiResponse<OrderDetailResponse[]> {
    resp.data.forEach((detail: OrderDetailResponse) => {
      detail.stateDescription = getStateBadge(detail.stateDescription);
      detail.icEdit = getIcon('edit', 'Actualizar item', true);
      detail.icDelete = getIcon('delete', 'Eliminar item', true);
    });
    return resp;
  }

  private orderItemsBaseUrl(): string {
    return env.apiIdentity.replace(/api\/$/i, '');
  }
}
