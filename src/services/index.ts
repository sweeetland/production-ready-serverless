import { S3, WorkDocs } from 'aws-sdk';

export const s3 = new S3();

export const workdocs = new WorkDocs({ apiVersion: '2016-05-01', region: 'eu-west-1' });
