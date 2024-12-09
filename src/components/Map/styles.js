import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  mapContainer: {
    height: '90vh',
    width: '100%',
    position: 'relative',
  },
  marker: {
    color: 'red',
    fontSize: '20px',
    cursor: 'pointer',
  },
  infoWindow: {
    position: 'absolute',
    background: 'white',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '12px',
    zIndex: 1000,
    transform: 'translate(-50%, -150%)',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
  },
}));
