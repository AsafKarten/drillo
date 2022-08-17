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
  props: {},
  emits: [],
  setup() {

    onMounted(() => {
      mapboxgl.accessToken = "pk.eyJ1Ijoibm95aWwiLCJhIjoiY2t5eGFuNWNsMDlhcjJwcGdoeGNubTdmNiJ9.UloSWuKs68zMLBouKS7zhQ";

      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
        center: [34.8, 31.8],
        zoom: 9,
        attributionControl: false
      });
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