<template>
  <div id="map" class="mapboxContainer"></div>
</template>

<script>

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { defineComponent, onMounted, watch, reactive, ref } from "vue";

export default defineComponent({
  name:"MapBox",
  components: { },
  props: {pitsToShow:Array },
  emits: [ 'pitClick'],
  setup(props, ctx) {
      const mapStyle = ref("mapbox://styles/mapbox/dark-v10");
    onMounted(() => {
      console.log(mapStyle.value); 
      mapboxgl.accessToken = "pk.eyJ1Ijoibm95aWwiLCJhIjoiY2t5eGFuNWNsMDlhcjJwcGdoeGNubTdmNiJ9.UloSWuKs68zMLBouKS7zhQ";

      const map = new mapboxgl.Map({
        container: "map",
        style:  mapStyle.value,
        center: [34.749611 , 31.982113],
        zoom: 18,
        attributionControl: false
      });
     
        const mapboxPitsSourceDefinition = {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      };

      const mapboxPitsLayerDefinition = {
        'id': 'pitsMarkers',
        'type': 'circle',
        'source': 'pitsSource',
        'paint': {
          /*'circle-radius': 10,
          /'circle-color':'#ff0000'*/

          // Make circles larger as the user zooms from z12 to z22.
          'circle-radius': {
            'base': 10,
            'stops': [
              [12, 1.5],
              [14, 2],
              [18, 6],
              [22, 50]
            ]
          },
          // Color circles by status, using a `match` expression.
          'circle-color': [
            'match',
            ['get', 'status'],
            'Pending',
            '#ffff00',
            'Done',
            '#00ff00',
            /* other */ '#ff0000'
          ],
          //Add outline for each circle so its easier to click on it
          "circle-stroke-width": 8,
          "circle-stroke-color": "#fff",
          "circle-stroke-opacity": [
            'match',
            ['get', 'selected'],
            'Selected',
            0.5,
            /* other */ 0.03
          ]//0.03
        },
        
      }
//
 

      //internal function for converting server pits array to mapbox syntax (FeatureCollection)
      const formatServerPitsToMapbox = pits => pits.map( pit => {
        return {
          type:"Feature",
          properties: {
            _id: pit.p,
            description: pit.p, 
            status: pit.status,
            selected: pit.selected?"Selected":"Not"
          },
          geometry: {
            type: "Point",
            coordinates: [pit.coordinates.long,pit.coordinates.lat]
          }
        }
      });

      //internal function to update map data with the new pits collection
      const updateMapPits = pits => {
        map.getSource('pitsSource').setData( { type: 'FeatureCollection', features: pits } );
        //map.flyTo({ center: zeps[zeps.length-1].geometry.coordinates });
      };

      const updateMapPitsAndZoom = function([pits,length,selected]) {
        //remove map markers if pit list is empty
        if(pits.length == 0)
        {
          map.getSource('pitsSource').setData( { type: 'FeatureCollection', features: [] } );
          return;
        }

        updateMapPits( formatServerPitsToMapbox(pits) );

        //find the bounds of all pits (minimum and maximum of lat and long = southwestern and northeastern corner)
        let longMin = 1000, longMax = -1000, latMin = 1000, latMax = -1000;
        for(let i=0; i<props.pitsToShow.length; i++)
        {
          let pitCoords = props.pitsToShow[i].coordinates;
          if(pitCoords.long < longMin) longMin = pitCoords.long;
          if(pitCoords.long > longMax) longMax = pitCoords.long;
          if(pitCoords.lat  < latMin ) latMin  = pitCoords.lat;
          if(pitCoords.lat  > latMax ) latMax  = pitCoords.lat;
        }
        //fit map zoom level and center to show all the points
        map.fitBounds([[longMin,latMin],[longMax,latMax]], {padding: 50});
      }

      //update pits on map when a data changes or added
      const watchAndUpdatePitList = function() {
        watch( [()=>props.pitsToShow, ()=>props.pitsToShow.length, ()=>props.pitsToShow.map(pit => pit.selected+',').join()], updateMapPitsAndZoom);
      }


      const mapLoad = () => {
        map.resize();
        map.addSource('pitsSource', mapboxPitsSourceDefinition);
        map.addLayer(mapboxPitsLayerDefinition);

        map.addLayer({
            'id': 'pitsNames',
            'type': 'symbol',
            'source': 'pitsSource',
            'layout': {
              'text-field': ['get', 'description'],
              'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
              'text-radial-offset': 0.5,
              'text-justify': 'auto',
              'text-font': ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              'text-size': 10
            },
            'paint': {
              'text-color': "#888888"
            }
          }
        );
        
        //first update of pits on the map
        updateMapPitsAndZoom([props.pitsToShow,"",""]);
        //start watching for pit list changes and update the map
        watchAndUpdatePitList();
      };


//under constructions
      const pitClicked = e => {
        ctx.emit('pitClick',  {
          _id: e.features[0].properties._id
        });
      }
//to here
      map.on("load", mapLoad);
      map.on('click','pitsMarkers', pitClicked);
        

    });



  
  return{
    mapStyle:mapStyle
  }
  }
});

</script>

<style>
.mapboxContainer {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 200px;
}

.mapboxgl-ctrl-logo {
    display: none !important;
    stroke: solid 2px red !important;
}
</style>