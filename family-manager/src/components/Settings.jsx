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


const useStyles = makeStyles((theme) => ({
    appBar: {
      background: 'linear-gradient(45deg, #009688 30%, #4CAF50 90%)',
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
    const [fireDocId] = useState(props.fbID);
    const [sharedUsers, setSharedUsers] = useState([])
    const [childUsers, setChildUsers] = useState([])
    const [isMasterUser, setMasterUser] = useState(false)
    const [childTasks, setChildTasks] = useState([])

    const [open, setOpen] = useState(false);

    const [newUserEmail, setUserEmail] = useState("");
    const [newUserIsChild, setNewUserIsChild] = useState(false)


    let getSettings = new SettingService()


    const classes = useStyles();
    const [newUserOpen, setNewUserOpen] = useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    const handleUserClickOpen = () => {
      setNewUserOpen(true);
  };

  const handleUserClose = () => {
    setNewUserOpen(false);
  };


    useEffect(() => {
        getSettings.fetchUserData(true, email, loadData,fireDocId);
      },[]);


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

      removeChild.map(c => {
        db.collection("UserCalendarData").doc(fireDocId).update({
          childrenTasks: firebase.firestore.FieldValue.arrayRemove({chore: c.chore, date: c.date, email:c.email})
    });
      })
     
      
       setChildTasks(childTasks.filter((t) => t.email !== email))
       setChildUsers(childUsers.filter(u => u !== email));


          
      }
  }


  function processNewUser(e) {

    if(newUserEmail !== ""){
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
    }

    setNewUserIsChild(false)
    setUserEmail("")
    setNewUserOpen(false)
    return
  }

    // gets the difference between sharedUsers[] and childUsers[]
  
   let sUsers = sharedUsers.filter(x => !childUsers.includes(x)).concat(childUsers.filter(x => !sharedUsers.includes(x)));
    
    let shared = ""

    if(sUsers.length > 0){
      shared = sUsers.map( u => <SettingsDialog email={u} type="shared" onDeleteClick={deleteTask} />)
    }

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

        {/* <Typography variant="h4" className={classes.subTitle}>Users</Typography> */}

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
      </Dialog>


        

      </Dialog>
    </div>
    )
}

export default Settings