<template>
    <div class="card-container">
        <ion-card class="card">
            <ion-card-header>
              <ion-card-title>{{header}}</ion-card-title>
              <ion-card-subtitle>{{subtitle}}</ion-card-subtitle>
              <ion-card-subtitle v-if="text">{{text}}</ion-card-subtitle>
            </ion-card-header>
        </ion-card>
    </div>
   
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../../realm-state';

 

  
  

  
  
  export default defineComponent({
    name: 'DescriptionCard',
    components: {
       //IonContent,
       //IonPage,
       IonCard, 
       IonCardHeader, 
       IonCardSubtitle, 
       IonCardTitle,

       
    },
    props:{header:String, subtitle: String , text: String},
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>();
      const project = ref<any>();

      const machines = ref<any>()
      const currentWorker = ref<any>()
    


      onMounted(async()=>{
       //add code or delete
    
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
   .card-container{
    box-sizing: content-box;
    background-image: url("../../../public/assets/Images/projectCardImage.jpg");
   background-attachment: fixed;
    padding: 2%;
   }
   .card{
    opacity: 0.8;
    text-align: center;
   }
  </style>