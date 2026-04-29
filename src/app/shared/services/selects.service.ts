import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { map, Observable } from 'rxjs';
import { BaseApiResponse } from '../models/commons/base-api-response.interface';
import { SelectResponse } from '../models/core/selects-response.interface';
import { endpoint } from '../utils/endpoints.util';

@Injectable({
  providedIn: 'root',
})
export class SelectsService {
  private readonly httpClient = inject(HttpClient);

  listUserSelect(): Observable<SelectResponse[]> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_SELECT}`;
    return this.httpClient
      .get<BaseApiResponse<SelectResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  listRoleSelect(): Observable<SelectResponse[]> {
    const requestUrl = `${env.apiIdentity}${endpoint.ROLE_SELECT}`;
    return this.httpClient
      .get<BaseApiResponse<SelectResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  listDishSelect(): Observable<SelectResponse[]> {
    const requestUrl = `${env.apiIdentity}${endpoint.DISH_SELECT}`;
    return this.httpClient
      .get<BaseApiResponse<SelectResponse[]>>(requestUrl)
      .pipe(map((resp) => resp.data));
  }

  listOrderSelect(): Observable<SelectResponse[]> {
    const requestUrl = `${env.apiIdentity}${endpoint.ORDER_SELECT}`;
    return this.httpClient
      .get<BaseApiResponse<SelectResponse[]>>(requestUrl)
      .pipe(map((resp) => resp.data));
  }
}
