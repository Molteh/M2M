How to deal with webhooks during development.

1) from the terminal navigate to the project folder

2) run the command ./ngrok http 3000, it will expose your localhost:3000 using a public url

3) **Telegram**: using postman send a get request to update the webhook url: https://api.telegram.org/bot1026791590:AAHo_fn33e9G66ZVO7rs_fuOzxUl5YE6rQw/setWebhook?url=yourngrokurl/api/v1/tg/incoming

4) **Whatsapp**: using twilio dashboard go to programmableSMS -> whatsappBeta -> set your webhook with the following url: yourngrokurl/api/v1/wa/incoming

5) **Facebook**: using developers.facebook.com dashboard navigate to your app, scroll down to webhooks and update the callback URL, it may be
necessary to also generate a new access token for the page.

In production, the webhooks will be set once for all with the public address of the server.