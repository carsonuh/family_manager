import React, { useState } from 'react';
import InfoIcon from '@material-ui/icons/Info';import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle, DialogContent, Divider } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import arch from "./archDiagram.png";



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
  }));

export default function Guide() {

    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined"
                startIcon={<InfoIcon />}
                fullWidth
                variant="text"
                onClick={handleClickOpen}
                style={{marginLeft: '-9px'}}
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
                <DialogContent style={{textAlign: 'center'}}>
                    <Typography variant="h4" gutterBottom style={{marginTop: '15px'}} component="div">
                        The Family Manager Shared Calendar App
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        <div style={{width: window.innerWidth < 600 ? "95%" : "50%", margin: '0 auto', textAlign: 'justify'}}>
                            Our app, is a shared calendar meant for family use. As a user you can create, edit, and delete events. You can 
                            share you calendar with others and they can edit, edit, and delete events too.
                            Events can be customized with additional information such as the commute time to a location and even the weather.
                            You can signup for reminder notifications for your events, as well as add to a shopping list that everyone can see.
                            And if you have children you assign them chores too!
                        </div>
                    </Typography>
                    <Typography variant="h6" component="div">
                        <div style={{width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left', marginTop: '20px'}}>
                            The app has four main features:
                        </div>
                    </Typography>
                    <Typography component="div">
                        <div style={{width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left'}}>
                            <ul style={{paddingLeft: '25px'}}>
                                <li>A calendar that allows for adding, editing, and deleting events. It can also be shared with others</li>
                                <li>Additional event information: The weather at and commute time to an event</li>
                                <li>A notification service to recieve SMS and Email event reminders</li>
                                <li>A unified shopping list, where all users can add items to be bought</li>
                            </ul>
                        </div>
                    </Typography>
                    <Typography variant="h6" component="div">
                        <div style={{width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left', marginTop: '20px'}}>
                            Application Architecture:
                            <div style={{textAlign: 'center', marginTop: '5px'}}>
                                <img src={arch} alt="architecture diagram" style={{width: '80%'}} />
                            </div>
                        </div>
                    </Typography>
                    <Typography component="div">
                        <div style={{width: window.innerWidth < 600 ? "95%" : "50%", margin: "0 auto", textAlign: 'left', marginTop: '20px', textAlign: 'justify'}}>
                            The front-end of the project runs on ReactJS, this is where all user functionality is encapsulated. 
                            To store data, Firebase Cloud firestore was used, this service is a No-SQL, realtime database. 
                            For each user the data model is as follows:
                            <ul style={{paddingLeft: '24px', marginTop: '5px'}}>
                                <li>User:</li>
                                <ul style={{paddingLeft: '20px'}}>
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
                            object exactly like the one above is pushed to the DB and the user starts with a blank calendar.

                            <Typography variant="button" display="block" gutterBottom style={{marginTop:'13px'}} component="div">
                                Reminder Notification Service
                            </Typography>
                            <div style={{textAlign: 'justify'}} component="div">
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
                </DialogContent>
            </Dialog>
        </div>
    )
}