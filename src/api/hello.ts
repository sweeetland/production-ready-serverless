import { APIGatewayProxyHandler } from 'better-lambda-types'

import { withHooks } from '../hooks'
import { OK } from '../utils/response'

type Body = {}

const handler: APIGatewayProxyHandler<Body> = async event => {
    console.log('hello from the lambda: ', event)

    return OK({ message: 'world' })
}

export const lambda = withHooks(handler)
