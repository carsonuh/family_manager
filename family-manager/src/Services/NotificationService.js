/**
 * This class acts a service layer between the front-end and our API
 * It formats data before we send it off
 */
export default class NotificationService {

    /**
     * Invokes our notification signup api with the users event data and when
     * to send the event
     * @param {user/event data} signupData 
     * @param {callback to execute when the api sends back a response} responseCallback 
     */
    static sendDataToAWS(signupData, responseCallback) {
        fetch('https://291msffnw9.execute-api.us-east-1.amazonaws.com/Dev/sharedcal', {
            method: 'POST',
            body: JSON.stringify({
                'notificationID': signupData.notificationID.toString(),
                'email': signupData.email.toString(),
                'phoneNumber': signupData.phoneNumber.toString(),
                'eventTitle': signupData.eventTitle.toString(),
                'reminderDateOffset': signupData.reminderDateOffset.toString(),
                'eventDate': signupData.eventDate.toString()
            })
        })
        .then((response) => responseCallback(response))
    }

    /**
     * Builds a new date object representing when the reminder should be 
     * sent based on the interval selected by the user
     * @param {user/event data} signupData 
     * @param {callback to pass to the sendData method} responseCallback 
     */
    static forwardNotificationSignup(signupData, responseCallback) {

        //Build a new date object 'now', and create a random notification ID
        let date = new Date();
        let notificationID = Math.floor(Math.random() * 100000);

        //Offset 1 = 10mins, offset 2 = 1 hour, offset 3= 1 day
        //Based Apply these offsets to the current time, that will create a 
        //data/time when the notification should be sent
        if (signupData.reminderDateOffset === 1) {
            date.setMinutes(date.getMinutes() + 10);
        } else if (signupData.reminderDateOffset === 2) {
            const inc = 1000 * 60 * 60;
            date.setTime(date.getTime() + inc);
            
        } else if (signupData.reminderDateOffset === 3) {
            date.setDate(date.getDate() + 1);
        }

        //Rebuild the object
        let finalDateStr = date.toString().split('(')[0];
        signupData.reminderDateOffset = finalDateStr;
        signupData.notificationID = notificationID;
           
        //Send it to the next method which invokes the API
        NotificationService.sendDataToAWS(signupData, responseCallback);
    }
}