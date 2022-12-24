<template>
    <div v-if="header||subtitle" class="card-container" :style="bgImage?'--bgImageUrl: url('+bgImage+');':''">
        <ion-card color="dark" class="card">
            <ion-card-header>
              <ion-card-title>{{header}}</ion-card-title>
              <ion-card-subtitle>{{subtitle}}</ion-card-subtitle>
              <ion-card-subtitle v-if="text">{{text}}</ion-card-subtitle>
            </ion-card-header>
        </ion-card>
    </div>

    <div v-else class="card-container">
        <ion-card color="dark" class="card">
            <ion-card-header class="center">
              <ion-card-title> <ion-skeleton-text :animated="true" style="width: 80px"></ion-skeleton-text> </ion-card-title>
              <ion-card-subtitle> <ion-skeleton-text :animated="true" style="width: 160px"></ion-skeleton-text> </ion-card-subtitle>
            </ion-card-header>
        </ion-card>
    </div>

  </template>
  
  <script lang="ts">
  import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSkeletonText } from '@ionic/vue';
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
      IonSkeletonText
       
    },
    props:{header:String, subtitle: String , text: String, bgImage: String},
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
    --bgImageUrl: url("../../../public/assets/Images/projectCardImage.jpg");
    box-sizing: content-box;
    background-image: var(--bgImageUrl);
    background-attachment: fixed;
    padding: 2%;
  }
  .card{
    opacity: 0.8;
    text-align: center;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>