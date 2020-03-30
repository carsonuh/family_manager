import React, {useState} from 'react';
import { useEffect } from 'react';
import SharedCalendarService from "../Services/SharedCalendarService"
import ChildrenTasksService from '../Services/ChildrenTasksService';
import firebase from "../firebase"
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { momentLocalizer } from 'react-big-calendar';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
  } from '@material-ui/pickers';

import {
   
    TextField,
    FormControl,
    Select,
    InputLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
  } from '@material-ui/core';

function ChildrenTasks(props){

    const [email] = useState(props.userEmail);
    const [fireDocId, setFireDocID] = useState(null);
    const [children, setChildren] = useState([]);
    const [childrenTasks, setChildTask] = useState([]);
    const [isMasterUser, setMasterUser] = useState(false);
    const [isChildUser, setChildUser] = useState(false);


    const [formChore, setFormChore] = useState("");
    const [formDate, setFormDate] = useState(moment().format('ll'));
    const [formAssigned, setFormAssigned] = useState("default");
    const [open, setOpen] = React.useState(false);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };
        

    let verifyUser = new SharedCalendarService()
    let childService = new ChildrenTasksService();

    useEffect(() => {
        verifyUser.checkIfUserExists(userExists, email);
        verifyUser.checkIfUserIsChild(childStatus, email);
      },[]);

    
    let userExists = (e, fireDocId) => {
        if (e) {
            setFireDocID(fireDocId );
            childService.fetchUserData(true, email, loadData,fireDocId);
        } 
    } 

    let loadData = (info) => {
        setChildTask(info.childrenTasks);
        setChildren(info.myChildren);
        setMasterUser(info.isMasterUser);
    }

    let childStatus = (status) => {
        setChildUser(status);
    }

    function listchild(props) {

        return(
            <option value={props.name}>{props.name}</option>
        )
    }

    function processForm(e) {
        e.preventDefault();
        console.log("assigned:", formAssigned, " chore:",formChore, "date:", formDate );
        if(formAssigned !== "default" && formChore !== "" && formDate !== ""){

            let data = {email: formAssigned, chore: formChore, date: formDate};

                ChildrenTasks.length > 0 ? 
                setChildTask([...childrenTasks, data])
                    :
                setChildTask([data]);

            console.log([{email: formAssigned, chore: formChore, date: formDate}]);
            submitToDB(data)

        }
        else{
            console.log("Form has some missing data")
        }

        handleClose()
        return
    }

    function submitToDB(data) {
            const db = firebase.firestore();
            const itemList = db.collection("UserCalendarData").doc(fireDocId).update({
                childrenTasks: firebase.firestore.FieldValue.arrayUnion(data)
            });
    }
    

    let l = children.map(i => listchild({name: i}));
    return(
  

        

        <div>
            <h1>Children Tasks</h1>


            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Assign Chore
      </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Assign Chore</DialogTitle>
                    <DialogContent>
                        <TextField id="outlined-basic" label="Chore" variant="outlined" name="chore" value={formChore} onChange={(e) => setFormChore(e.target.value)} />
                        <br />
                        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                            <KeyboardDatePicker
                                //disableToolbar
                                disablePast
                                variant="inline"
                                margin="normal"
                                name="date"
                                label="Date"
                                format="MM/DD/YYYY"
                                value={formDate}
                                onChange={(e) => setFormDate(moment(e._d).format('ll'))}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                />
                        </MuiPickersUtilsProvider>
                        <br /><br />
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple">Child</InputLabel>
                            <Select
                                native
                                value={formAssigned}
                                onChange={(e) => setFormAssigned(e.target.value)}
                                label="Child"
                                inputProps={{
                                    name: 'Child',
                                    id: 'outlined-age-native-simple',
                                }}
                                >
                                <option aria-label="None" value="" />
                                {l}
                            </Select>
                        </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={(e) => processForm(e)} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>





        

            <br />
            <br />

            <p>Email: {email}</p>
            <p>Children: {children.map(i => <span>{i}, </span>)}</p>
            <div>Children: {childrenTasks.map(i => <span>{i.chore}, </span>)}</div>
            <p>isMasterUser: {isMasterUser ? "Yes" : "No" }</p>
            <p>isChildUser: {isChildUser ? "Yes" : "No" }</p>
        </div>

        
    )
}

export default ChildrenTasks