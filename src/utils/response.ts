import { APIGatewayProxyResult } from 'aws-lambda';

type ResponseBody = unknown;
type ResponseHeaders = { [k: string]: unknown };

const response = (
  statusCode: number,
  body: ResponseBody,
  headers?: ResponseHeaders
): APIGatewayProxyResult => ({
  statusCode,
  body: typeof body === 'string' ? body : JSON.stringify(body),
  headers: {
    ...headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
});

type ResponseMethod = (body?: ResponseBody, headers?: ResponseHeaders) => APIGatewayProxyResult;

const responseMethod = (status: number): ResponseMethod => (body = {}, headers) => {
  console.log(`returning a ${status} response with body: `, body);

  return response(status, body, headers);
};

export const OK = responseMethod(200);
export const BAD_REQUEST = responseMethod(400);
export const UNAUTHORIZED = responseMethod(401);
export const FORBIDDEN = responseMethod(403);
export const NOT_FOUND = responseMethod(404);
export const SERVER_ERROR = responseMethod(500);
