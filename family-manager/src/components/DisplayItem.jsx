import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';

function DisplayItem(props) {

    const completedStyle = {
        fontStyle: "italic",
        color: "#cdcdcd",
        textDecoration: "line-through"
    }
    return(   
      /*
      props.completed==false ? (
        <div>
          <p>
        <FormControlLabel
          value={props.item}
          control={
          <Checkbox 
            color="primary" 
            checked={props.completed}
            onChange={() => props.handleChange(props.item)}
          />}
          label={props.item}
         />
        <Divider />
        </p>
        </div>
      ):

      (
        <div>
          <p>COMPLETED</p>
          <p style={completedStyle}>
        <FormControlLabel
          value={props.item}
          control={
          <Checkbox 
            color="primary" 
            checked={props.completed}
            onChange={() => props.handleChange(props.item)}
          />}
          label={props.item}
         />
        <Divider />
        </p>
        </div>
      )
      
      
*/

      
      <p style={props.completed ? completedStyle: null}>
        <FormControlLabel
          value={props.item}
          control={
          <Checkbox 
            color="primary" 
            checked={props.completed}
            onChange={() => props.handleChange(props.item)}
          />}
          label={props.item}
         />
        <Divider />
        </p>
        
    )
}
export default DisplayItem