import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  routeButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    padding: '5px 10px',
  },
  spacing: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
}));