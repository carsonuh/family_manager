import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import InfoIcon from '@material-ui/icons/Info'; import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import arch from "./Images/archDiagram.png";
import demo1 from './Images/demo1.PNG';
import demo2 from './Images/demo2.PNG';
import demo3 from './Images/demo3.PNG';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },

    subTitle: {
        marginTop: theme.spacing(2),
        fontSize: '1.53em',
    },

    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },

    switch: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
    },

    heading: {
        fontWeight: 'bold'
    }
}));


/**
 * The code below creates the about page
 */
export default function Guide() {

    //Establish the state for the open/closing of the page and create the styles
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    //The two methods below handle the closing and opening of the page
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    //The three strings below are sample code loaded into the react-syntax-highlighter components
    const codeString1 = 
    `const db = firebase.firestore();
    db.collection('UserCalendarData').doc('AN9thOmBcpxERwA25xkw')
        .get()
        .then((doc) => {
            let returnedData = doc.data().events;
            for (let i = 0; i < returnedData.length; i++) {
                returnedData[i].start = returnedData[i].start.toDate();
                returnedData[i].end = returnedData[i].end.toDate();
            }
        })
        .catch((error) => {
            console.log('Error fetching user data! ' + error)';
        });`
    
    const codeString2 = 
    `
    let newEvent = {
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        id: eventData.id,
        visibility: eventData.visibility,
        owner: eventData.owner,
        startZip: eventData.startZip,
        endZip: eventData.endZip
    }

    const db = firebase.firestore();
    db.collection("UserCalendarData").doc(this.state.fireDocId).update({
        events: firebase.firestore.FieldValue.arrayUnion(newEvent)
    });
    `

    const codeString3 = 
    `
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
    `

    return (
        <div>
            <Button variant="outlined"
                id="stupid"
                startIcon={<InfoIcon />}
                fullWidth
                variant="text"
                onClick={handleClickOpen}
                style={{ marginLeft: '-9px' }}
            >
                About
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} >
                <AppBar className={classes.appBar} elevation={0}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            About
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom style={{ marginTop: '15px' }} component="div">
                        The Family Manager Shared Calendar App
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        <div style={{ width: window.innerWidth < 600 ? "95%" : "50%", margin: '0 auto', textAlign: 'justify' }}>
                            Our app is a shared calendar meant for family use. As a user you can create, edit, and delete events. You can
                            share you calendar with others and they can edit, edit, and delete events too.
                            Events can be customized with additional information such as the commute time to a location and even the weather.
                            You can signup for reminder notifications for your events, as well as add to a shopping list that everyone can see.
                            And if you have children you can assign them chores too!
                        </div>
                    </Typography>
                    <Typography variant="h6" component="div">
                        <div style={{ width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left', marginTop: '20px' }}>
                            The app has four main features:
                        </div>
                    </Typography>
                    <Typography component="div">
                        <div style={{ width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left' }}>
                            <ul style={{ paddingLeft: '25px' }}>
                                <li>A calendar that allows for adding, editing, and deleting events. It can also be shared with others</li>
                                <li>Additional event information: The weather at and commute time to an event</li>
                                <li>A notification service to recieve SMS and Email event reminders</li>
                                <li>A unified shopping list, where all users can add items to be bought</li>
                                <li>The ability to assign chores to children that the calendars been shared with</li>
                            </ul>
                        </div>
                    </Typography>

                    <ExpansionPanel style={{ width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left', marginTop: '20px' }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                    <Typography className={classes.heading}>Application Architecture</Typography>
                    </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography component="div">
                                <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                    <img src={arch} alt="architecture diagram" style={{ width: '80%' }} />
                                </div>
                                <div>
                                    The front-end of the project runs on ReactJS, this is where all user functionality is encapsulated.
                                    To store data, Firebase Cloud firestore was used, this service is a No-SQL, realtime database.
                                    For each user the data model is as follows:
                                    <ul style={{ paddingLeft: '24px', marginTop: '5px' }}>
                                        <li>User:</li>
                                        <ul style={{ paddingLeft: '20px' }}>
                                            <li>Master User: The email of the calendar's creator</li>
                                            <li>Name: The name of the calendar's creator</li>
                                            <li>Email: The email of the current user</li>
                                            <li>Events [ ]: An array of event objects</li>
                                            <li>Children [ ]: An array of children emails</li>
                                            <li>SharedUsers [ ]: An array of emails of whom the calendar is shared with</li>
                                            <li>ShoppingList [ ]: Array of shopping list items</li>
                                            <li>ChildrenTasks [ ]: Array of todos assigned to children</li>
                                        </ul>
                                    </ul>
                                    The object above is created once per calendar. Upon logging in, the application searches to see if a user
                                    is in any calendar objects SharedUsers array, if so, it loads that calendar for the user. If not, a new
                                    object exactly like the one above is pushed to the DB and the user starts with a blank calendar. The various arrays and fields
                                    in this object are updated as the user makes changes
                                    <Typography variant="button" display="block" gutterBottom style={{ marginTop: '13px' }} component="div">
                                        Reminder Notification Service
                                    </Typography>
                                    <div style={{ textAlign: 'justify' }} component="div">
                                        To make reminder notification sending possible we've setup an API running on AWS. The API makes use
                                        of AWS API Gateway to interpret an incoming request. On receiving a notification signup request, the
                                        API invokes an AWS Lambda Function. A Lambda function is just a function executed on demand, the one executed
                                        via the API stores the notification data in another No-SQL DB under the DynamoDB service.
                                        <br /><br />
                                        Another Lambda function is setup to execute every 10 minutes, this function queries the DynamoDB and determines
                                        if it's time to send a nofitication. If so, the function will send an email to the user if notification to be
                                        sent is an email. Or, the function will invoke the Twilio API to send a text message to the user with their
                                        event info.
                                    </div>
                                </div>
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel style={{ width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left', marginTop: '20px' }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                    <Typography className={classes.heading}>Packages and Code</Typography>
                    </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography component="div">
                                    Check out the project on Github <a href="https://github.com/carsonuh/family_manager">here</a>
                                    <br/>
                                    We used a number of fantastic packages to make our project possible. The major ones used are:
                                    <ul style={{ paddingLeft: '24px', marginTop: '5px' }}>
                                        <li><a href="https://www.npmjs.com/package/@material-ui/core" >Material-UI</a> - This package was responsible for all the styling you see</li>
                                        <li><a href="https://www.npmjs.com/package/@react-google-maps/api" >@react-google-maps/api</a>  - It's a wrapper around the Google Maps API</li>
                                        <li><a href="https://www.npmjs.com/package/moment" >moment-js</a>  - A Date manipulator for javascript</li>
                                        <li><a href="https://www.npmjs.com/package/firebase" >firebase</a>  - A wrapper around Firebase for react</li>
                                        <li><a href="https://www.npmjs.com/package/react-animated-weather" >react-animated-weather</a> - A set of weather icons</li>
                                        <li><a href="https://www.npmjs.com/package/react-syntax-highlighter">React Syntax Highlighter</a> - To present code on the webpage</li>
                                        <li><a href="https://www.twilio.com/">Twilio</a> - A SMS sending service to send notifications</li>
                                    </ul>

                                    Code Referenced: 
                                    <ul style={{ paddingLeft: '24px', marginTop: '5px' }}>
                                        <li>For Regex to validate phone numbers and emails we used the following sources: </li>
                                        <ul style={{paddingLeft: '18px'}}>
                                            <li><a href="https://stackoverflow.com/questions/123559/how-to-validate-phone-numbers-using-regex">Source 1</a></li>
                                            <li><a href="https://emailregex.com/">Source 2</a></li>
                                            <li><a href="https://www.twilio.com/docs/sms/quickstart/python">Twilio Python Code</a> We adapted this code when setting up the invocation to twilio in our AWS Lambda Function</li>
                                        </ul>
                                    </ul>
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    

        
                    <ExpansionPanel style={{ width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left', marginTop: '20px' }}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Want to interact with our data?</Typography>
                        </ExpansionPanelSummary>
                            <ExpansionPanelDetails>


                    
                                <Typography component="div">        
                                    Since user data is stored on Firebase interacting with it is quite easy. You'll need the following information
                                    <ul style={{ paddingLeft: '24px', marginTop: '5px' }}>
                                        <li>Collection Name: UserCalendarData</li>
                                        <li>Document ID: These are like rows in a table</li>
                                        <li>Some Pre-existing document ID's: AN9thOmBcpxERwA25xkw & OOm5YZGfMgggbB9874Ea</li>
                                    </ul>
                                        Using the Collection Name and one of the Document IDs, You can push data like this:
                                            
                                            {
                                                window.innerWidth > 1400 ?
                                                <SyntaxHighlighter language="javascript" style={atomDark} wrapLines={true}>
                                                    {codeString1}
                                                </SyntaxHighlighter>
                                                :
                                                <img src={demo1} style={{width: '100%'}}></img>
                                            }
                                            

        

                                        <span style={{ textAlign: 'center' }}>You can also push data, most of the time, you'll be adding data to fields in a document.</span>
                                        {
                                                window.innerWidth > 1400 ?
                                                <SyntaxHighlighter language="javascript" style={atomDark} wrapLines={true}>
                                                    {codeString2}
                                                </SyntaxHighlighter>
                                                :
                                                <img src={demo2} style={{width: '100%'}}></img>
                                        }
                                        Checkout the Firebase documentation <a href="https://firebase.google.com/docs/firestore">Here</a> to see what else you can do.
                                        <br />
                                    <Typography variant="button" display="block" gutterBottom style={{ marginTop: '53px' }} component="div">
                                        Interacting with the reminder notification service:
                                    </Typography>
                                    To invoke the notifcation service API endpoint, you'll need this url:
                                    <ul style={{ paddingLeft: '24px', marginTop: '5px' }}>
                                        <li>'https://291msffnw9.execute-api.us-east-1.amazonaws.com/Dev/sharedcal'</li>
                                        <li>The request must be of type POST and should have the following data in the body</li>
                                        <li>Notification ID: A randomly generated identifer for the notifcation</li>
                                        <li>Email: The users email, if it's an email reminder</li>
                                        <li>PhoneNumber: The users phone number, if it's a text reminder</li>
                                        <li>Reminder Date Offset: The current date plus the offset for the reminder. This can be 10 minutes, 1 hour, or 1 day</li>
                                        <li>Event Date: The Date of the event</li>
                                        <li>Note: You must specifiy an email, phone number, or both!</li>
                                    </ul>
                                    Here's an Example:

                                    {
                                                window.innerWidth > 1400 ?
                                                <SyntaxHighlighter language="javascript" style={atomDark} wrapLines={true}>
                                                    {codeString3}
                                                </SyntaxHighlighter>
                                                :
                                                <img src={demo3} style={{width: '80%'}}></img>
                                        }
                                </Typography>
                            </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel style={{ width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left', marginTop: '20px' }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                    <Typography className={classes.heading}>Testing The Project</Typography>
                    </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography component="div">
                                <div>
                                    For testing we used:
                                    <ul style={{ paddingLeft: '24px', marginTop: '5px' }}>
                                        <li>React-Testing-Library for unit tests: "npm run test"</li>
                                        <li>Cypress for automation testing: "npm run cypress"</li>
                                        <li><b>Make Sure "npm install" has been run first</b></li>
                                    </ul>
                                    <br />
                                    To test each feature manually you can do:
                                    <ul style={{ paddingLeft: '24px', marginTop: '5px' }}>
                                        <li>Adding, Editing, Deleting Events, and Sharing the calendar:</li>
                                        <ul style={{paddingLeft: '18px'}}>
                                            <li><b>Login First!</b></li>
                                            <li>Add events via the 'plus' icon at the bottom right of the screen</li>
                                            <li>Once you've added an event you can edit or delete it by clicking on the event in the calendar</li>
                                            <li>To Share the calendar click the menu button in the top left and go to the settings page, then click the 'plus' icon</li>
                                        </ul>
                                        <li style={{marginTop: '10px'}}>Additional Event information (Google Maps and Weather): </li>
                                        <ul style={{paddingLeft: '18px'}}>
                                            <li><b>Login First!</b></li>
                                            <li>Add an event then edit it.</li>
                                            <li>For Maps data to appear the start and end zipcodes must be different and <b>Valid</b></li>
                                            <li>Weather data is based off of the end zipcode is must also be <b>Valid</b></li>
                                            <li>Once you've updated the zipcode fields, click the 'submit' button. And then click on your event again</li>
                                        </ul>
                                        <li style={{marginTop: '10px'}}>Notification Service:</li>
                                        <ul style={{paddingLeft: '18px'}}>
                                            <li><b>Login First!</b></li>
                                            <li>Make sure the calendar has events on it</li>
                                            <li>Click the 'plus' icon in the bottom right and select the bell</li>
                                            <li>Select your event, when you want the reminder, and enter your email phone number or both</li>
                                            <li>Click submit and you'll recieve your notification through the medium you selected</li>
                                        </ul>
                                        <li style={{marginTop: '10px'}}>Shopping List:</li>
                                        <ul style={{paddingLeft: '18px'}}>
                                            <li><b>Login First!</b></li>
                                            <li>Select the menu button in the top right</li>
                                            <li>Click shopping list, type an item in the input box and click the 'plus icon'</li>
                                            <li>You'll have to login with the account you shared the calendar with to see the shopping list from another perspective</li>
                                        </ul>
                                        <li style={{marginTop: '10px'}}>Chore assignment:</li>
                                        <ul style={{paddingLeft: '18px'}}>
                                            <li><b>Login First and make sure the calendar has been shared with a child!</b></li>
                                            <li>Select the menu button in the top right</li>
                                            <li>Click the 'plus' icon next to Chore List, complete the fields that appear then click 'Submit'</li>
                                            <li>You'll have to login with a child account to see the chores from the children perspective</li>
                                        </ul>
                                    </ul>
                                </div>
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    
                </DialogContent>
            </Dialog>
        </div>
    )
}