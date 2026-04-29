import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import { endpoint } from '@app/shared/utils/endpoints.util';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';
import { SalesReportResponse } from '../models/sales-report-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly httpClient = inject(HttpClient);

  salesReport(
    startDate: string = '',
    endDate: string = ''
  ): Observable<BaseApiResponse<SalesReportResponse>> {
    const params = [
      startDate ? `startDate=${startDate}` : '',
      endDate ? `endDate=${endDate}` : '',
    ]
      .filter(Boolean)
      .join('&');
    const requestUrl = `${env.apiIdentity}${endpoint.ORDER_SALES_REPORT}${
      params ? `?${params}` : ''
    }`;

    return this.httpClient.get<BaseApiResponse<SalesReportResponse>>(requestUrl);
  }
}
