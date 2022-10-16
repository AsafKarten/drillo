<template>
    <ion-page>
      <ion-content  :fullscreen="true" >
          <AppHeader :str="'רשימת ציוד'"/>
          <ToolsList v-if="tools" :projectTools="tools"/>
      </ion-content>
    </ion-page>
  
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage, IonButton } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import AppHeader from '@/Components/AppHeader.vue';
  import ToolsList from './Utilities/ToolsList.vue';
  
  
  
  
  
  
  export default defineComponent({
  name: 'ProjectFiles',
  components: {
    IonPage,
    IonContent,
    AppHeader,
    ToolsList
},
  props:{},
  setup(){
  const router = useRouter();
  const route = useRoute();
  const {user , getProjectByID} = useAppState();
  const currentUser = ref<any>(user)
  const project_id = ref<any>(route.params);
  const project = ref<any>();
  const tools = ref<any>()
  
  
  
  onMounted(async()=>{
    if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
      
     project.value = await getProjectByID(project_id.value)
     tools.value = project.value.tools
     console.log(project.value);
     

  
  });
  
  
  
    
  return {
   //methods
  
   //properties
   currentUser,
   project,
   project_id,
   tools,
   
  
    
  }
  }
  });
  </script>
  
  <style scoped>
  
  </style>