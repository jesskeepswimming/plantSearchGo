
import React, { useState, useEffect } from "react";
import ReactMapboxGl, {Layer, Feature, GeoJSONLayer} from "react-mapbox-gl";
import svg from './logo.svg'
// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');
const geojson = {
  type: "FeatureCollection",
  features: [
    {type: "Feature", geometry: {type: "Point", coordinates: [-80.544861, 43.472286]}},
    {type: "Feature", geometry: {type: "Point", coordinates: [-80.538930, 43.462650]}}
  ]
}


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

// export interface Props {
//   // tslint:disable-next-line:no-any
//   onStyleLoad?: (map: any) => any;
// }




// Create an image for the Layer
const image = new Image();
// image.src = 'data:image/svg+xml;charset=utf-8;base64,'+btoa(svg)
image.src = 'https://image.flaticon.com/icons/png/512/149/149059.png'
const images = ['pin', image]


const symbolLayout = {
  'text-field': '{place}',
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 0.6],
  'text-anchor': 'top'
};
const symbolPaint = {
  'text-color': 'white'
};

const circleLayout = { visibility: 'visible'}
const circlePaint = {
  'circle-color': 'white'
}
const getStations = () =>{
  return {
    "a": {
      "position": [-80.544861, 43.472286]
    },
    "b": {
      "position": [43.472286, -80.544861]
    },
  }
}


function ThreeDMap(props) {

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

        
        var k = getStations();
        setStations(k)

    }, []);

    const onStyleLoad = (map, loadEvent) => {
        console.log(map);
        // return props.onStyleLoad && props.onStyleLoad(map);
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
          <Layer type='circle' layout={{'visibility': 'visible'}} paint={{'circle-color':'black' , 'circle-radius':100}}>
              {Object.keys(stations).map((k, index)=> (
                  <Feature
                  id = {k}
                    key = {k}
                    coordinates = {stations[k].position}
                  />
              ))}
          </Layer>
        {/* <GeoJSONLayer
          id='geojson'
          data = {geojson}
          circleLayout={circleLayout}
          circlePaint={circlePaint}
          circleOnClick={()=> console.log('click')}
          symbolLayout={symbolLayout}
          symbolPaint={symbolPaint}
        /> */}
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