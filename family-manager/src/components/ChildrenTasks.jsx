import React, {useState, useEffect} from 'react';
import SharedCalendarService from "../Services/SharedCalendarService"
import ChildrenTasksService from '../Services/ChildrenTasksService';
import firebase from "../firebase"
import "./shoppingList.css"
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import {
    MuiPickersUtilsProvider, DatePicker
  } from '@material-ui/pickers';

import {
    TextField, FormControl, Select,
    InputLabel, Dialog, DialogActions,
    DialogContent, DialogTitle, Button,
    List, Box, IconButton,
    Typography, FormGroup, Badge 
  } from '@material-ui/core';

  import ChildTaskList from "./ChildTaskList"
  import ChildTaskListParentView from "./ChildTaskListParentView"
  import AddCircleIcon from '@material-ui/icons/AddCircle';
  import Tooltip from '@material-ui/core/Tooltip';

  import ExpansionPanel from '@material-ui/core/ExpansionPanel';
  import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
  import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
  import useMediaQuery from '@material-ui/core/useMediaQuery';
  import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
  import CloseIcon from '@material-ui/icons/Close';
  import { makeStyles, useTheme} from '@material-ui/core/styles';
  import ListIcon from '@material-ui/icons/List';


  /**
   * CSS styles
   */
  const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },

    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: '#FFFFFF',
    },

    submit: {
        position: 'relative',
        right: theme.spacing(1),
        bottom: theme.spacing(1),
    },

    row: {
        marginBottom: theme.spacing(2),
    },

    etitle: {
        fontSize: "20px",
    },

    elements: {
        width: '100%'
    }

}));

/**
 * @param {userEmail} props 
 */
