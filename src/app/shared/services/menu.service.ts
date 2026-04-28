import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment.development';
import { BaseApiResponse } from '../models/commons/base-api-response.interface';
import { endpoint } from '../utils/endpoints.util';
import { MenuResponse } from '../models/layout/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly http = inject(HttpClient);

  getMenuByRole(): Observable<BaseApiResponse<MenuResponse[]>> {
    const requestUrl = `${env.apiIdentity}${endpoint.MENU_BY_USER}`;
    return this.http.get<BaseApiResponse<MenuResponse[]>>(requestUrl);
  }
}
