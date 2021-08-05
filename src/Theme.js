import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0D5279',
    },
    secondary: {
      main: '#F1DAC4',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#171717',
    },
    type: 'dark',
  },
});

export default theme;
