import { OK } from '../utils/response';
import { withHooks } from '../hooks/withHooks';
import { APIGatewayProxyHandler } from 'better-lambda-types';

type Body = {
  message: string;
};

const main: APIGatewayProxyHandler<Body> = async (event) => {
  const { message } = event.body;

  return OK({ message });
};

export const handler = withHooks(main);
