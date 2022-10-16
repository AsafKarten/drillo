<template>
    <ion-page>
      <ion-content>
        <AppHeader :str="'רשימת כלונסאות'"/>
     
  
            <ion-accordion-group :multiple="true" :value="['Waiting', 'Done']">
  
              <ion-accordion value="Waiting">
  
                <ion-item slot="header">
                  <ion-label>לא הושלמו</ion-label>
                  <ion-badge style="margin:2px"> {{ pits.filter(pit=>pit.status!='Done').length }} </ion-badge>
                </ion-item>
  
                <div slot="content">
                  <ion-item :key="pit._id" v-for="pit in pits.filter(pit=>pit.status!='Done')">
                    {{ pit.p }}
                    <ion-button :color="pit.status=='Done'?'success':'danger'" slot="end" @click="pitClick({_id:pit.p})">לפירוט</ion-button>
                  </ion-item>
                </div>
  
              </ion-accordion>
  
  
              <ion-accordion value="Done">
  
                <ion-item slot="header">
                  <ion-label>הסתיימו</ion-label>
                  <ion-badge style="margin:2px"> {{ pits.filter(pit=>pit.status=='Done').length }} </ion-badge>
                </ion-item>
  
                <div slot="content">
                  <ion-item :key="pit._id" v-for="pit in pits.filter(pit=>pit.status=='Done')">
                    {{ pit.p }}
                    <ion-button :color="pit.status=='Done'?'success':'danger'" slot="end" @click="pitClick({_id:pit.p})">לפירוט</ion-button>
                  </ion-item>
                </div>
                
              </ion-accordion>
  
            </ion-accordion-group>
         
  
        <ion-modal :is-open="isOpen" class="modalHalfScreen">
          <ion-header>
            <ion-toolbar>
              <ion-title>בור קידוח מספר {{currentPit?.p}}</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="modalManager('close')">Close</ion-button>
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
  import {
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonModal,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonBadge,
    IonAccordion, 
    IonAccordionGroup,
    IonIcon
    
  } from "@ionic/vue";
  import { flashOutline, trashOutline} from 'ionicons/icons';
  import { defineComponent, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useAppState } from "../realm-state";
 
  
  import AppHeader from '../Components/AppHeader.vue'
  
  export default defineComponent({
    name: "PitsList",
    components: {
      IonButtons,
      IonModal,
      IonContent,
      IonHeader,
      IonPage,
      IonToolbar,
      IonButton,
      IonTitle,
      IonItem,
      IonLabel,
      IonBadge,
      IonAccordion, 
      IonAccordionGroup,
      //IonPopover,
      //IonIcon,
      //IonInput,
      //MapBox,
      AppHeader,
      
    },
    setup() {
      const currentDate = ref(new Date())
      const router = useRouter();
      const route = useRoute();
     
      const { user, logout, getProjectByID,updateProjectPits } = useAppState();
      const currentUser = ref<any>(user);
      const project_id = ref<any>(route.params)
      const project = ref<any>({});
      const pits = ref<any>([]);
      const currentPit = ref();
      const prevPit = ref();
      const isOpen = ref(false);
     
    
      onMounted(async () => {
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
    
        project.value = await getProjectByID(project_id.value)
        pits.value = project.value.pits
        console.log(project.value);
             
      });
  
     
  
  //check error
      const pitClick = (clickData: { _id: any; }) => {
          const pitClicked = pits.value.find((pit: { p: { toString: () => any; }; }) => pit.p.toString() === clickData._id);
          prevPit.value = currentPit.value
          currentPit.value = pitClicked
  
          if (pitClicked == undefined || pitClicked===prevPit.value) { modalManager("close"); return; }
  
          modalManager("open");
          pitClicked.selected = true
      }
  
      //modal block
        const modalManager = (action:any=undefined)=> {
          if(action=="close") modalManagerInternal(true);
          else if(action=="open") modalManagerInternal(false);
          else if(isOpen.value) modalManagerInternal(true);
          else modalManagerInternal(false);
        }
  
        const modalManagerInternal = (close:boolean)=>{
          pits.value.forEach((pit:any) => pit.selected = false );
          if(close)
          {
            isOpen.value = false;
            prevPit.value = undefined;
            currentPit.value = undefined;
          }
          else
            isOpen.value = true;
        }
        
  
     
  
        
     
      return {
        //methoods
        pitClick,
        modalManager,
     
        //properties
        currentUser: user,
        project: project,
        pits: pits,
        currentPit:currentPit,
        prevPit:prevPit,
        currentDate: currentDate,
        isOpen: isOpen,
   
  
        //ion icons
        flashOutline,
        trashOutline,
      };
    },
  });
  </script >
  
  <style scoped>
  .hebrewText{
    direction: rtl;
    line-height: 80%;
    overflow: scroll;
    margin-bottom: 10%;
  }
  #map {
    height: 100%;
    width: 100%;
  }
  
  #container strong {
    font-size: 20px;
    line-height: 26px;
  }
  
  #container p {
    font-size: 16px;
    line-height: 22px;
  
    color: #8c8c8c;
  
    margin: 0;
  }
  
  #container a {
    text-decoration: none;
  }
  
  .splitScreen {
    width: 100%;
    height: 100%;
  }
  .screenTop, .screenBottom {
    width: 100%;
    height: 50%;
  }
  .screenTop {
    overflow-y: scroll;
  }
  .screenBottom {
    display: flex;
  }
  
  .modalHalfScreen {
    height: 60%;
    margin-top: 0px;
    
  }
  
  h5,h6{
    font-weight: bold;
  }
  
  .coords {
    font-family: monospace;
    font-size: 150%;
    letter-spacing: 1px;
  }
  
  .grid-container {
    display: grid;
    justify-content: space-evenly;
    align-content: center;
  }
  </style>
  