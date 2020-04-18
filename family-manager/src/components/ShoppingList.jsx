import React, { Component } from "react"
import firebase from '../firebase.js';
import DisplayItem from "./DisplayItem"
import "./shoppingList.css"
import Box from '@material-ui/core/Box';
import { IconButton, TextField, Typography, FormGroup, InputAdornment, Badge } from "@material-ui/core";


import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

class ShoppingList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userEmail: this.props.userEmail,
            fireDocId: null,
            newItem: "",
            items: []
        }
        this.fetchListData = this.fetchListData.bind(this);
        this.getFireDocId = this.getFireDocId.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.handleCBChange = this.handleCBChange.bind(this);
    }

    componentDidMount() {
        this.getFireDocId(this.fetchListData);
    }

    /**
     * Checks to see if a signed in user has data in the DB
     * Returns a boolean of the above condition into the callback
     * @param {callback function} callback 
     */
    getFireDocId(callback) {
        //Connect to the firebase DB
        const db = firebase.firestore();

        //Query the DB to see if the users email is present
        db.collection("UserCalendarData").where("email", "==", this.state.userEmail)
            .get()
            .then((querySnapshot) => {
                let userExists = false;

                //If the email isn't present, the user doesn't exist
                if (querySnapshot.size === 0) {
                    userExists = false;
                } else {
                    //If the email does exist, update the firestore document ID in state
                    this.setState({ fireDocId: querySnapshot.docs[0].id });
                    userExists = true;

                }
                callback(userExists, this.fetchListData);

            })
            .catch((error) => {
            });
    }

    /**
     * Loads user data into the calendar via a DB call and a state update
     * @param {whether a user exists} userExists 
     */
    fetchListData(userExists, callback) {

        //If a user exists pull their event data from the DB
        if (userExists) {
            const db = firebase.firestore();
            db.collection("UserCalendarData").doc(this.state.fireDocId)
                .get()
                .then((doc) => {
                    if (doc) {
                        let returnedData = doc.data().shoppingList;
                        this.setState({ items: returnedData });
                    } else {
                    }
                })
                .catch((error) => {
                })
        } else {
            //Check to see if the user is included in any shared calendar
            //Connect to the firebase DB
            const db = firebase.firestore();
            //Query the DB to see if the users email is present
            db.collection("UserCalendarData").where("sharedUsers", "array-contains", this.state.userEmail)
                .get()
                .then((querySnapshot) => {
                    this.setState({ fireDocId: querySnapshot.docs[0].id });
                    callback(true, null);
                })
                .catch((error) => {
                });
        }
    }

    /**
     * When a new event is added send it to the DB 
     * @param {new event data} itemData 
     */
    updateStorage(itemData) {
        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            shoppingList: firebase.firestore.FieldValue.arrayUnion(itemData)
        });
    }

    /**
     * When item is checked off list, then delete it from the database
     * @param {item} itemData 
     */
    deleteStorage(itemData) {
        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            shoppingList: itemData
        });
    }

    /**
     * When item textfield is changed then set the state of newItem
     * to the value of textfield
     * @param {*} e 
     */
    handleChange(e) {
        this.setState({ newItem: e.target.value })
    }

    /**
     * When add button is clicked check if item is not null and then add to
     * the database
     * @param {*} name 
     */
    handleClick(name) {
        let i = { completed: false, item: name }

        this.setState({ newItem: "" })

        if (name !== "") {
            this.state.items.length > 0 ?
                this.setState({ items: [...this.state.items, i,], })
                :
                this.setState({ items: [i] });

            this.updateStorage(i);
        }

        return
    }

    /**
     * When item checkbox is selected then flip the completed state to true
     * and delete the item that is now selected.
     * 
     * A timeout delay of 270 ms is added for an animation effect. 
     * @param {*} itemName 
     */
    handleCBChange(itemName) {
        this.setState(prevState => {
            const updatedList = prevState.items.map((item, index) => {
                if (item.item === itemName) {
                    item.completed = !item.completed
                    setTimeout(() => { this.deleteItems(item.index); }, 270);
                }
                return item
            })
            return {
                items: updatedList
            }
        })
    }

    /**
     * Deletes item from state and makes those changes to the database. This method is 
     * called from handleCBChange when item selected is true
     * @param {*} id 
     */
    deleteItems(id) {
        let allItems = this.state.items;

        // only select items that have not been completed yet
        let notCompleted = allItems.filter((item) => item.completed === false);

        // update state with items not completed
        this.setState({ items: notCompleted });
        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            shoppingList: [...notCompleted]
        });
    }


    render() {

        let itemCB;

        if (this.state.items.length > 0) {
            itemCB = this.state.items.map((item) => {
                return <DisplayItem key={item.item} item={item.item} completed={item.completed} handleChange={this.handleCBChange} />
            });
        }
        else {
            itemCB = <p>No items</p>
        }

        return (
            <Box className="box">
                <ExpansionPanel elevation={0}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        aria-label="expand"
                    >
                        <Badge badgeContent={this.state.items.length} color="error" >
                            <ShoppingCartIcon style={{ color: "#b0aead" }} />
                        </Badge>

                        <Typography style={{ marginLeft: "25px", marginTop: "-4px" }} variant="h6">Shopping List</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Box className="inner-box" aria-label="list">

                            {itemCB}
                            <FormGroup row={true}>

                            </FormGroup>
                            <TextField id="addItem" size="small" label="Add Item" variant="outlined" value={this.state.newItem}
                                onChange={this.handleChange}

                                inputProps={{ "data-testid": "itemInput" }}
                                InputProps={
                                    {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton aria-label="add" type="submit" onClick={() => this.handleClick(this.state.newItem)}
                                                    size="small">
                                                    <AddCircleIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }
                            />
                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Box>
        )
    }
}

export default ShoppingList