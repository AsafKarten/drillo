<template>
    <ion-page>
      <ion-content :fullscreen="true" >

        <GridButtons :buttons="buttons"/>

      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage } from '@ionic/vue';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import GridButtons from './Utilities/GridButtons.vue';
  
  
  import '@vuepic/vue-datepicker/dist/main.css'
  import { home } from 'ionicons/icons';
  
  
  export default defineComponent({
    name: 'ProjectManagment.vue',
    components: {
       IonContent,
       IonPage,
       GridButtons
    },
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>(route.params);
      const project = ref<any>();


      const goTo = (route:any) => { router.push(route) }
      const buttons = reactive(
        [
          {text:"רשימת עובדים",         icon: home, click: ()=>goTo('/WorkersView/') },
          {text:"הוספת עובד",           icon: home, click: ()=>goTo('/AddWorker/') },
          {text:"הוספת עבודה חיצונית", icon: home, click: ()=>goTo('/AddJob/') }
        ]
      );
      
      onMounted(async()=>{
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
    
        project.value = await getProjectByID(project_id.value)
        project.value = project.value[0]
        console.log(project.value);
    
      });
    
          
      return {
      //methods
      
      //properties
        currentUser : currentUser,
        project:project,
        project_id:project_id,

        buttons, 
      }
    }
  });
  </script>
  
  <style scoped>

  .button-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 0.5fr));
    grid-auto-rows: 150px;
    align-items: stretch;
    justify-content: stretch;

  }

  .button-grid-container>.button {
    height: auto;
  }

  .button>div{
    display: flex;
    flex-direction: column;
    align-items: center;

    --ion-margin: 6px;
    font-weight: bold;
  }

  </style>