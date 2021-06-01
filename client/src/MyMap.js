
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
  
  const radians = (degree) => {
    return degree* Math.PI / 180
  }
  const kmDiff= (lon1, lat1, lon2, lat2)=> {
    var dlon = radians(lon2) - radians(lon1)
    var dlat = radians(lat2) - radians(lat1)
    var a = Math.pow((Math.sin(dlat/2)), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((Math.sin(dlon/2)),2)
    var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) )
    return 6373.0 * c //(where R is the radius of the Earth)
  } 
  // Define layout to use in Layer component
  const layoutLayer = { 'icon-image': 'pin' };

    useEffect(()=> {

      
    }, [stations]);

    const onStyleLoad = (map, loadEvent) => {
        console.log(map)
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
        onMoveEnd= {(_, event) => {
          var newCenter =  event.target.transform._center;
          var diff = kmDiff(center[0], center[1], newCenter.lng, newCenter.lat)
          console.log(diff)
          if (diff>1) {
            // refetch
            setCenter(newCenter)
          }
        }}
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