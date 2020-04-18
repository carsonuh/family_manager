import React from "react"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import shoppingList from "../Images/shoppinglist_preview.png";
import choreList from "../Images/chorelist_preview.png";
import calendar from "../Images/calender_preview.png";
import NotificationsIcon from '@material-ui/icons/Notifications';
import MapIcon from '@material-ui/icons/Map';
import DevicesIcon from '@material-ui/icons/Devices';
import Zoom from '@material-ui/core/Zoom';


/**
 * Home page
 */
export default function HomeView() {

    const [checked, setChecked] = React.useState(false)
    React.useEffect(() => {
        setChecked(true);
    }, [])

    /**
     * CSS styles 
     */
    const classes = {
        textGrid: {
            background: "#333",
            color: "#FFF",
            padding: "20px 30px",
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
        },

        row: {
            margin: "calc(20px + (30 - 20) * ((100vw - 300px) / (1600 - 300))) 0",
            borderTop: "1px solid rgba(0,0,0,.08)",
            borderBottom: "1px solid rgba(0,0,0,.08)",
        },

        topRow: {
            marginTop: "calc(15px + (20 - 15) * ((100vw - 300px) / (1600 - 300)))",
            marginBottom: "calc(50px + (80 - 50) * ((100vw - 300px) / (1600 - 300)))",
        },

        rowBottom: {
            margin: "50px 0 30px 0",
        },

        header: {
            textAlign: "center",
            background: "#005c97",
            padding: "calc(20px + (30 - 20) * ((100vw - 300px) / (1200 - 300))) 0",
            color: "#FFFFFF",
            width: "100%",
            fontSize: "calc(26px + (40 - 26) * ((100vw - 300px) / (1600 - 300)))"
        },

        iconFeatures: {
            textAlign: "center",
            margin: "auto",
            padding: "2% 1.5%",
            background: "#FFF",
            boxShadow: "0 0 1px 1px rgba(0,0,0,.1)",
            color: "#333"
        },

        container: {
            maxWidth: "1200px",
            background: "#FAFAFA",
            margin: "auto",
            boxShadow: "0 0 1px 1px rgba(0,0,0,.08)"
        },

        featureTitle: {
            fontSize: "calc(26px + (40 - 26) * ((100vw - 300px) / (1600 - 300)))"
        },

        featureBody: {
            fontSize: "calc(16px + (22 - 16) * ((100vw - 300px) / (1600 - 300)))"
        },

        featureIconText: {
            fontSize: "calc(13px + (22 - 13) * ((100vw - 300px) / (1600 - 300)))"
        }
    }

    return (
        <div style={classes.container}>
            <Zoom
                in={checked}
                timeout={1000}
            >

                <Grid container direction="row"
                    justify="space-around"
                    alignItems="center"

                >
                    {/**************************************************************************
         * Calendar
         ***************************************************************************/}
                    <Grid container direction="row" alignItems="center" justify="space-around" style={classes.topRow}>

                        <Grid item xs={11} sm={10} style={{ textAlign: "center", margin: "auto" }}>

                            <Grid item style={{ color: "#333" }}>
                                <img src={calendar} width="100%" style={{ marginBottom: "20px" }} alt="calendar" />
                                <Typography variant="h5" style={classes.featureTitle}>
                                    Calendar
            </Typography>
                                <Typography variant="body1" style={classes.featureBody}>
                                    Easily add new events, appointments, and important dates to your calendar. By default, all events
                                    are shared with everyone in your family. However, you have the option to make an event private so that it is only
                                    visible to you. Child accounts cannot create new events, but only view them.
            </Typography>
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid container direction="row">
                        <Grid item xs={12} >
                            <Typography variant="h4" style={classes.header} >
                                Features
            </Typography>
                        </Grid>
                    </Grid>


                    {/**************************************************************************
         * Features
         ***************************************************************************/}
                    <Grid container direction="row" justify="space-between" style={classes.rowBottom} >
                        <Grid item xs={3} style={classes.iconFeatures}>
                            <Grid item>
                                <NotificationsIcon style={classes.featureTitle} />
                            </Grid>
                            <Grid item>
                                <Typography style={classes.featureIconText}>Notifications</Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={3} style={classes.iconFeatures}>
                            <Grid item >
                                <MapIcon style={classes.featureTitle} />
                            </Grid>

                            <Grid item>
                                <Typography style={classes.featureIconText}>Event map</Typography>
                            </Grid>

                        </Grid>

                        <Grid item xs={3} style={classes.iconFeatures}>
                            <Grid item>
                                <DevicesIcon style={classes.featureTitle} />
                            </Grid>

                            <Grid item>
                                <Typography style={classes.featureIconText}>Responsive</Typography>
                            </Grid>
                        </Grid>

                    </Grid>


                    {/**************************************************************************
        * Shopping list
        ***************************************************************************/}
                    <Grid container direction="row" style={classes.row} >

                        <Grid item xs={12} sm={4} style={{ textAlign: "center", margin: "auto", background: "#FFF" }}>
                            <img src={shoppingList} width="95%" alt="shopping list" />
                        </Grid>

                        <Grid item xs={12} sm={8} style={classes.textGrid}>
                            <Typography variant="h5" style={classes.featureTitle}>
                                Shopping List
                </Typography>
                            <Typography variant="body1" style={classes.featureBody}>
                                Everyone from your household or family can easily add new items to the shopping list. When
                                shopping at the store you can check off items from your list as you grab them.
                </Typography>
                        </Grid>
                    </Grid>

                    {/**************************************************************************
        * Chore list
        ***************************************************************************/}
                    <Grid container direction="row-reverse" style={classes.row} >
                        <Grid item xs={12} sm={4} style={{ textAlign: "center", margin: "auto", background: "#FFFFFF" }}>
                            <img src={choreList} width="95%" alt="chore list" />
                        </Grid>

                        <Grid item xs={12} sm={8} style={classes.textGrid}>
                            <Typography variant="h5" style={classes.featureTitle}>
                                Chore List
                </Typography>
                            <Typography variant="body1" style={classes.featureBody}>
                                Parents can assign chores or tasks for their child with the completion date.
                                When the child completes their chore they can simply check it off of their list.
                </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Zoom>
        </div>

    )
}