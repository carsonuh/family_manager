import React, {useState, useEffect} from "react"
import SettingService from "../Services/SettingService"
import SettingsDialog from "./SettingsDialog"
import firebase from "../firebase"

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { 
  ListSubheader, DialogTitle, DialogContent, DialogActions,
  TextField, FormControlLabel, Switch
} from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { green } from '@material-ui/core/colors';
import SharedCalendarService from "../Services/SharedCalendarService"
import SettingsIcon from '@material-ui/icons/Settings';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

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

function Settings(props) {

    //const[masterUser, setMasterUser] = useState("")
    const [email] = useState(props.userEmail)
    const [fireDocId, setFireDocID] = useState(null);
    const [sharedUsers, setSharedUsers] = useState([])
    const [childUsers, setChildUsers] = useState([])
    const [isMasterUser, setMasterUser] = useState(false)
    const [childTasks, setChildTasks] = useState([])
    const [open, setOpen] = useState(false);
    const [newUserEmail, setUserEmail] = useState("");
    const [newUserIsChild, setNewUserIsChild] = useState(false)
    let [openSnackbar, setOpenSnackbar] = React.useState(false)
    let [alertMessage, setAlertMessage] = React.useState({message: "", severity: ""});
    
 

    let getSettings = new SettingService()
    let verifyUser = new SharedCalendarService()

    useEffect(() => {
      verifyUser.checkIfUserExists(userExists, email);
    },[]);


    let userExists = (e, fireDocId) => {
      if (e) {
          setFireDocID(fireDocId );
          getSettings.fetchUserData(true, email, loadData,fireDocId);
      } 
    }


    const classes = useStyles();
    const [newUserOpen, setNewUserOpen] = useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    // callback: load data from database
    let loadData = (info) => {
        setSharedUsers(info.sharedUsers);
        setChildUsers(info.myChildren);
        setMasterUser(info.isMasterUser);
        setChildTasks(info.childTasks);
    }

    let deleteTask = (email, type) => {
      const db = firebase.firestore();
      db.collection("UserCalendarData").doc(fireDocId).update({
        sharedUsers: firebase.firestore.FieldValue.arrayRemove(email) 
      });
        
      setSharedUsers(sharedUsers.filter(u => u !== email));

      if (type === "child") {
        db.collection("UserCalendarData").doc(fireDocId).update({
          children: firebase.firestore.FieldValue.arrayRemove(email)
        });

      let removeChild = childTasks.filter((t) => t.email === email)

      removeChild.map(c => db.collection("UserCalendarData")
      .doc(fireDocId).update({
        childrenTasks: firebase.firestore.FieldValue.arrayRemove({chore: c.chore, date: c.date, email:c.email})}))

       setChildTasks(childTasks.filter((t) => t.email !== email))
       setChildUsers(childUsers.filter(u => u !== email));  
      }
  }


  function processNewUser(e) {

      if (!isValidEmail(newUserEmail)) {
        setAlertMessage({message: "Invalid Email!", severity: "error"});
        setOpenSnackbar(true);
        return;
      }

      const db = firebase.firestore();

      db.collection("UserCalendarData").doc(fireDocId).update({
        sharedUsers: firebase.firestore.FieldValue.arrayUnion(newUserEmail)
      });
  
      setSharedUsers([...sharedUsers, newUserEmail]);
  
      if(newUserIsChild){
        db.collection("UserCalendarData").doc(fireDocId).update({
          children: firebase.firestore.FieldValue.arrayUnion(newUserEmail)
        });
  
        setChildUsers([...childUsers, newUserEmail]);
      }
      
    setAlertMessage({message: `Calendar successfully shared with ${newUserEmail}`, severity: "success"});
    setOpenSnackbar(true);
    setNewUserIsChild(false)
    setUserEmail("")
    setNewUserOpen(false)
    return
  }

  function isValidEmail(email) {

    if(email.length === 0) {
      return false;
    }

    // eslint-disable-next-line
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return true;
    }
    return false;
}

const handleSnackbarClose = (event, reason) => {
  if (reason === 'clickaway') {
      return;
  }

  setOpenSnackbar(false);
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

    // gets the difference between sharedUsers[] and childUsers[]
  
   let sUsers = sharedUsers.filter(x => !childUsers.includes(x)).concat(childUsers.filter(x => !sharedUsers.includes(x)));
    
    let shared = ""

    if(sUsers.length > 0){
      shared = sUsers.map( (u, index) => <SettingsDialog key={index} email={u} type="shared" onDeleteClick={deleteTask} />)
    }

    let child = childUsers.map( (u, index) => <SettingsDialog key={index} email={u} type="child" onDeleteClick={deleteTask} />)
    return(
        <div>

      {isMasterUser ? 
        <Button 
        startIcon={<SettingsIcon />}
        fullWidth
        variant="text"
  
        onClick={handleClickOpen}>
          Settings
        </Button>
    
        : null
  
      }

      <Dialog fullScreen open={open} onClose={handleClose} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Settings
            </Typography>
            
          </Toolbar>
        </AppBar>


        <List>
          <ListSubheader className={classes.subTitle}>Users 
            <IconButton edge="end" aria-label="delete" onClick={() => setNewUserOpen(true)}  style={{ color: green[500] }} >
               <AddIcon />
            </IconButton>
          </ListSubheader>

        <SettingsDialog email={email} type="master user" />
        {shared}
        {child}

        </List>


        <Dialog open={newUserOpen} onClose={() => setNewUserOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New User</DialogTitle>
                <DialogContent>
                    <TextField label="Email" variant="outlined" name="email" value={newUserEmail} onChange={(e) => setUserEmail(e.target.value)}></TextField>
                    <FormControlLabel
                  control={<Switch checked={newUserIsChild} className={classes.switch} onChange={() => setNewUserIsChild(!newUserIsChild)} name="checkedA" />}
                label= "Child"
                  />
                </DialogContent>

            <DialogActions>
                <Button onClick={() => setNewUserOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button color="primary" onClick={(e) => processNewUser(e)}>
                    Submit
                </Button>
            </DialogActions>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={alertMessage.severity}>
                        {alertMessage.message}
                    </Alert>
                </Snackbar>
      </Dialog>
      {
        alertMessage.severity === 'success' ?
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={alertMessage.severity}>
                        {alertMessage.message}
                    </Alert>
                </Snackbar>
        :
        null

      }
      
      </Dialog>


    </div>
    )
}

export default Settings