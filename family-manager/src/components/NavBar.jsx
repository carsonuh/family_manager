import React from 'react';

// external imports
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ShoppingList from "./ShoppingList"
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// local imports
import SharedCalendar from "./SharedCalendar"
import ChildrenTasks from "./ChildrenTasks"
import Settings from "./Settings"
import Guide from './Guide'

const drawerWidth = 300;
const mobileHeight = window.innerHeight * .9;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: 36,
  },
  bar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },

  login: {
    flexShrink: 1,
  },

  mobileCal: {
    minHeight: mobileHeight,
    height: mobileHeight,
    maxHeight: mobileHeight
  },

  innerDrawer: {
    marginTop: "75px",
  },
  toolbar: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  let [toggleAbout, setToggleAbout] = React.useState(false)
  let [loaded, setLoaded] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const hasLoaded = () => {
    setLoaded(true)
  }

  return (
    <div>
      <div className={classes.root}>

        {/*************************************************************  
            APP BAR 
        ***************************************************************/}

        <AppBar position="sticky" className={classes.bar} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit" aria-label="menu"
              onClick={() => { setOpen(!open) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Family Manager
          </Typography>
            {/* <Button color="inherit" variant="outlined" onClick={() => toggleAbout}>About</Button> */}
            <Button id="loginButton" color="inherit" variant="outlined" className={classes.login} onClick={() => props.loginAction()}>{props.login ? "logout" : "login"}</Button>
          </Toolbar>
        </AppBar>

        {/*************************************************************  
          DRAWER
        *************************************************************/}
        {
          loaded === true ?
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
                        <div style={{ height: "10px" }}></div>
                        <Divider />
                        <div style={{ height: "10px" }}></div>
                        <Settings userEmail={props.userEmail} />
                        <Guide />
                      </div>
                      :
                      <div>
                        <Guide />
                      </div>

                  }
                </List>

              </div>
            </Drawer>
            :
            <div>
              <Drawer
                className={classes.drawer}
                variant="persistent"
                open={open}
              >
                <div className={classes.innerDrawer} style={{ width: '180px' }}>
                  <List>
                    <Guide />
                  </List>
                </div>
              </Drawer>
            </div>
        }
        {/*************************************************************  
        CALENDAR
      *************************************************************/}
      </div>

      <div className={open ? classes.calShrink : classes.calNorm}>
        {
          props.userEmail !== undefined ?
            <SharedCalendar userEmail={props.userEmail} usersName={props.usersName} loadedCallback={hasLoaded} />
            :
            null}
      </div>

    </div>
  );
}
