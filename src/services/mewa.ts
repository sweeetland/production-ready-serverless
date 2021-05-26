import { get, post } from '../utils/http';

const MEWA_BASE_URL = 'https://mewa.api.telogis.eu';

const { MEWA_METADATA_USERNAME, MEWA_METADATA_PASSWORD } = process.env;

if (!MEWA_METADATA_USERNAME) {
  throw Error('MEWA_METADATA_USERNAME env variable not set');
}

if (!MEWA_METADATA_PASSWORD) {
  throw Error('MEWA_METADATA_PASSWORD env variable not set');
}

const login = async () => {
  try {
    type Res = {
      token: string;
      customerName: string;
      username: string;
      customerId: number;
      userId: number;
      apiHost: string;
    };

    return post<Res>(`${MEWA_BASE_URL}/rest/login`, {
      username: MEWA_METADATA_USERNAME,
      password: MEWA_METADATA_PASSWORD,
    });
  } catch (error) {
    console.log('mewa error from login: ', error);
    throw error;
  }
};

export const initialiseMewa = async () => {
  const res = await login();

  const TOKEN = res.token;

  if (!TOKEN) {
    throw Error('No token returned from mewa login');
  }

  const getMetadata = async (pdfId: string) => {
    try {
      type Res = {
        Form_R_AWS: {
          Forms: {
            Id: string;
            CustomerID: string;
            JobKey: string;
            executiondate: string;
            RouteName: string;
            Location: string;
            Status: string;
            PatchDescripton: string;
            Comment: string;
            SignitureName: string;
          }[];
        };
      };

      const res = await get<Res>(
        `${MEWA_BASE_URL}/execute?auth=${TOKEN}&template=1315142055&pdfid=${pdfId} `
      );

      const { CustomerID, executiondate, Location } = res.Form_R_AWS.Forms[0];

      // "Location": "ES|08490|Catalunya|Tordera|Poligon Sant Pere"
      const [country, postcode] = Location.split('|');

      return {
        pdfId,
        customerId: CustomerID,
        date: executiondate,
        country,
        postcode,
      };
    } catch (error) {
      console.log('mewa error from getMetadata: ', error);
      throw error;
    }
  };

  return {
    getMetadata,
  };
};
