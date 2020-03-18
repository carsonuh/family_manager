import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';

function DisplayItem(props) {
    return(
        
        <p>
        <FormControlLabel
          value={props.item}
          control={<Checkbox color="primary" />}
          label={props.item}
         />
        <Divider />
        </p>
        
      
        
    )
}
export default DisplayItem