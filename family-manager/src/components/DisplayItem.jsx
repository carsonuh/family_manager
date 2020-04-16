import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';

function DisplayItem(props) {

    const completedStyle = {
        fontStyle: "italic",
        color: "#cdcdcd",
        textDecoration: "line-through",
        display: "block"
    }

    const inline = {
    display: "block",
  }
    return(   
  
      <div style={props.completed ? completedStyle: inline}>
        <FormControlLabel
          value={props.item}
          aria-label="shoppingListItem"
          control={
          <Checkbox 
            color="primary" 
            aria-label="shoppingListItemCB"
            checked={props.completed}
            onChange={() => props.handleChange(props.item)}
          />}
          label={props.item}
         />
        <Divider />
        <br />
        </div>
        
    )
}
export default DisplayItem