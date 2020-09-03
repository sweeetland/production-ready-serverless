# PRODUCTION-READY-SERVERLESS

This is a boilerplate serverless service to speed up the creation of new serverless services. Complete with CI via GH Actions, TypeScript, ESlint & [lambda-hooks](https://github.com/sweeetland/lambda-hooks).

## How to use

1. Click on use this template in the github console and choose a unique repo name
2. Use the name above and edit the existing name in package.json
3. Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as github secrets.
4. On a push/merge to production, staging or development a GH action will run serverless deploy

Happy Hacking!!
