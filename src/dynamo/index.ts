import DynamoDB from 'aws-sdk/clients/dynamodb';

export const dynamo = new DynamoDB.DocumentClient({
  region: process.env.REGION,
  apiVersion: '2012-08-10',
  convertEmptyValues: true,
});

type GetParams = { TableName: string; Key: Record<string, any> };
type PutParams = { TableName: string; Item: Record<string, any> };

export const db = {
  get: async <T>({ TableName, Key }: GetParams) => {
    console.log('dynamo get: ', { TableName, Key });

    const res = await dynamo.get({ TableName, Key }).promise();

    console.log('dynamo res: ', res);

    return res.Item as T | undefined;
  },
  put: async ({ TableName, Item }: PutParams) => {
    console.log('dynamo put: ', { TableName, Item });

    const res = await dynamo.put({ TableName, Item }).promise();

    console.log('dynamo res: ', res);

    return res;
  },
};
