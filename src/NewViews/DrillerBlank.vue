<template>
    <ion-page >
        <AppHeader :str="'ללא פרוייקט'"/>
   
      <ion-content  :fullscreen="true" >
      
      
    
      <div class="homeContainer">
      <h1>אינך משויך לפרוייקט.</h1>
      <h1 >בדוק עם מנהל העבודה שלך</h1>
      <div class="marginTop">
            <IonButton shape="round" expand="full" @click="refreshUserData()">נסה שוב</IonButton>
        </div>
     </div>
     </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  
  import {onIonViewDidEnter, IonContent, IonPage, IonToolbar, IonCol, IonGrid, IonRow,IonFooter,IonButton, IonIcon } from '@ionic/vue';
  import {add, listOutline, peopleOutline} from 'ionicons/icons';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter } from 'vue-router';
  import {useAppState} from '../realm-state';
  import AppHeader from '../Components/AppHeader.vue'
  

 
  
  
  
  export default defineComponent({
    name: 'DrillerBlank',
    components: {
      IonContent,
      IonPage,
      IonButton,
      AppHeader,
  },
    setup(){
      const router = useRouter();
     
      const {user ,refreshUser, getOrganizationData , getAllProjectByOrganizationID} = useAppState(); 
      const currentUser = ref<any>(user)
   
      
      onIonViewDidEnter(async()=>{
        await refreshUser()
        if(currentUser?.value.customData.project_id !== "" && currentUser?.value.customData.project_id !== undefined )
            router.replace("/field-project-managment");
      

      });

      const refreshUserData = async()=>{
        await refreshUser()
        if(currentUser?.value.customData.project_id !== "" && currentUser?.value.customData.project_id !== undefined )
            router.replace("/field-project-managment");
        
        
      }
  
       return {
        //methoods
        refreshUserData,
         //properties
          currentUser:user,
          //icons
          add,
          listOutline,
          peopleOutline,

          
    }
    },
   
  });
  </script>
  
  <style scoped>
 
  .homeContainer{
    display: block;
    padding-top: 2%;
    padding-bottom: 2%;
    border: #4DBA87 2px solid;
    border-radius: 16px;
    margin: 5%;
    text-align: center;
    height: 50%;
  }

  .marginTop{
    margin-top: 10%;
  }
  
  ion-button {
    --background: #4DBA87;
    --background-hover: #9ce0be;
    --background-activated: #88f4be;
    --background-focused: #88f4be;
    
  
    --color: #fff;
  
    --border-radius: 10px;
    --border-color: #4DBA87;
    --border-style: solid;
    --border-width: 2px;
  
    --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);
  
    --ripple-color: deeppink;
  
    --padding-top: 10px;
    --padding-bottom: 10px;

  
  }


  </style>
  