import { db } from '.';
import { workdocs } from '../services';

const { WORKDOCS_FOLDER_IDS_TABLE_NAME } = process.env;

if (!WORKDOCS_FOLDER_IDS_TABLE_NAME) {
  throw Error('WORKDOCS_FOLDER_IDS_TABLE_NAME env variable is not set.');
}

type GetParams = { customerId: string; country: string };
type GetResponse = GetParams & { folderId: string };

export const getFolderId = async ({ customerId, country }: GetParams) => {
  const res = await db.get<GetResponse>({
    TableName: WORKDOCS_FOLDER_IDS_TABLE_NAME,
    Key: { customerId, country },
  });

  let customerFolderId = res?.folderId;

  if (!customerFolderId) {
    console.log('customerFolderId not found.');

    // get the folderId for the country
    const countryFolderId = await getCountryFolderId(country);

    // create a new folder for this customerId (within the countryFolderId)
    const createFolderRes = await workdocs
      .createFolder({ ParentFolderId: countryFolderId, Name: customerId })
      .promise();

    customerFolderId = createFolderRes.Metadata?.Id;

    if (!customerFolderId) {
      throw Error('customerFolderId should not be undefined');
    }

    await db.put({
      TableName: WORKDOCS_FOLDER_IDS_TABLE_NAME,
      Item: { customerId, country, folderId: customerFolderId },
    });
  }

  return customerFolderId;
};

const getCountryFolderId = async (country: string) => {
  const res = await db.get<GetResponse>({
    TableName: WORKDOCS_FOLDER_IDS_TABLE_NAME,
    Key: { customerId: 'ROOT', country },
  });

  let countryFolderId = res?.folderId;

  if (!countryFolderId) {
    console.log('countryFolderId not found.');

    // if the countryFolderId doesn't already exist get the rootFolderId
    const rootFolderId = await getRootFolderId();

    // use the rootFolderId to create a countryFolderId for this country
    const createFolderRes = await workdocs
      .createFolder({ ParentFolderId: rootFolderId, Name: country })
      .promise();

    countryFolderId = createFolderRes.Metadata?.Id;

    if (!countryFolderId) {
      throw Error('countryFolderId should not be undefined');
    }

    await db.put({
      TableName: WORKDOCS_FOLDER_IDS_TABLE_NAME,
      Item: { customerId: 'ROOT', country, folderId: countryFolderId },
    });
  }

  return countryFolderId;
};

const getRootFolderId = async () => {
  const res = await db.get<GetResponse>({
    TableName: WORKDOCS_FOLDER_IDS_TABLE_NAME,
    Key: { customerId: 'ROOT', country: 'ROOT' },
  });

  if (!res?.folderId) {
    console.log('rootFolderId should not be undefined so throwing an error');
    throw Error('rootFolderId should not be undefined');
  }

  return res.folderId;
};
