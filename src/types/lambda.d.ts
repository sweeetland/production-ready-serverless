import { APIGatewayProxyEvent as Event, Handler } from 'aws-lambda'

type Obj = { [k: string]: any }
type ObjWithStringValues = { [k: string]: string }

// this is for better discoverability
type HandlerReturnValue = { [k: string]: any }

interface APIGatewayEvent<
    Body extends Obj,
    PathParameters extends ObjWithStringValues,
    QueryStringParameters extends ObjWithStringValues
> extends Omit<Event, 'body' | 'pathParameters' | 'queryStringParameters'> {
    body: Body
    pathParameters: PathParameters
    queryStringParameters: QueryStringParameters
}

export type APIGatewayHandler<
    Body extends Obj,
    PathParameters extends ObjWithStringValues = {},
    QueryStringParameters extends ObjWithStringValues = {}
> = Handler<APIGatewayEvent<Body, PathParameters, QueryStringParameters>, HandlerReturnValue>
