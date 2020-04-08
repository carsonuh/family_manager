import React from 'react';
import Home from './components/Home.jsx';
import { makeStyles, useTheme, ThemeProvider } from '@material-ui/core/styles';
import myTheme from "./components/theme"

function App() {
  return (
    <ThemeProvider theme={myTheme}>
    <div>
      <Home />
    </div>

    </ThemeProvider>
  )
}
export default App;
