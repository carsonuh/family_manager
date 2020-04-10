import React from "react"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import shoppingList from "../Images/shoppinglist_preview.png";
import choreList from "../Images/chorelist_preview.png";
import calendar from "../Images/calender_preview.png";
import NotificationsIcon from '@material-ui/icons/Notifications';
import MapIcon from '@material-ui/icons/Map';
import DevicesIcon from '@material-ui/icons/Devices';

export default function HomeView(){

const classes = {
    textGrid: {
        background: "#F5F5F5",
        padding: "20px 30px",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
    },

    row: {
        marginBottom: "20px",
        border: "1px solid #E0E0E0",
    },

    topRow: {
        margin: "2% 0 8% 0",
    },

    rowBottom: {
            margin: "50px 0",
    },

    header: {
        textAlign: "center",
        background: "#005c97",
        padding: "2% 0",
        color: "#FFFFFF"
    },

    iconFeatures: {
        textAlign: "center",
        margin: "auto",
        //border: "1px solid black",
        padding: "2% 1.5%",
        background: "#F5F5F5",
        border: "1px solid #E0E0E0",
    }
}


    return (
        <div style={{background:"#FAFAFA"}}>

<Grid container  direction="row"
      justify="space-around"
      alignItems="center"
     
      >


        <Grid container direction="row"  xs={12} sm={10} md={8} lg={6} style={classes.row, classes.topRow}>

        <Grid item xs={8} sm={12} style={{textAlign: "center", margin:"auto"}}>
            <img src={calendar} width="100%"/>
            <Typography variant="h5" style={{marginTop: "2%"}}>
                Calendar
            </Typography>
            <Typography variant="body1">
                Easily add new events, appointments, and important dates to your calendar. By default, all events
                are shared with everyone in your family. However, you have the option to make an event private so that it is only
                visible to you. Child accounts cannot create new events, but only view them.
            </Typography>
        </Grid>    
        </Grid> 


        <Grid container direction="row"  xs={12} style={classes.row}>
        <Grid item xs={12} style={classes.header}>
            <Typography variant="h4" >
                Features
            </Typography>
            </Grid>
        </Grid>




        <Grid container direction="row" justify="space-between" xs={12} sm={10} md={8} lg={7} style={classes.row, classes.rowBottom} >

        <Grid item xs={3} style={classes.iconFeatures}>
            <NotificationsIcon />
            <Typography>Notifications</Typography>
        </Grid>

        <Grid item xs={3} style={classes.iconFeatures}>
            <MapIcon />
            <Typography>Event map</Typography>
        </Grid>

        <Grid item xs={3} style={classes.iconFeatures}>
            <DevicesIcon />
            <Typography>Mobile friendly</Typography>
        </Grid>


        </Grid> 


       {/**************************************************************************
        * Shopping list
        ***************************************************************************/}
        <Grid container direction="row"  xs={12} sm={10} md={8} lg={7} style={classes.row} >

            <Grid item xs={8} sm={4} style={{textAlign: "center", margin:"auto", background: "#FFF"}}>
                <img src={shoppingList} width="100%"/>
            </Grid>

            <Grid item xs={12} sm={8} style={classes.textGrid}>
                <Typography variant="h5">
                    Shopping List
                </Typography>
                <Typography variant="body1">
                Everyone from your household or family can easily add new items to the shopping list. When
                shopping at the store you can check off items from your list as you grab them.
                </Typography>
            </Grid>
        </Grid> 
        
       {/**************************************************************************
        * Chore list
        ***************************************************************************/}
        <Grid container direction="row-reverse"  xs={12} sm={10} md={8} lg={7} style={classes.row}>

            <Grid item xs={8} sm={4} style={{textAlign: "center", margin:"auto", background: "#FFF"}}>
                <img src={choreList} width="100%"/>
            </Grid>

            <Grid item xs={12} sm={8} style={classes.textGrid}>
                <Typography variant="h5">
                    Chore List
                </Typography>
                <Typography variant="body1">
                Parents can assign chores or tasks for their child with the completion date. 
                When the child completes their chore they can simply check it off of their list.
                    
                </Typography>
            </Grid>

        </Grid>




       


      </Grid>

        </div>
     
    )
}