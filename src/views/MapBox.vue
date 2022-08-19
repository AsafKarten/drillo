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
  props: {pitsToShow:Array, centerPoint:Object},
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
        //try code block Keep in bounds!!!

        const mapboxPitsSourceDefinition = {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      };

      const mapboxPitsLayerDefinition = {
        'id': 'pitsMarkers',
        'type': 'circle',
        'source': 'pitsSource',
        'paint': {
          'circle-radius': 5,
          'circle-color':'#ff0000'
        }
      }
//
      const mapLoad = () => {
        map.resize();
        map.addSource('pitsSource', mapboxPitsSourceDefinition);
        map.addLayer(mapboxPitsLayerDefinition);
      };





      //internal function for converting server zeps array to mapbox syntax (FeatureCollection)
      const formatServerPitsToMapbox = pits => pits.map( pit => {
        console.log(pit);
        return {
          type:"Feature",
          properties: {
            _id: pit.p
          },
          geometry: {
            type: "Point",
            coordinates: [pit.coordinates.lon,pit.coordinates.lat]
          }
        }
      });

         //update zeps on map when a zep changes or added
      watch( [()=>props.pitsToShow, ()=>props.pitsToShow.length], ([pits,length]) => {
        updateMapPits( formatServerPitsToMapbox(pits) );
      });

      //internal function to update map data with the new zeps collection
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
        //end of try code block!!!

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