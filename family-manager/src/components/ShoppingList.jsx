import React, {Component} from "react"
import firebase from '../firebase.js';
import DisplayItem from "./DisplayItem"
import "./shoppingList.css"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import { CardHeader, IconButton, Tooltip, CardActions, Button, TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

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
        this.checkIfUserExists = this.checkIfUserExists.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleCBChange = this.handleCBChange.bind(this)
    }

    componentDidMount() {
        //Upon loading the component, check to see if a user exists
        //Return data into the callback and execute a data update
        this.checkIfUserExists(this.fetchListData)
    }

    /**
     * Checks to see if a signed in user has data in the DB
     * Returns a boolean of the above condition into the callback
     * @param {callback function} callback 
     */
    checkIfUserExists(callback) {
        //Connect to the firebase DB
        const db = firebase.firestore();

        //Query the DB to see if the users email is present
        db.collection("TestShoppingList").where("email", "==", this.state.userEmail)
            .get()
            .then((querySnapshot) => {
                let userExists = false;

                //If the email isn't present, the user doesn't exist
                if(querySnapshot.size === 0) {
                    userExists = false;
                } else {
                    //If the email does exist, update the firestore document ID in state
                    this.setState({fireDocId: querySnapshot.docs[0].id});
                    userExists = true;
                }
                callback(userExists)
            })
            .catch((error) => {
                console.log("Error Getting Documents! " + error);
            });
    }

    /**
     * Loads user data into the calendar via a DB call and a state update
     * @param {whether a user exists} userExists 
     */
    fetchListData(userExists) {

        //If a user exists pull their event data from the DB
        if(userExists) {
            console.log('user exists, fetching data');
            const db = firebase.firestore();
            db.collection("TestShoppingList").doc(this.state.fireDocId)
                .get()
                .then((doc) => {
                    if(doc) {
                        let returnedData = doc.data().items;
                        for(let i = 0; i < returnedData.length; i++) {
                            returnedData[i].completed = returnedData[i].completed;
                            returnedData[i].item = returnedData[i].item;
                        }
                        this.setState({items: returnedData});
                    } else {
                        console.log('Counldnt find user data');
                    }
                })
                .catch((error) => {
                    console.log("error fetching existing user data! " + error);
                })
        } else {
            //This block is executed if it's a users first time logging in
            alert("Welcome, Start by adding some data to the calendar");
            
            //Create an entry in the DB for the new user, update the doc ref
            //with the one retuned from add()
            const db = firebase.firestore();
            db.collection("TestShoppingList").add({
                email: this.state.userEmail,
                items: []
            }).then((docRef) => {
                this.setState({fireDocId: docRef.id});
            })
            .catch((error) => {
                console.log("error submitting first time user data" + error); 
            })
        }
    }

    /**
     * When a new event is added send it to the DB 
     * @param {new event data} itemData 
     */
    updateStorage(itemData) {
        const db = firebase.firestore();
        const itemList = db.collection("TestShoppingList").doc(this.state.fireDocId).update({
            items: firebase.firestore.FieldValue.arrayUnion(itemData)
        });
    }

    deleteStorage(itemData) {
        const db = firebase.firestore();
        const itemList = db.collection("TestShoppingList").doc(this.state.fireDocId).update({
            items: itemData
        });
    }
 
    handleChange(e) {
        this.setState({newItem: e.target.value})
    }

    handleClick(name) { 
            let i = {completed:false, item:name}

            this.setState({newItem: ""})

            this.state.items.length >0 ? 
                this.setState({items: [...this.state.items,i,],})
                    :
                this.setState({items: [i]});

            this.updateStorage(i);
         return
    }

    
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
    

    deleteItems(id){
        let allItems = this.state.items;
        console.log(allItems)
        let notCompleted = allItems.filter((item) => item.completed === false);
        this.setState({items:notCompleted});
        console.log(this.state.items);
        console.log("notcomplete: ",...notCompleted);
        const db = firebase.firestore();
        db.collection("TestShoppingList").doc(this.state.fireDocId).update({
            items: {...notCompleted}
        });
    }
 

    render()
    {
        let itemCB;
         

        if(this.state.items.length > 0){
              itemCB = this.state.items.map((item) => {
                console.log("ItemCB: ",this.state.items);
                return  <DisplayItem item={item.item} completed={item.completed} handleChange={this.handleCBChange}  />
              });
        }
        else {
            itemCB = <p>No items</p>
        }
        
            
    
        
        return (
       
       <Box className="box">
           <Card className="card" variant="outlined">
               <CardHeader
                   action={
                       <Tooltip title="Add Item"> 
                        <IconButton aria-label="add">
                            <AddIcon style={{fill: "#4caf50"}} />
                        </IconButton>
                   </Tooltip>
                   
                    }
                    title="Shopping List"
                />
                <CardContent>
                    {itemCB}
                </CardContent>
                <CardActions>
        
                    <TextField id="addItem" size="small" label="Add Item" variant="outlined" value={this.state.newItem} onChange={this.handleChange} />
                    <Button onClick={() => this.handleClick(this.state.newItem)} size="small">
                        Go
                    </Button>
             
                </CardActions>
            </Card>
       </Box>
    )
}
}
 
export default ShoppingList