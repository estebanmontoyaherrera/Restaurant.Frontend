import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import { AlertService } from '@app/shared/services/alert.service';
import { endpoint } from '@app/shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@app/shared/utils/functions.util';
import { environment as env } from '@env/environment.development';
import { map, Observable } from 'rxjs';
import {
  RoleCreateRequest,
  RoleUpdateRequest,
} from '../models/role-request.interface';
import {
  PermissionsByRoleResponse,
  RoleByIdResponse,
  RoleResponse,
} from '../models/role-response.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(AlertService);

  getAll(
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<RoleResponse[]>> {
    const requestUrl = `${env.apiIdentity}${
      endpoint.LIST_ROLES
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      numPage + 1
    }${getInputs}`;

    return this.httpClient
      .get<BaseApiResponse<RoleResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (role: RoleResponse) {
            role.stateDescription = getStateBadge(role.stateDescription);
            role.icEdit = getIcon('edit', 'Actualizar rol', true);
            role.icDelete = getIcon('delete', 'Eliminar rol', true);
          });
          return resp;
        })
      );
  }

  roleById(roleId: number): Observable<RoleByIdResponse> {
    const requestUrl = `${env.apiIdentity}${endpoint.ROLE_BY_ID}${roleId}`;
    return this.httpClient
      .get<BaseApiResponse<RoleByIdResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  roleCreate(role: RoleCreateRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.ROLE_CREATE}`;
    return this.httpClient.post<BaseApiResponse<boolean>>(requestUrl, role);
  }

  roleUpdate(role: RoleUpdateRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.ROLE_UPDATE}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, role);
  }

  roleDelete(roleId: number): Observable<void> {
    const requestUrl = `${env.apiIdentity}${endpoint.ROLE_DELETE}${roleId}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, '').pipe(
      map((resp: BaseApiResponse<boolean>) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
        }
      })
    );
  }

  permissionByRoleId(roleId: number): Observable<PermissionsByRoleResponse[]> {
    const requestUrl = `${env.apiIdentity}${endpoint.PERMISSION_BY_ROLE_ID}${roleId}`;
    return this.httpClient
      .get<BaseApiResponse<PermissionsByRoleResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }
}
