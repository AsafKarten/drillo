<template>
  <div id="map"></div>
</template>

<script>

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { defineComponent, onMounted, watch, reactive, ref } from "vue";

export default defineComponent({
  name:"MapBox",
  components: { },
  props: {pitsToShow:Array},
  emits: [ 'pitClick'],
  setup(props, ctx) {
      
    onMounted(() => {
      
      mapboxgl.accessToken = "pk.eyJ1Ijoibm95aWwiLCJhIjoiY2t5eGFuNWNsMDlhcjJwcGdoeGNubTdmNiJ9.UloSWuKs68zMLBouKS7zhQ";

      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
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
          "circle-stroke-color": "#000000",
          "circle-stroke-opacity": 0.03
        }
      }
//
      const mapLoad = () => {
        map.resize();
        map.addSource('pitsSource', mapboxPitsSourceDefinition);
        map.addLayer(mapboxPitsLayerDefinition);
      };



 

      //internal function for converting server pits array to mapbox syntax (FeatureCollection)
      const formatServerPitsToMapbox = pits => pits.map( pit => {
        return {
          type:"Feature",
          properties: {
            _id: pit.p,
            status: pit.status
          },
          geometry: {
            type: "Point",
            coordinates: [pit.coordinates.long,pit.coordinates.lat]
          }
        }
      });
console.log(props.pitsToShow)
      //update pits on map when a data changes or added
      watch( [()=>props.pitsToShow, ()=>props.pitsToShow.length], ([pits,length]) => {
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
      });

      //internal function to update map data with the new pits collection
      const updateMapPits = pits => {
        map.getSource('pitsSource').setData( { type: 'FeatureCollection', features: pits } );
        //map.flyTo({ center: zeps[zeps.length-1].geometry.coordinates });
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
    
  }
  }
});

</script>

<style scoped>
#map {
    position: relative;
    width: 100%;
    height: 100%;

}

.mapboxgl-ctrl-logo {
    display: none !important;
}
</style>