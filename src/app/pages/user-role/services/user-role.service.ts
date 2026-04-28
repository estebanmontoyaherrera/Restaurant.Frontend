import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import { AlertService } from '@app/shared/services/alert.service';
import { endpoint } from '@app/shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@app/shared/utils/functions.util';
import { environment as env } from '@env/environment.development';
import { map, Observable } from 'rxjs';
import {
  UserRoleCreateRequest,
  UserRoleUpdateRequest,
} from '../models/user-role-request.interface';
import {
  UserRoleByIdResponse,
  UserRoleResponse,
} from '../models/user-role-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(AlertService);

  getAll(
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<UserRoleResponse[]>> {
    const requestUrl = `${env.apiIdentity}${
      endpoint.LIST_USER_ROLE
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      numPage + 1
    }${getInputs}`;

    return this.httpClient
      .get<BaseApiResponse<UserRoleResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (user: UserRoleResponse) {
            user.stateDescription = getStateBadge(user.stateDescription);
            user.icEdit = getIcon('edit', 'Actualizar rol de usuario', true);
            user.icDelete = getIcon('delete', 'Eliminar rol de usuario', true);
          });
          return resp;
        })
      );
  }

  userRoleById(userRoleId: number): Observable<UserRoleByIdResponse> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_ROLE_BY_ID}${userRoleId}`;
    return this.httpClient
      .get<BaseApiResponse<UserRoleByIdResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  userRoleCreate(
    userRole: UserRoleCreateRequest
  ): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_ROLE_CREATE}`;
    return this.httpClient.post<BaseApiResponse<boolean>>(requestUrl, userRole);
  }

  userRoleUpdate(
    userRole: UserRoleUpdateRequest
  ): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_ROLE_UPDATE}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, userRole);
  }

  userRoleDelete(userRoleId: number): Observable<void> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_ROLE_DELETE}${userRoleId}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, '').pipe(
      map((resp: BaseApiResponse<boolean>) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
        }
      })
    );
  }
}
