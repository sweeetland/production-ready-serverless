import Axios from 'axios';
import * as AxiosLogger from 'axios-logger';

const axios = Axios.create();

AxiosLogger.setGlobalConfig({ prefixText: false });

axios.interceptors.request.use(AxiosLogger.requestLogger, AxiosLogger.errorLogger);
axios.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger);

type Headers = Record<string, string>;

export const get = <T>(url: string, headers?: Headers): Promise<T> =>
  axios
    .get<T>(url, { headers })
    .then((r) => r.data);

export const post = <T>(url: string, body?: unknown, headers?: Headers): Promise<T> =>
  axios
    .post<T>(url, body, { headers })
    .then((r) => r.data);

export const put = <T>(url: string, body?: unknown, headers?: Headers): Promise<T> =>
  axios
    .put<T>(url, body, { headers })
    .then((r) => r.data);
