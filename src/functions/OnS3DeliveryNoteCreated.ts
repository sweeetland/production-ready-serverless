import { S3Handler } from 'aws-lambda';
import { WorkDocs } from 'aws-sdk';
import { db } from '../dynamo';
import { getFolderId } from '../dynamo/folderIds';
import { s3, workdocs } from '../services';
import { initialiseMewa } from '../services/mewa';
import { put } from '../utils/http';

const { MDP_SOURCES_BUCKET_NAME, C3_TABLE_NAME } = process.env;

if (!MDP_SOURCES_BUCKET_NAME) {
  throw Error('MDP_SOURCES_BUCKET_NAME env variable not set');
}

if (!C3_TABLE_NAME) {
  throw Error('C3_TABLE_NAME env variable not set');
}

export const handler: S3Handler = async (event) => {
  try {
    console.log('received event: ', JSON.stringify(event, null, 2));

    // Login to metadata api
    const mewa = await initialiseMewa();

    await Promise.all(
      event.Records.map(async (record) => {
        const key = record.s3.object.key;

        console.log('handling record with key: ', key);

        try {
          // "key": "delivery_notes/8cada015-7033-4f20-888e-45cb378ca97e.pdf"
          const fileName = key.split('/')[1];

          //// Step 1: get metadata
          // fileName: "8cada015-7033-4f20-888e-45cb378ca97e.pdf"
          const pdfId = fileName.split('.')[0];
          const metadata = await mewa.getMetadata(pdfId);
          console.log('metadata: ', metadata);

          //// Step 2: get customerFolderId
          const customerFolderId = await getFolderId({
            customerId: metadata.customerId,
            country: metadata.country,
          });
          console.log('customerFolderId: ', customerFolderId);

          //// Step 3 - initiate workdocs document
          const workdocsParams: WorkDocs.InitiateDocumentVersionUploadRequest = {
            // ParentFolderId: `8d1ef4f9419a473562408857605bff75c15bf44fd49022f49c0d1e1fd8b2f6d1`,
            ParentFolderId: customerFolderId,
            ContentType: 'application/pdf',
            Name: fileName, // ["delivery_notes", "8cada015-7033-4f20-888e-45cb378ca97e.pdf"],
          };
          console.log(`workdocs initiating upload...`);
          console.log(workdocsParams);
          const workdocsRes = await workdocs
            .initiateDocumentVersionUpload(workdocsParams)
            .promise();
          console.log('workdocs response: ', workdocsRes);
          const uploadUrl = workdocsRes.UploadMetadata?.UploadUrl;
          const signedHeaders = workdocsRes.UploadMetadata?.SignedHeaders;

          //// Step 4 - get object from s3
          console.log(`s3 getObject with key ${key}...`);
          const s3Res = await s3.getObject({ Key: key, Bucket: MDP_SOURCES_BUCKET_NAME }).promise();
          console.log(`s3 response: `, s3Res);

          //// Step 5 - upload file to url
          if (!uploadUrl || !signedHeaders) {
            throw Error('uploadUrl and signedHeaders is required to upload document');
          }
          console.log(`uploading file to url: `, uploadUrl);
          await put(uploadUrl, s3Res.Body, signedHeaders);
          console.log('file uploaded.');

          //// Step 6 - update version to active
          const DocumentId = workdocsRes.Metadata?.Id;
          const VersionId = workdocsRes.Metadata?.LatestVersionMetadata?.Id;
          if (!DocumentId || !VersionId) {
            throw Error(
              'DocumentId & VersionId are required to call workdocs.updateDocumentVersion'
            );
          }

          console.log('workdocs updating version...');
          console.log({ DocumentId, VersionId });
          await workdocs
            .updateDocumentVersion({
              DocumentId,
              VersionId,
            })
            .promise();
          console.log('workdocs version updated.');

          //// Step 7 - save final metadata
          console.log('saving final metadata with workdocs documentId...');
          await db.put({
            TableName: C3_TABLE_NAME,
            Item: { ...metadata, workdocsFileId: DocumentId },
          });

          console.log('finished handling record with key: ', key);
        } catch (error) {
          // todo:
          console.log(`error handling record with key ${key} `, error);
        }
      })
    );

    return;
  } catch (error) {
    console.log('Unexpected error occured: ', error);
  }
};
