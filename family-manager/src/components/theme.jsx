import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        primary: {
          main: "#005C97",
          light: "#0082d5",
          dark: "#004d7e"
        },
        secondary: {
            main: "#b53583",
            light: "#c84294",
            dark: "#982c6e"
        },

        success: {
            main: "#5C9700",
            light: "#5C9700",
            dark: "#5C9700"
        }

      
    },

   

    overrides: {
        MuiAppBar: {
            colorPrimary: {
                background: 'linear-gradient(45deg, #005c97 10%, #363795 90%)',
                //background: 'linear-gradient(45deg, #5f2c82 10%, #49a09d 90%)',
                color: "#FFFFFF",
            }  
        },

        MuiDialogTitle: {
            root: {
                background: 'linear-gradient(45deg, #005c97 10%, #363795 90%)',
                color: "#FFFFFF",
            }
        }
    },

    
});