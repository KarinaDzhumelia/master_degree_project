import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import useStyles from './styles.js';

const List = ({ isLoading, places, type, setType, childClicked, initialCoords }) => {
  const [elRefs, setElRefs] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setElRefs((refs) => Array(places.length).fill().map((_, i) => refs[i] || createRef()));
  }, [places]);

  // Прокрутка
  useEffect(() => {
    if (childClicked !== null && elRefs[childClicked]) {
      elRefs[childClicked].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [childClicked, elRefs]);

  return (
    <div className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Пошук укриттів, медичних закладів, аптек
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="type">Тип</InputLabel>
        <Select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="hospital">Медичні заклади</MenuItem>
          <MenuItem value="shelter">Укриття</MenuItem>
          <MenuItem value="pharmacy">Аптеки</MenuItem>
        </Select>
      </FormControl>

      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress size="5rem" />
        </div>
      ) : places.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" style={{ marginTop: '20px' }}>
          Місць не знайдено
        </Typography>
      ) : (
        <Grid container spacing={3} className={classes.list}>
          {places.map((place, i) => (
            <Grid ref={elRefs[i]} key={i} item xs={12}>
              <PlaceDetails 
                place={place} 
                selected={Number(childClicked) === i} 
                initialCoords={initialCoords}
                refProp={elRefs[i]}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default List;
