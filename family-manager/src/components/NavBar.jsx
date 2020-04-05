import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';

import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ShoppingList from "./ShoppingList"
import SharedCalendar from "./SharedCalendar"
import ChildrenTasks from "./ChildrenTasks"
import Settings from "./Settings"




const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  //root: {
  //  flexGrow: 1,
  //  marginBottom: theme.spacing(2),
 // },

 root: {
  display: 'flex',
},
  //menuButton: {
   // marginRight: theme.spacing(2),
  //},
  menuButton: {
    marginRight: 36,
  },
  bar: {
    //background: 'linear-gradient(45deg, #2196F3 10%, #21CBF3 90%)',
    background: theme.primary,
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
 
  drawer: {
    
    flexGrow: 0,
    //whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },

    [theme.breakpoints.only('xs')]: {
      width: "600px",
    },
  },

  innerDrawer: {
    marginTop: "75px",
  },

  calShrink: {
    width: "calc(100% - `$(drawerWidth)`px)",
  },

  calNorm: {
    width: "100%"
  },
  
  toolbar: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export default function NavBar(props) {

  const [email] = React.useState(props.userEmail)
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
    <div className={classes.root}>

       {/*************************************************************  
            APP BAR 
        ***************************************************************/}

      <AppBar position="sticky"  className={classes.bar}>
        <Toolbar>
              <IconButton 
              edge="start" 
              className={classes.menuButton} 
              color="inherit" aria-label="menu" 
              onClick={() => {setOpen(!open)}}
              >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Family Manager
          </Typography>
          <Button color="inherit" onClick={() => props.loginAction()}>{props.login ? "logout" : "login"}</Button>
        </Toolbar>
      </AppBar>

      {/*************************************************************  
          DRAWER
        *************************************************************/}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        open={open}
     
      >

        <div className={classes.innerDrawer}>
        <List>

        {
          props.userEmail !== undefined ?
          
          <div>
             <ShoppingList userEmail={props.userEmail} /> 
             <ChildrenTasks userEmail={props.userEmail} /> 
             <div style={{height: "10px"}}></div>
             <Divider />
             <div style={{height: "10px"}}></div>
             <Settings userEmail={props.userEmail} /> 
          </div>
         
          :
          null
        }
        </List>
      
        </div>
      </Drawer>


    {/*************************************************************  
        CALENDAR
      *************************************************************/}
    </div>

    <div className={open ? classes.calShrink : classes.calNorm}>
      {
        props.userEmail !== undefined ?
      <SharedCalendar userEmail={props.userEmail} userName={props.userName}/>
      :
      null}
    </div>

      </div>
  );
}
