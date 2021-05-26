import axios from 'axios';

export const get = <T>(url: string): Promise<T> => axios.get<T>(url).then((r) => r.data);

export const post = <T>(
  url: string,
  body?: unknown,
  headers?: { [k: string]: string }
): Promise<T> =>
  axios
    .post<T>(url, body, { headers })
    .then((r) => r.data);
