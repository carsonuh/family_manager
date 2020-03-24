import React, { Component } from "react"
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
        this.getFireDocId = this.getFireDocId.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleCBChange = this.handleCBChange.bind(this);
    }

    componentDidMount() {
        //Upon loading the component, check to see if a user exists
        //Return data into the callback and execute a data update
        //this.checkIfUserExists(this.fetchListData)
        //this.fetchListData();
        this.getFireDocId(this.fetchListData);
    }



    /**
     * When a new event is added send it to the DB 
     * @param {new event data} itemData 
     */
    updateStorage(itemData) {
        const db = firebase.firestore();
        const itemList = db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            shoppingList: firebase.firestore.FieldValue.arrayUnion(itemData)
        });
    }

    deleteStorage(itemData) {
        const db = firebase.firestore();
        const itemList = db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            shoppingList: itemData
        });
    }

    handleChange(e) {
        this.setState({ newItem: e.target.value })
    }

    handleClick(name) {
        let i = { completed: false, item: name }

        this.setState({ newItem: "" })

        this.state.items.length > 0 ?
            this.setState({ items: [...this.state.items, i,], })
            :
            this.setState({ items: [i] });

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


    deleteItems(id) {
        let allItems = this.state.items;
        let notCompleted = allItems.filter((item) => item.completed === false);
        this.setState({ items: notCompleted });
        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            shoppingList: { ...notCompleted }
        });
    }


    render() {
        let itemCB;


        if (this.state.items.length > 0) {
            itemCB = this.state.items.map((item) => {
                console.log("ItemCB: ", this.state.items);
                return <DisplayItem key={item.item} item={item.item} completed={item.completed} handleChange={this.handleCBChange} />
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
                                    <AddIcon style={{ fill: "#4caf50" }} />
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