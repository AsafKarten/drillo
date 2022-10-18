<template>
    <ion-page>
      <ion-content  :fullscreen="true" >
          <AppHeader :str="'מסמכי אתר'"/>
          <ion-item>
            <ion-thumbnail slot="start">
              <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </ion-thumbnail>
            <ion-label>
              שם המסמך ותוקף
            </ion-label>
          </ion-item>
          <FileUpload/>
      

        
      </ion-content>
    </ion-page>
  
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage, IonButton, IonLabel,IonItem, IonThumbnail } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import AppHeader from '@/Components/AppHeader.vue';
  import FileUpload from './Utilities/FileUpload.vue'

  
  
  
  
  
  
  export default defineComponent({
  name: 'ProjectFiles',
  components: {
    IonPage,
    IonContent,
    IonLabel,
    IonItem,
    IonThumbnail,
    AppHeader,
    FileUpload,
  
},
  props:{},
  setup(){
  const router = useRouter();
  const route = useRoute();
  const {user , getProjectByID} = useAppState();
  const currentUser = ref<any>(user)
  const project_id = ref<any>(route.params);
  const project = ref<any>();
  
  
  
  onMounted(async()=>{
    if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
      
     project.value = await getProjectByID(project_id.value)

  
  });
  
  
  
    
  return {
   //methods
  
   //properties
   currentUser,
   project,
   project_id,
   
  
    
  }
  }
  });
  </script>
  
  <style scoped>
  
  </style>