export interface BaseApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  totalRecords: number;
  errors: any;
  accessToken: string;
  refreshToken: string
}