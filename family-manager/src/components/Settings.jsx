import React, {useState, useEffect} from "react"
import SharedCalendarService from "../Services/SharedCalendarService"
import SettingService from "../Services/SettingService"
import SettingsDialog from "./SettingsDialog"
import firebase from "../firebase"


import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';



const useStyles = makeStyles((theme) => ({
    appBar: {
      background: 'linear-gradient(45deg, #009688 30%, #4CAF50 90%)',
      position: 'relative',
    },

    subTitle: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },

    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }));

function Settings(props) {

    //const[masterUser, setMasterUser] = useState("")
    const [email] = useState(props.userEmail)
    const [fireDocId, setFireDocID] = useState(null);
    const [sharedUsers, setSharedUsers] = useState([])
    const [childUsers, setChildUsers] = useState([])
    const [isMasterUser, setMasterUser] = useState(false)
    let verifyUser = new SharedCalendarService()
    let getSettings = new SettingService()


    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
        verifyUser.checkIfUserExists(userExists, email);
      },[]);

       // if user exists update firedoc id and load the data from the db
    let userExists = (e, fireDocId) => {
        if (e) {
            setFireDocID(fireDocId );
            getSettings.fetchUserData(true, email, loadData,fireDocId);
            console.log("User exists");
        } 
    }

    // callback: load data from database
    let loadData = (info) => {
        setSharedUsers(info.sharedUsers);
        setChildUsers(info.myChildren);
        setMasterUser(info.isMasterUser);
    }


    
    let deleteTask = (email, type) => {
      const db = firebase.firestore();

      if  (type === "shared") {
         // alert("Delete shared")
          db.collection("UserCalendarData").doc(fireDocId).update({
            sharedUsers: firebase.firestore.FieldValue.arrayRemove(email) 
        });
        
        return setSharedUsers(sharedUsers.filter(u => u !== email));
      }

      if (type === "child") {

        db.collection("UserCalendarData").doc(fireDocId).update({
          children: firebase.firestore.FieldValue.arrayRemove(email) 
      });
      
      return setChildUsers(childUsers.filter(u => u !== email));
          
      }
  }


    let shared = sharedUsers.map( u => <SettingsDialog email={u} type="shared" onDeleteClick={deleteTask} />)
    let child = childUsers.map(u => <SettingsDialog email={u} type="child" onDeleteClick={deleteTask} />)
    return(
        <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Settings
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Settings
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <Typography variant="h4" className={classes.subTitle}>Users</Typography>

        <List>

        <SettingsDialog email={email} type="master user" />
        {shared}
        {child}

        </List>
        

      </Dialog>
    </div>
    )
}

export default Settings