import Axios, { AxiosResponse } from 'axios';
import http from '../index';
import qs from 'querystring';
// @ts-ignore

interface ILoginResponse {
    username: string;
    email: string;
    verified: boolean;
}
export default class UserService {
    public static login(username: string, password: string): Promise<any> {

        const url = 'users/login';
        const data = qs.stringify({
            'email' : username,
            'password' : password
        })
        const extractData = (response: AxiosResponse) : any => response.data;
        const extractHeader = (response: AxiosResponse) : any => response.headers;
        const response = http.post(url, data);

        localStorage.clear();
        response.then(extractHeader).then((res: any) => {
            localStorage.setItem('JWT', JSON.stringify(res.authorization));
        });

        response.then(extractData).then((res: any) => {
            localStorage.setItem('userid',  JSON.stringify(res.id));
            localStorage.setItem('username',  JSON.stringify(res.username));
        });

        return response.then(extractData);
    }

    public static logout() {
        localStorage.clear();
    }

    public static register(username: string, password: string, confirmPassword: string, email: string): Promise<any> {
        const url = 'users/register';

        const data = qs.stringify({
            'username' : username,
            'password' : password,
            'confirmPassword' : confirmPassword,
            'email' : email
        })
        const extractData = (response: AxiosResponse) : any => response.data;

        const response = http.post(url, data);
        return response.then(extractData);
    }

    public static getUser() : Promise<any> {
        const url = 'users/' + localStorage.getItem('userid');

        const response = http.get(url, {
            headers: {
                'Authorization': localStorage.getItem('JWT')
            }
        });
        const extractData = (response: AxiosResponse) : any => response.data;
        return response.then(extractData);
    }

    public static updateUser(firstname: string, lastname: string, address: string, idNumber: string) {
        const url = 'users/' + localStorage.getItem('userid');

        const data = qs.stringify({
            'firstname': firstname,
            'lastname': lastname,
            'idNumber': idNumber,
            'address': address
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

    public static getUserCredentials() {
        const url = 'users/' + localStorage.getItem('userid') + '/credentials';

        const response = http.get(url, {
            headers: {
                'Authorization': localStorage.getItem('JWT')
            }
        });
        const extractData = (response: AxiosResponse) : any => response.data;
        return response.then(extractData);
    }

    public static getUserContracts() {
        const url = 'users/' + localStorage.getItem('userid') + '/contracts';

        const response = http.get(url, {
            headers: {
                'Authorization': localStorage.getItem('JWT')
            }
        });
        const extractData = (response: AxiosResponse) : any => response.data;
        return response.then(extractData);
    }

    public static getContractInfo(id: number) {
        const url = 'contracts/' + id;

        const response = http.get(url, {
            headers: {
                'Authorization': localStorage.getItem('JWT')
            }
        });
        const extractData = (response: AxiosResponse) : any => response.data;
        return response.then(extractData);
    }

    public static changeCredentials(): Promise<string> {
        const url = 'users/login';
        const extractData = (response: AxiosResponse<ILoginResponse>): string => response.headers.Authorization;

        return Axios.post<ILoginResponse>(url).then(extractData);
    }
}
