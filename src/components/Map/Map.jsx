import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

import mapStyles from '../../mapStyles';
import useStyles from './styles.js';

const Map = ({ coords, setCoords, setBounds, places, setChildClicked, initialCoords  }) => {
  const classes = useStyles(); 

  const [hoveredPlace, setHoveredPlace] = useState(null);

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles }}
        onChange={(e) => {
          setCoords({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={(child) => {
          setChildClicked(Number(child));
        }}
      >
        {/* Шпильки */}
        {places.map((place, i) => (
          <div
            key={i}
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            className={classes.marker}
            onMouseEnter={() => setHoveredPlace(place)}
            onMouseLeave={() => setHoveredPlace(null)}
            title={place.name}
            data-index={i}
          >
            📍
          </div>
        ))}

        {/* Місцезнаходження користувача */}
        {initialCoords && (
          <div
            lat={initialCoords.lat}
            lng={initialCoords.lng}
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 255, 0.7)',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
            }}
          >
          </div>
        )}

        {/* Інформаційне вікно */}
        {hoveredPlace && hoveredPlace.latitude && hoveredPlace.longitude && (
          <div
            lat={hoveredPlace.latitude}
            lng={hoveredPlace.longitude}
            className={classes.infoWindow}
          >
            <div><strong>{hoveredPlace.name || 'Unnamed Place'}</strong></div>
            <div>{hoveredPlace.latitude.toFixed(6)}</div>
            <div>{hoveredPlace.longitude.toFixed(6)}</div>
          </div>
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
