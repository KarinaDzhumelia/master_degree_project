import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, CardMedia, CardContent, CardActions } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import DirectionsIcon from '@material-ui/icons/Directions';

import { getAddressFromCoordinates } from '../../api/myAPI.js';
import useStyles from './styles.js';

const PlaceDetails = React.memo(({ place, selected, refProp, initialCoords }) => {
  const classes = useStyles();

  const [address, setAddress] = useState('');

  // Викликаємо функцію для отримання адреси після завантаження компонента
  useEffect(() => {
    if (place.latitude && place.longitude) {
      getAddressFromCoordinates(place.latitude, place.longitude).then(setAddress);
    }
  }, [place.latitude, place.longitude]);

  const formatAddress = (address) => {
    const parts = address.split(',');
    return parts.length > 1 ? `${parts[0]}, ${parts[1]}` : address;
  };


  React.useEffect(() => {
    if (selected) {
      refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selected, refProp]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${initialCoords.lat},${initialCoords.lng}&destination=${place.latitude},${place.longitude}`;

  return (
    <Card ref={refProp} elevation={6}>
      <CardMedia
        style={{ height: 150 }}
        image={place.photo}
        title={place.name || 'Unknown'}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">{place.name || 'Unknown Name'}</Typography>
        
        <Typography gutterBottom variant="body2" color="textSecondary" className={classes.spacing}>
          <LocationOnIcon /> {formatAddress(address)}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" className={classes.spacing}>
          <PhoneIcon /> {place.phone}
        </Typography>

      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        {place.website && place.website !== 'No website available' && (
          <Button
            size="small"
            color="primary"
            onClick={() => window.open(place.website, '_blank')}
          >
            Visit Website
          </Button>
        )}

        <Button
          size="small"
          color="primary"
          onClick={() => window.open(googleMapsUrl, '_blank')}
          className={classes.routeButton}
        >
          <DirectionsIcon style={{ marginRight: 5 }} />
          Побудувати маршрут
        </Button>
      </CardActions>

      {place.latitude && place.longitude && (
          <Typography variant="body2" color="textSecondary">
            Coordinates: {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
          </Typography>
        )}
    </Card>
  );
});

export default PlaceDetails;