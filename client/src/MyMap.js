
import React, { useState, useEffect } from "react";
import ReactMapboxGl, {Layer, Feature, GeoJSONLayer} from "react-mapbox-gl";
import {SERVER} from  "./config"

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

      "position": [43.472286, -80.544861]



function ThreeDMap(props) {

  const {onPinClick} = props
  const [fitBounds, setFitBounds] = useState(undefined);
  const [center, setCenter] = useState([-80.544861, 43.472286]);
  const [lastFetchCenter, setLastFetchCenter] = useState([-80.544861, 43.472286]);
  const [zoom, setZoom] = useState([50]);
  const [bearing, setBearing] = useState([-60]);
  const [pitch, setPitch] = useState([80]);
  const [stations, setStations] = useState([]);


  const radians = (degree) => {
    return degree* Math.PI / 180
  }


  const getStations2 = () =>{
    return [
     { "pin_id": 'a', 
        "latitude": 43.472286, 
        "longitude":-80.544861
      }
    ]
  }

  const kmDiff= (lon1, lat1, lon2, lat2)=> {
    var dlon = radians(lon2) - radians(lon1)
    var dlat = radians(lat2) - radians(lat1)
    var a = Math.pow((Math.sin(dlat/2)), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((Math.sin(dlon/2)),2)
    var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) )
    return 6373.0 * c //(where R is the radius of the Earth)
  } 

  const getStations = async e => {

    try {
      const vicinity = 1000
      const response = await fetch(`https://${SERVER}/pins/5/vicinity/${vicinity}`)
      const jsonData = await response.json()
      console.log(jsonData)
      setStations(jsonData)
    
    } catch (err) {
      console.log(err.message)
    }
  
  }

  
  
  // useEffect(()=> {
    
  // }, [stations]);

   
    const onStyleLoad = (map, loadEvent) => {
      getStations()
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
          setCenter([newCenter.lng, newCenter.lat])
          var diff = kmDiff(lastFetchCenter[0], lastFetchCenter[1], newCenter.lng, newCenter.lat)
          if (diff>1) {
            // refetch
            setLastFetchCenter([newCenter.lng, newCenter.lat])
          }
        }}
      >
          <Layer type='circle'  paint={{'circle-color': 'red', 'circle-radius': 10}}>
              {stations.map((item) => {
                  return <Feature
                    key = {item.pin_id}
                    onClick={() => onPinClick(item.pin_id)}
                    coordinates = {[item.longitude, item.latitude]}
                  />
            })}
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