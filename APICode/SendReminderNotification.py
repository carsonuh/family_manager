from collections import Counter
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import timezone
from datetime import datetime
from dateutil import parser
import datetime
import boto3
import os
import smtplib
import json

############
#This lambda function is invoked via AWS cloudwatch events every 5 minutes and handles notifcation sending
#Via email and text
############


#Create connections to the required services
msgClient = boto3.client('sns')
dynamodb = boto3.resource('dynamodb')
dynamoTable = dynamodb.Table('UserNotificationData')

TWILIO_SMS_URL = "https://api.twilio.com/2010-04-01/Accounts/{}/Messages.json"
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")

##
#Gets the notifications to be sent from the db, compares the times of when a notification should be sent to the current time.
#Adds notifcations that should be sent out via text and email to lists, respectively
##
def getReminderData():

    #Pull all the notification data from the DB
    notificationDataTable = dynamoTable.scan()['Items']

    #Create an interval of time to compare each notification to
    searchStartTime = (datetime.datetime.now(timezone.utc) - datetime.timedelta(minutes=240)).replace(microsecond=0)
    searchEndTime = (searchStartTime + datetime.timedelta(minutes=10)).replace(microsecond=0)
    
    emailNotificationList = []
    textNotificationList = []

    #For every entry in the table, compare its time to be sent to the interval created above
    #If the notification can be sent, add it to it's respective list.
    for i in range(len(notificationDataTable)):
        timeString = notificationDataTable[i]['reminderDateOffset'].replace('T', ' ').split('+')
        timeOffsetRemoved = timeString[1].replace('4', '0')
        finalTimeString = timeString[0] +"+"+ timeOffsetRemoved
        timeObject = parser.parse(finalTimeString)
        
        if timeObject >= searchStartTime and timeObject <= searchEndTime:
            if notificationDataTable[i]['email'] == 'N/A':
                textNotificationList.append(notificationDataTable[i])
            elif notificationDataTable[i]['phoneNumber'] == 'N/A':
                emailNotificationList.append(notificationDataTable[i])
            else:
                textNotificationList.append(notificationDataTable[i])
                emailNotificationList.append(notificationDataTable[i])
                
            
    return emailNotificationList, textNotificationList
    
    
##
#Sends Emails to the recipients in the email notification list
##
def sendEmails(emailsList):

    #Connect to Googles SMTP server and start TLS connection
    s = smtplib.SMTP(host='smtp.gmail.com', port=587)
    s.starttls()
    
    #Login to the service with our email and password
    s.login('EMAIL_HERE', 'PW_HERE')

    #For every email notificaiton in the list, build a notification using MIME
    for i in range(len(emailsList)):
        msg = MIMEMultipart()
        message = 'Event Reminder! ' + emailsList[i]['eventTitle'] + ' Is on ' + emailsList[i]['eventDate'] + '\n'
        bodySeparator ="\n\n\n\n\n\n"

        msg['From'] = 'eventrem@gmail.com'
        msg['To'] = emailsList[i]['email']
        msg['Subject'] = 'Event Reminder'
        
        msg.attach(MIMEText(message, 'plain'))
        msg.attach(MIMEText(bodySeparator, 'plain'))
        
        #Send and then delete the email, also remove the notification entry from the table
        s.send_message(msg)
        del (msg)
        response = dynamoTable.delete_item(
            Key={
                'notificationID': emailsList[i]['notificationID']
            }
        )

##
#Sends Texts to the recipients in the text notification list
## 
def sendTexts(phonesList):

    #Using AWS SNS, send a text message to all recipients in the text message list passed in
    for i in range(len(phonesList)):
        phoneNumber = '1'+phonesList[i]['phoneNumber'].replace('-','')
        print(phoneNumber)
        message = 'Event Reminder! ' + phonesList[i]['eventTitle'] + ' Is on ' + phonesList[i]['eventDate']
      
        #Build twilio data    
        populated_url = TWILIO_SMS_URL.format(TWILIO_ACCOUNT_SID)
        post_params = {"To": phoneNumber, "From": '+12184613855', "Body": message}
      
        data = parse.urlencode(post_params).encode()
        req = request.Request(populated_url)
        
        #Add our authentication data to the request headers we plan on invoking the twilio api with
        authentication = "{}:{}".format(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        base64string = base64.b64encode(authentication.encode('utf-8'))
        req.add_header("Authorization", "Basic %s" % base64string.decode('ascii'))
        
        try:
            # perform HTTP POST request
            with request.urlopen(req, data) as f:
                print("Twilio returned {}".format(str(f.read().decode('utf-8'))))
        except Exception as e:
            # something went wrong!
            return e
        
        #Delete the notification data from the DB once it has been sent
        response = dynamoTable.delete_item(
            Key={
                'notificationID': phonesList[i]['notificationID']
            }
        )

##
#Obtains data from the emails and phones list to determine which notifications should be sent
#Passes in the received data to the appropriate notification sending method
##
def sendNotifications():
    emailsList, phonesList = getReminderData()
    sendEmails(emailsList)
    sendTexts(phonesList)

##
#This is where the function begins execution when called
##
def lambda_handler(event, context):

    #Send the notifications
    sendNotifications()
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
