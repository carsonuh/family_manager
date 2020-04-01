import React, {useState, useEffect} from "react"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';

function SettingsDialog(props) {

  let identify = ""

if(props.type === "master user") {
  identify = "   (You)"
}

  return (
    <div>
      <ListItem>
            <ListItemText primary={props.email + identify} secondary={props.type} />

            {props.type !== "master user" ?
            (<ListItemSecondaryAction>
                <Tooltip title="Delete account" aria-label="delete">
                <IconButton edge="end" aria-label="delete" style={{ color: red[500] }} 
                    onClick={() => props.onDeleteClick(props.email, props.type)}>
                      <ClearIcon />
                </IconButton>
                </Tooltip>
            </ListItemSecondaryAction>) : null
          }

      </ListItem>
          <Divider />
    </div>
          
  )


}

export default SettingsDialog