function ChildrenTasks(props){

    const [email] = useState(props.userEmail);
    const [fireDocId, setFireDocID] = useState(null);
    const [children, setChildren] = useState([]);
    const [childrenTasks, setChildTask] = useState([]);
    const [isMasterUser, setMasterUser] = useState(false);
    const [isChildUser, setChildUser] = useState(false);
    const [myChores, setMyChores] = useState([]);
    const [formChore, setFormChore] = useState("");
    const [formDate, setFormDate] = useState(moment().format('ll'));
    const [formAssigned, setFormAssigned] = useState("default");
    const [open, setOpen] = useState(false);


    let verifyUser = new SharedCalendarService()
    let childService = new ChildrenTasksService();

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    /**
     * When page loads check if user exists, check if user is a child
     */
    useEffect(() => {
        verifyUser.checkIfUserExists(userExists, email);
        verifyUser.checkIfUserIsChild(childStatus, email);
        
      },[]);

    /**
     * if user exists update firedoc id and load the data from the db
     * @param {userExists} e 
     * @param {firebase ID} fireDocId 
     */
    let userExists = (e, fireDocId) => {
        if (e) {
            setFireDocID(fireDocId );
            childService.fetchUserData(true, email, loadData,fireDocId);
            childService.realTime(rtUpdate, fireDocId);
        } 

        // if user does not exists check if they are a shared user 
        else{
            verifyUser.checkSharedUser(isSharedUser, email)
        }
    } 

    /**
     * realtime data checking. If a new change is pinged by
     * firebase then a new update happens without page refresh
     * @param {new chores} update 
     */
    let rtUpdate = (update) => {
        setChildTask(update.childrenTasks);
        childSort(update.childrenTasks);
    }

    /**
     * if user is a shared user update firedoc id
     * @param {account type} type 
     * @param {firebase ID} fireDocId 
     */
    let isSharedUser = (type, fireDocId) => {
        if(type===2){
            setFireDocID(fireDocId);
            childService.fetchUserData(true, email, loadData, fireDocId);
        }
    }

    /**
     * callback: load data from database
     * @param {data from DB} info 
     */
    let loadData = (info) => {
        setChildTask(info.childrenTasks);
        childSort(info.childrenTasks);
        setChildren(info.myChildren);
        setMasterUser(info.isMasterUser);
    }

    
    /**
     * callback: T/F for status of child
     * @param {isChild} status 
     */
    let childStatus = (status) => {
        setChildUser(status);
    }

    /**
     * Populates dropdown list with children for the
     * parent to pick
     * @param {child} props 
     * @returns <option>Child</option>
     */
    function listchild(props) {
        return(
            <option key={props.key} value={props.name}>{props.name}</option>
        )
    }

    /**
     * Process form for adding a new chore. If the data passes validation
     * then it gets sent to the db
     * @param {FormData} e 
     */
    function processForm(e) {
        e.preventDefault();

        // check if values are not empty or equal to the default
        if(formAssigned !== "default" && formChore !== "" && formDate !== ""){
            let data = {email: formAssigned, chore: formChore, date: formDate};

            // children tasks is not empty
            childrenTasks.length > 0 ? 
            setChildTask([...childrenTasks, data])
                :
            // children task is empty
            setChildTask([data,]);

            submitToDB(data)
            childSort([...childrenTasks, data]);
        }
        else{
        }
        setFormChore("");
        setFormAssigned("default")
        setFormDate(moment().format('ll'))
        handleClose()
    }

    /**
     * saves form data to firebase after it passes validation
     * @param {*} data 
     */
    let submitToDB = (data) =>{
        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(fireDocId).update({
            childrenTasks: firebase.firestore.FieldValue.arrayUnion(data)
        });
    }
    

    /**
     * Deletes chore from database 
     * @param {*} chore 
     * @param {*} child 
     * @param {*} date 
     */
    let deleteTask = (chore, child, date) => {
        const db = firebase.firestore();
         db.collection("UserCalendarData").doc(fireDocId).update({
            childrenTasks: firebase.firestore.FieldValue.arrayRemove({chore: chore, email: child, date: date})
        });

        let newArr = childrenTasks.filter(task => task.chore !== chore);
        childSort(newArr);
        return setChildTask(newArr);
    }

    /**
     * Opens dialog
     */
    const handleClickOpen = () => {
        setOpen(true);
    };

    /**
     * Closes dialog
     */
    const handleClose = () => {
        setOpen(false);
    };


    /**
     * Filter out only chores that belong to this child
     * @param {chores} tasks 
     */
    let childSort = (tasks) => {
        let mine = tasks.filter(chore => chore.email === email)
        return setMyChores(mine);
    }

    
    // populate dropdown list with children
    let l = children.map((i, index) => listchild({name: i, key:index}));
    let childList;
    
    childList = childrenTasks.map((i, index) => {
        return <ChildTaskListParentView key={index} chore={i.chore} child={i.email} date={i.date} onDeleteClick={deleteTask} />
    })

    let forchildList = myChores.map( (i, index) => {
            return <ChildTaskList key={index} chore={i.chore} child={i.email} date={i.date} onDeleteClick={deleteTask} />
        })

  
    
    return( 
        <div>
            {/** If parent user - show parent expansion panel */}
            { isMasterUser ? 
           (   
            <Box className="box" >
                <ExpansionPanel elevation={0} >
                <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >

                <Badge badgeContent={childrenTasks.length} color="error" >   
                    <ListIcon style={{color: "#b0aead"}}/>
                </Badge>
               <Typography 
                style={{flexBasis: '66.66%',
                flexShrink: 0, marginLeft: "25px", marginTop: "-5px"}}
                variant="h6"
                >
                    Chore List</Typography>
                 <div style={{height:"25px", marginTop: "-3px"}}>
                 <Tooltip title="New Chore" aria-label="add">
                    <IconButton aria-label="settings"  onClick={handleClickOpen} 
                    style={{postion: "absolute", top: "-10px", left: "-15px" }}>
                        <AddCircleIcon />
                    </IconButton>
                    </Tooltip>
               </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
            <Box className="inner-box">
                    
                    <List>{childList}</List>
             </Box>
            </ExpansionPanelDetails>
          </ExpansionPanel>

                </Box>

           )
                :
                null
            }

            {   /** If Child users - display child chore expansion panel */
                isChildUser ? 
               ( 
               <Box className="box">
             
                <ExpansionPanel elevation={0} >
                <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >

                <Badge badgeContent={childrenTasks.length} color="error" >   
                    <ListIcon style={{color: "#b0aead"}}/>
                </Badge>
               <Typography 
                style={{flexBasis: '66.66%',
                flexShrink: 0, marginLeft: "25px", marginTop: "-5px"}}
                variant="h6"
                >
                    Your Chores</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
            <Box className="inner-box">
                    
                    <List>{forchildList}</List>
             </Box>
            </ExpansionPanelDetails>
          </ExpansionPanel>
            </Box>
                )
                : null
            }
      
            {/** Form for adding new chore */}
            <Dialog 
             open={open}
             onClose={() => setOpen(false)}
             fullScreen={fullScreen}
             >
                <DialogTitle id="form-dialog-title">
                    
                    Assign Chore
                
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                
                </DialogTitle>
                    <DialogContent>


                        <FormGroup row={true} className={classes.row}>
                            <TextField 
                                id="outlined-basic" 
                                className={classes.elements}
                                label="Chore" 
                                variant="outlined" 
                                name="chore" 
                                value={formChore} onChange={(e) => setFormChore(e.target.value)} 
                            />
                        </FormGroup>
                       
                        <FormGroup row={true} className={classes.row}>
                            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                <DatePicker
                                    autoOk
                                    disableToolbar
                                    disablePast
                                    className={classes.elements}
                                    variant="inline"
                                    inputVariant="outlined"
                                    margin="normal"
                                    name="date"
                                    label="Date"
                                    format="MM/DD/YYYY"
                                    value={formDate}
                                    onChange={(e) => setFormDate(moment(e._d).format('ll'))}
                                    />
                            </MuiPickersUtilsProvider>
                        </FormGroup>

                        <FormGroup row={true} className={classes.row}>
                            <FormControl  variant="outlined" className={classes.elements}>
                                <InputLabel htmlFor="child_list">Child</InputLabel>
                                <Select
                                    native
                                    className={classes.elements}
                                    value={formAssigned}
                                    onChange={(e) => setFormAssigned(e.target.value)}
                                    label="Child"
                                    inputProps={{
                                        name: 'Child',
                                        id: 'child_list',
                                    }}
                                    >
                                    <option aria-label="None" value="" />
                                    {l}
                                </Select>
                            </FormControl>
                        </FormGroup>
                </DialogContent>

                <DialogActions>
                    <Button onClick={(e) => processForm(e)} variant="outlined" color="secondary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ChildrenTasks