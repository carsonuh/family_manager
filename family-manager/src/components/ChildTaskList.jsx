import React from "react"
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import { green } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';

/**
 * Displays childs chores in a list form with 
 * button for marking complete 
 * @param {chore, child, date} props 
 */
function ChildTaskList(props) {
    return (
        <ListItem>
            <ListItemText primary={props.chore} secondary={props.date} />
            <ListItemSecondaryAction>
                <Tooltip title="Complete" aria-label="add">
                    <IconButton edge="end" aria-label="delete" style={{ color: green[500] }}
                        onClick={() => props.onDeleteClick(props.chore, props.child, props.date)}>
                        <DoneIcon />
                    </IconButton>
                </Tooltip>
            </ListItemSecondaryAction>
        </ListItem>
    )
}
export default ChildTaskList