<template>
 
          <ion-item :key="tool._id" v-for="tool in tools">
            <ion-thumbnail slot="start">
              <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </ion-thumbnail>
            <ion-label>
            {{tool.item}}
            </ion-label>
          </ion-item>
  
  
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage, IonButton, IonLabel,IonItem, IonThumbnail } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../../realm-state';
  
  
  
  
  
  
  export default defineComponent({
  name: 'ToolsList',
  components: {
      IonLabel, 
      IonItem,
      IonThumbnail,

  },
  props:{projectTools:Array},
  setup(projectTools){
  const router = useRouter();
  const route = useRoute();
  const {user , getProjectByID} = useAppState();
  const currentUser = ref<any>(user)
  const tools = ref<any>(projectTools.projectTools);
  
  
  
  onMounted(async()=>{
  
    console.log(tools.value);
    
  
  });
  
  
  
    
  return {
   //methods
  
   //properties
   currentUser,
   tools,
   
  
    
  }
  }
  });
  </script>
  
  <style scoped>
  
  </style>