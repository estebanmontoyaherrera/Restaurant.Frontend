import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import { AlertService } from '@app/shared/services/alert.service';
import { endpoint } from '@app/shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@app/shared/utils/functions.util';
import { environment as env } from '@env/environment.development';
import { map, Observable } from 'rxjs';
import {
  UserCreateRequest,
  UserUpdateRequest,
} from '../models/user-request.interface';
import {
  UserByIdResponse,
  UserResponse,
} from '../models/user-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(AlertService);

  getAll(
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<UserResponse[]>> {
    const requestUrl = `${env.apiIdentity}${
      endpoint.LIST_USERS
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      numPage + 1
    }${getInputs}`;

    return this.httpClient
      .get<BaseApiResponse<UserResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (user: UserResponse) {
            user.fullName = user.firstName + ' ' + user.lastName;
            user.stateDescription = getStateBadge(user.stateDescription);
            user.icEdit = getIcon('edit', 'Actualizar usuario', true);
            user.icDelete = getIcon('delete', 'Eliminar usuario', true);
          });
          return resp;
        })
      );
  }

  userById(userId: number): Observable<UserByIdResponse> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_BY_ID}${userId}`;
    return this.httpClient
      .get<BaseApiResponse<UserByIdResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  userCreate(user: UserCreateRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_CREATE}`;
    return this.httpClient.post<BaseApiResponse<boolean>>(requestUrl, user);
  }

  userUpdate(user: UserUpdateRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_UPDATE}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, user);
  }

  userDelete(userId: number): Observable<void> {
    const requestUrl = `${env.apiIdentity}${endpoint.USER_DELETE}${userId}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, '').pipe(
      map((resp: BaseApiResponse<boolean>) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
        }
      })
    );
  }
}
