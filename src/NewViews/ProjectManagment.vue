<template>
    <ion-page>
      <ion-content :fullscreen="true" >
        <ion-grid :fixed="true">

            <ion-row >
              <ion-col>
                <ion-button class="ion-align-items-stretch ion-align-self-stretch" >רשימת עובדים
                    <IonIcon slot="start" :icon="home"/>
                </ion-button>
              </ion-col>
              <ion-col>
                <ion-button class="ion-align-items-stretch ion-align-self-stretch" >הוספת עובד
                    <IonIcon slot="start" :icon="home"/>
                </ion-button>
              </ion-col>
              <ion-col>
                <ion-button class="ion-align-items-stretch ion-align-self-stretch" >הוספת עבודה חיצונית
                    <IonIcon slot="start" :icon="home"/>
                </ion-button>
              </ion-col>
            </ion-row>
            

          </ion-grid>
    
      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import {  IonContent, IonPage, IonCol, IonGrid, IonRow, IonButton, IonIcon } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../realm-state';
  
  
  import '@vuepic/vue-datepicker/dist/main.css'
  import { arrowRedo, home, exit } from 'ionicons/icons';
  
  
  export default defineComponent({
    name: 'ProjectManagment.vue',
    components: {
       IonContent,
       IonPage,
       IonCol, 
       IonGrid, 
       IonRow,
       IonButton, 
       IonIcon 
   
  },
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
      project.value = project.value[0]
      console.log(project.value);
   
    });
  
        
       return {
        //methods
        
        //properties
          currentUser : currentUser,
          project:project,
          project_id:project_id,

        //icons
          arrowRedo,
          home,
          exit,
       
         
    }
    },
   
  });
  </script>
  
  <style scoped>
  .mainButtons{
   width: auto;
   height: auto;
  }

  </style>