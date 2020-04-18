The code in this folder is used within our AWS Lambda functions:<br>

SendReminderNotification.py:<br>
Is executed every 5 minutes by AWS Cloudwatch.
It queries the DynamoDB holding notifications waiting to be sent and checks for notifications to be sent.
It will then either send an email via SMTP or a SMS message by invoking the Twilio API with the notification payload.

StoreNoficationData.py:<br>
Is executed after the user has submitted a notification signup request. It simply reformats the notifcation time in a way that python
can understand. Then the sent data is placed into the DynamoDB table.
