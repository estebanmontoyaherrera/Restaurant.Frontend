import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class DefaultService {
  constructor() {}

  abstract getAll(
    size: number,
    sort: string,
    order: string,
    page: number,
    getInputs: string,
    id?: string,
    id2?: number
  ): Observable<any>;
}
