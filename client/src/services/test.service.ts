import Axios, { AxiosResponse } from 'axios';
// @ts-ignore
import { ITestResponse } from '../../../shared/api.schemas';

export default class TestService {
  public static testApi(): Promise<string> {
    const url = 'ping/';
    const extractData = (response: AxiosResponse<ITestResponse>): string => response.data.message;

    return Axios.get<ITestResponse>(url).then(extractData);
  }
}
