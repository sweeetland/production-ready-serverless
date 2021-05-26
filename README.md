# META-ZTM2

This service is responsible uploading new documents from s3 to workdocs.

## Development

- `yarn` to install dependancies

## Deployment

- `yarn deploy` to deploy service. optional parameter is `--stage prod` if stage is not provided it will default to `dev`.

There is a manual process for each new stage created. For each new stage we need to manually create a root folder in workdocs and then save this root folderId in the `WorkdocsFolderIdsTable`.

it will look something like this:

```json
{
  "country": "ROOT",
  "customerId": "ROOT",
  "folderId": "8d1ef4f9419a473562408857605bff75c15bf44fd49022f49c0d1e1fd8b2f6d1"
}
```

where `folderId` is the folder id of the root folder that is manually created. Once the very most root folder is added to dynamo the service is ready to use.
