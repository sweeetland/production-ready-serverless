import { object } from 'yup'

import { applyHooks } from '../hooks'
import { APIGatewayHandler } from '../types/lambda'
import { OK } from '../utils/response'

const schema = object({})

const handler: APIGatewayHandler<typeof schema> = async event => {
    console.log('hello from the lambda: ', event)

    return OK({ message: 'world' })
}

export const lambda = applyHooks(handler, { requestSchema: schema })
