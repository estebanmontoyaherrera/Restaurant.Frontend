import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import { AlertService } from '@app/shared/services/alert.service';
import { DefaultService } from '@app/shared/services/default.service';
import { endpoint } from '@app/shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@app/shared/utils/functions.util';
import { environment as env } from '@env/environment.development';
import { map, Observable } from 'rxjs';
import {
  DishCreateRequest,
  DishUpdateRequest,
} from '../models/dish-request.interface';
import {
  DishByIdResponse,
  DishResponse,
} from '../models/dish-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DishService extends DefaultService {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(AlertService);

  override getAll(
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<DishResponse[]>> {
    const requestUrl = `${env.apiIdentity}${endpoint.LIST_DISHES
      }?records=${size}&sort=${sort}&order=${order}&numPage=${numPage + 1
      }${getInputs}`;

    return this.httpClient.get<BaseApiResponse<DishResponse[]>>(requestUrl).pipe(
      map((resp) => {
        resp.data.forEach((dish: DishResponse) => {

          dish.availabilityDescription = getStateBadge(
            dish.isAvailable ? 'Activo' : 'Inactivo',
            dish.isAvailable ? 'Habilitado' : 'Inhabilitado'
          );


          dish.icEdit = getIcon('edit', 'Actualizar plato', true);
          dish.icToggle = getIcon(
            dish.isAvailable ? 'visibility_off' : 'visibility',
            dish.isAvailable ? 'Marcar no disponible' : 'Marcar disponible',
            true
          );
          dish.icDelete = getIcon('delete', 'Eliminar plato', true);
        });
        return resp;
      })
    );
  }

  dishById(dishId: number): Observable<DishByIdResponse> {
    const requestUrl = `${env.apiIdentity}${endpoint.DISH_BY_ID}${dishId}`;
    return this.httpClient
      .get<BaseApiResponse<DishByIdResponse>>(requestUrl)
      .pipe(map((resp) => resp.data));
  }

  dishCreate(dish: DishCreateRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.DISH_CREATE}`;
    return this.httpClient.post<BaseApiResponse<boolean>>(requestUrl, dish);
  }

  dishUpdate(dish: DishUpdateRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.DISH_UPDATE}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, dish);
  }

  dishToggle(dishId: number): Observable<void> {
    const requestUrl = `${env.apiIdentity}${endpoint.DISH_TOGGLE}${dishId}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, '').pipe(
      map((resp: BaseApiResponse<boolean>) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
        } else {
          this.alertService.warn('Atención', resp.message);
        }
      })
    );
  }

  dishDelete(dishId: number): Observable<void> {
    const requestUrl = `${env.apiIdentity}${endpoint.DISH_DELETE}${dishId}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, '').pipe(
      map((resp: BaseApiResponse<boolean>) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
        } else {
          this.alertService.warn('Atención', resp.message);
        }
      })
    );
  }
}