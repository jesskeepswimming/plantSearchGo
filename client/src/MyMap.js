
import React, { useState, useEffect } from "react";
import ReactMapboxGl, {Layer, Feature, GeoJSONLayer} from "react-mapbox-gl";

const { token } = require('./config.json');

const Map = ReactMapboxGl({ accessToken: token });

const mapStyle = {
  flex: 1,
  height: 500
};

const paintLayer = {
  'fill-extrusion-color': '#aaa',
  'fill-extrusion-height': {
    type: 'identity',
    property: 'height'
  },
  'fill-extrusion-base': {
    type: 'identity',
    property: 'min_height'
  },
  'fill-extrusion-opacity': 0.6
};

const getStations = () =>{
  return {
    "pin_id_a": {
      "position": [-80.544861, 43.472286]
    },
    "pin_id_b": {
      "position": [43.472286, -80.544861]
    },
  }
}


function ThreeDMap(props) {

  const {onPinClick} = props
  const [fitBounds, setFitBounds] = useState(undefined);
  const [center, setCenter] = useState([-80.544861, 43.472286]);
  const [zoom, setZoom] = useState([50]);
  const [bearing, setBearing] = useState([-60]);
  const [pitch, setPitch] = useState([80]);
  const [station, setStation] = useState(undefined);
  const [stations, setStations] = useState({});
  
  // Define layout to use in Layer component
  const layoutLayer = { 'icon-image': 'pin' };

    useEffect(()=> {

        
    }, [stations]);

    const onStyleLoad = (map, loadEvent) => {

        var k = getStations();
        setStations(k)

    };


    return (
      <Map
        style="mapbox://styles/mapbox/streets-v8"
        containerStyle={mapStyle}
        onStyleLoad={onStyleLoad}
        zoom={zoom}
        center={center}
        pitch={pitch}
        bearing={bearing}
        renderChildrenInPortal={true}
      >
          <Layer type='circle'  paint={{'circle-color': 'red', 'circle-radius': 10}}>
              {stations ? Object.keys(stations).map((k, index)=> {
                  return <Feature
                    key = {k}
    
                    onClick={() => onPinClick(k)}
                    coordinates = {stations[k].position}
                  />
            }): ''}
          </Layer>

      
        <Layer
          id="3d-buildings"
          sourceId="composite"
          sourceLayer="building"
          filter={['==', 'extrude', 'true']}
          type="fill-extrusion"
          minZoom={14}
          paint={paintLayer}
        >
          
        </Layer>
        
       
      
      
     </Map>
        
    );

}

export default ThreeDMap;