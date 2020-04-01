
export default class NotificationService {

    static sendDataToAWS(signupData) {
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
        .then((response) => console.log(response))
    }

    static forwardNotificationSignup(signupData) {
        let date = new Date();
        let notificationID = Math.floor(Math.random() * 100000);

        if (signupData.reminderDateOffset === 1) {
            date.setMinutes(date.getMinutes() + 10);
        } else if (signupData.reminderDateOffset === 2) {
            const inc = 1000 * 60 * 60;
            date.setTime(date.getTime() + inc);
            
        } else if (signupData.reminderDateOffset === 3) {
            date.setDate(date.getDate() + 1);
        }

        let finalDateStr = date.toString().split('(')[0];
        signupData.reminderDateOffset = finalDateStr;
        signupData.notificationID = notificationID;
        console.log("in notification service");
        console.log(signupData);
   
        NotificationService.sendDataToAWS(signupData);
    }
}