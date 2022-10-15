<template>
    <ion-page>
      <AppHeader :str="'מפת אתר קידוח'"/>
      
      <ion-content :fullscreen="true" >
    
    
  
          <MapBox id="map" 
          :v-show="showMap"
          :pitsToShow="pitsToShow" 
          @pitClick="pitClick"
          />
  
       
  
        
        <!--Show pit modal-->
          <ion-modal :is-open="isOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>בור קידוח מספר {{currentPit.p}}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="modalManager">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="hebrewText">
            <h5>{{currentPit?.p}}</h5>
            <h6>נתוני קידוח</h6>
            <p>עומק: <span class="coords">{{currentPit?.diameter}}</span></p>
            <p>קוטר: <span class="coords">{{currentPit?.depth}}</span></p>
            <p>נפח בטון תיאורטי: <span class="coords">{{currentPit?.concreteVolume?.toFixed(3)}}</span></p>
            <h6>קואורדינטות</h6>
            <p>Lon: <span class="coords">{{currentPit?.coordinates.long.toFixed(10)}}</span></p>
            <p>Lat: <span class="coords">{{currentPit?.coordinates.lat.toFixed(10)}}</span></p>
            <h6>רשת ישראל החדשה</h6>
            <p>צפון: <span class="coords">{{currentPit?.itm.y}}</span></p>
            <p>מערב: <span class="coords">{{currentPit?.itm.x}}</span></p>
            <p>סטטוס: {{currentPit?.status}}</p>
            <div :key="note.depth" v-for="note in currentPit?.notes">
              <p>סוג מפגע:{{note?.note}} עומק: {{note?.depth}}</p>
            </div>
          </div>
        </ion-content>
      </ion-modal>
      </ion-content>
    </ion-page>
  
   
  </template>
  
  <script lang="ts">
  import {  IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle} from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../realm-state';
  import MapBox from'../views/MapBox.vue';
  
  import AppHeader from '../Components/AppHeader.vue'
  
  
  
  export default defineComponent({
    name: 'ProjectMap',
    components: {
      IonContent,
      IonHeader,
      IonPage,
      IonToolbar,
      IonButton,
      IonButtons,
      IonModal,
      IonTitle,
  
      MapBox,
   
      AppHeader,
  
  },
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID} = useAppState();
      const project_id = ref<any>(route.params.id);
      const currentUser = ref<any>(user)
      const project = ref<any>();
      const {id} = route.params

      const pitsToShow = ref<any>([]);
      const showMap = ref(false);
      const isOpen = ref(false);

      const currentPit = ref<any>();
  
    onMounted(async()=>{
      if(currentUser?.value.customData.organizationID === undefined)
            router.push('Login')

      project.value = await getProjectByID(project_id.value.toString())
      console.log(project.value);
      pitsToShow.value = project.value.pits 
      showMap.value = true;
 
    });


  
         const pitClick = (clickData: { _id: any; }) => {
          const pitClicked = pitsToShow.value.find((pit: { p: { toString: () => any; }; }) => pit.p.toString() === clickData._id);
          currentPit.value = pitClicked
          modalManager();
          if (pitClicked == undefined) return;
          
      }
            //modal block
        const modalManager = ()=>{
          if(isOpen.value)
            isOpen.value=false;
          else
            isOpen.value = true;
        }

  


      
  

  
  
  

        
       return {
        //methods
          pitClick,
          modalManager,
          //properties
          currentUser,
          project,
          project_id,
          id,
          pitsToShow,
          showMap,
          isOpen,
          currentPit,
      
    }
    },
   
  });
  </script>
  
  <style scoped>
  .hebrewText{
    direction: rtl;
    line-height: 80%;
    overflow: scroll;
    margin-bottom: 10%;
  }
  .mainContainer{
    display: block;
    direction: rtl;
  }
  
  .map{}
  


  
  h5,h6{
    font-weight: bold;
  }
  
  .coords {
    font-family: monospace;
    font-size: 150%;
    letter-spacing: 1px;
  }
  </style>