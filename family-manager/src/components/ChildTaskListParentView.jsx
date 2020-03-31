import React from "react" 
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';

function ChildTaskListParentView(props) {
    let second = props.child + ", " + props.date
    return (
        <ListItem>
            <ListItemText primary={props.chore} secondary={second}/>  

            <ListItemSecondaryAction>
            <Tooltip title="Remove" aria-label="remove"> 
                <IconButton edge="end" aria-label="delete" style={{ color: red[500] }} 
                    onClick={() => props.onDeleteClick(props.chore, props.child, props.date)}>
                      <ClearIcon />
                </IconButton>
            </Tooltip>

            </ListItemSecondaryAction>
            
        </ListItem>
        
    )
}

export default ChildTaskListParentView