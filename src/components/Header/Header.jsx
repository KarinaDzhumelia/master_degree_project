import React, { useEffect, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import useStyles from './styles.js';
import { getAlertStatus } from '../../api/myAPI';

const Header = React.memo(({ onPlaceChanged, onLoad, coords }) => {
  const classes = useStyles();

  const [alertStatus, setAlertStatus] = useState(false); // Статус тривоги

  // Перевірка тривоги
  useEffect(() => {
    const fetchAlertStatus = async () => {
      if (coords?.lat && coords?.lng) {
        const status = await getAlertStatus(coords.lat, coords.lng);
        setAlertStatus(status);
      }
    };
    fetchAlertStatus();
  }, [coords]);

  return (
    <AppBar 
    position="static" 
    className={`${classes.appBar} ${alertStatus ? 'alert' : ''}`}
    >
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" className={classes.title}>
          Твоя безпека
        </Typography>
        <Typography variant="h6">
            {alertStatus ? 'Увага! Повітряна тривога! Будьте обережні!' : ''}
          </Typography>
        <Box display="flex">
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase placeholder="Пошук..." classes={{ root: classes.inputRoot, input: classes.inputInput }} />
            </div>
          </Autocomplete>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
