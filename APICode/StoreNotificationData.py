import json
import boto3
import dateutil.parser as dt


############
#This lambda function is invoked via the API and stores valid user notification data in the DB
############


#Establish connections to the services needed
dynamodb = boto3.resource('dynamodb')
dynamoTable = dynamodb.Table('UserNotificationData')

##
#Checks if the email and phone number sent from the client is valid
##
def isValid(eventData):
    if len(eventData['email']) == 0 and len(eventData['phoneNumber']) == 0:
        return False
    else: 
        return True

##
#This is where the function begins execution when called
##
def lambda_handler(event, context):

    #Formats the passed in date into a python readable format
    formattedDate = dt.parse(event['reminderDateOffset']).isoformat()

    #If the sent data isn't valid, send a response back to the user
    if not isValid(event):
        return {
            'statusCode': 200,
            'body': json.dumps('Bad Data')
        }
    else:
        #If the data was valid, mark the empty sending medium as N/A
        if len(event['email']) == 0:
            event['email'] = "N/A"
        elif len(event['phoneNumber']) == 0:
            event['phoneNumber'] ="N/A"
        
        #Add the notification info to the DB
        dynamoTable.put_item(
            Item={
                'notificationID': event['notificationID'],
                'email': event['email'],
                'phoneNumber': event['phoneNumber'],
                'eventTitle': event['eventTitle'],
                'eventDate': event['eventDate'],
                'reminderDateOffset': formattedDate
            })
    
        #Send an HTTP 200 back to the user
        return {
            'statusCode': 200,
            'body': json.dumps('Data Submitted')
        }
