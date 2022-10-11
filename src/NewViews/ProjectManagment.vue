<template>
    <ion-page>
      <ion-content :fullscreen="true" >

        <div class="button-grid-container">

          <ion-button v-for="(button,index) in buttons" :key="index" fill="outline" @click="button.click">
            <div>
              <ion-icon :icon="button.icon" size="large" class="ion-margin"></ion-icon>
              <ion-label>{{button.text}}</ion-label>
            </div>
          </ion-button>

        </div>

      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import {  IonContent, IonPage, IonButton, IonLabel, IonIcon } from '@ionic/vue';
  import { defineComponent, onMounted, reactive, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../realm-state';
  
  
  import '@vuepic/vue-datepicker/dist/main.css'
  import { arrowRedo, home, exit } from 'ionicons/icons';
  
  
  export default defineComponent({
    name: 'ProjectManagment.vue',
    components: {
       IonContent,
       IonPage,
       IonButton, 
       IonLabel,
       IonIcon 
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

      //icons
        arrowRedo,
        home,
        exit, 
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