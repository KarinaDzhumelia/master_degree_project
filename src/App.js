import React, { useState, useEffect, useCallback } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData } from './api/myAPI';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
  const [coords, setCoords] = useState({});
  const [initialCoords, setInitialCoords] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [places, setPlaces] = useState([]);
  const [type, setType] = useState('hospital');
  const [isLoading, setIsLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude });
      setInitialCoords({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        if (data) {
          setPlaces(data);
        }
        setIsLoading(false);
      });
    }
  }, [bounds, type]);

  const onLoad = useCallback((autoC) => {
    setAutocomplete(autoC);
  }, []);

  const onPlaceChanged = useCallback(() => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
  });

  return (
    <>
      <CssBaseline />
      <Header 
        onPlaceChanged={onPlaceChanged} 
        onLoad={onLoad} 
        coords={coords} 
      />
      <Grid container spacing={0} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            places={places}
            type={type}
            setType={setType}
            childClicked={childClicked} 
            initialCoords={initialCoords} 
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            coords={coords}
            initialCoords={initialCoords} 
            setCoords={setCoords}
            setBounds={setBounds}
            places={places}
            setChildClicked={setChildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
