Instructions for the AWS API gate way and SES (simple email service)

There are three important parts:
A- defining the right role in the IAM console
B- defining the api with the right mapping towards ses in the API gateway
C- enable cors. Otherwise you will get an error message when used within calcgems
D- deploying to the proper stage


A belangrijk is de role die je  bij de Get mail request doet. Hierbij moet:
1) de trust relation voor api-gateway en ses gezet worden.
2) de policy met de permissies voor het versturen van de email
3) de policy AmazonAPIGatewayPushToCloudWatchLogs voor het loggen  (default optie)

Bij de trusted Entities zie je staan:
The identity provider(s) apigateway.amazonaws.com
The identity provider(s) ses.amazonaws.com




Tips
Bij cloudwatch moet je een refresh doen.
Vergeet de API niet te deployen naar een stage