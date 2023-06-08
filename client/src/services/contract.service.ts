import Axios, { AxiosResponse } from 'axios';
import qs from 'querystring';
import http from '../index';
// @ts-ignore

interface ILoginResponse {
    message: string;
}
export default class ContractService {
    public static create(id: string, userId: string): Promise<any> {
        const url = 'contracts/order';

        const data = qs.stringify({
            'id': id,
            'userId': userId
        });

        const response = http.post(url, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': localStorage.getItem('JWT')
            }
        });
        const extractData = (response: AxiosResponse) : any => response.data;

        return response.then(extractData);
    }

    public static updateTime(id: string): Promise<any> {
        const url = 'contracts/' + id + '/renewal';

        const response = http.post(url, null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': localStorage.getItem('JWT')
            }
        });
        const extractData = (response: AxiosResponse) : any => response.data;

        return response.then(extractData);
    }

    public static delete(): Promise<any> {
        const url = 'contracts/';
        const extractData = (response: AxiosResponse<ILoginResponse>): string => response.headers.Authorization;

        return Axios.post<ILoginResponse>(url).then(extractData);
    }


}
