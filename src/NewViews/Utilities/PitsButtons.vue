<template>
    
         
              <div>
                 <ion-button v-if="currentPit?.status === 'waiting'" @click="setPending" color="success">התחלת ביצוע</ion-button>
                 <ion-button v-if="currentPit?.status === 'Pending'" @click="unsetPending" color="danger">ביטול התחלת ביצוע</ion-button>
                 <ion-button v-if="currentPit?.status === 'Pending'" @click="setConfirm" color="success">סיום ביצוע</ion-button>
                 <ion-button v-if="currentPit?.status === 'Pending'" @click="modalManagerNotes" color="warning">הערות קידוח</ion-button>
              </div>


          
       
  
        <!--drilling notes modal-->
        
        <ion-modal :is-open="isOpenNotes" class="modalHalfScreen">
          <ion-header>
            <ion-toolbar>
              <ion-title>בור קידוח מספר {{currentPit?.p}}</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="modalManagerNotes">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <div class="grid-container">
              <ion-button color="success" @click="modalManagerDepth('כבלים')">כבלים
                <IonIcon slot="start" :icon="flashOutline" />
              </ion-button>
              <ion-button color="success" @click="modalManagerDepth('תשתיות')">תשתיות</ion-button>
              <ion-button color="success" @click="modalManagerDepth('צינור')">צינור</ion-button>
              <ion-button color="success" @click="modalManagerDepth('פסולת')" >פסולת
                <IonIcon slot="start" :icon="trashOutline" />
              </ion-button>
              <ion-button color="success" @click="modalManagerDepth('אבנים')" >אבנים</ion-button>
      
            </div>
          </ion-content>
        </ion-modal>
      
        <!--note depth modal-->
        <ion-modal :is-open="isOpenDepth" class="modalHalfScreen">
       
          <ion-content class="ion-padding">
            <ion-item>
              <ion-label position="floating">עומק</ion-label>
              <ion-input
                v-model="noteDepth"
                type="number"
              ></ion-input>
            </ion-item>
            <ion-button color="success" @click="addNewNoteToPit" >אישור</ion-button>
          </ion-content>
        </ion-modal>
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
    IonPopover,
    IonIcon
    
  } from "@ionic/vue";
  import { flashOutline, trashOutline} from 'ionicons/icons';
  import { defineComponent, onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAppState } from "../../realm-state";
  import MapBox from "./MapBox.vue";
  
  import AppHeader from '../Components/DrillerAppHeader.vue'
  
  export default defineComponent({
    name: "PitsButtons",
    components: {
      IonButtons,
      IonModal,
      //IonContent,
      IonHeader,
      //IonPage,
      IonToolbar,
      IonButton,
      IonTitle,
      IonItem,
      IonLabel,
      //IonBadge,
      //IonAccordion, 
      //IonAccordionGroup,
      //IonPopover,
      IonIcon,
      IonInput,
      //MapBox,
      //AppHeader,
      
    },
    props:{projectProps : Object, pitProps : Object},
    setup(projectProps , pitProps) {
      const currentDate = ref(new Date())
      const router = useRouter();
     
      const { user, logout, getAllProjects,updateProjectPits } = useAppState();
       const currentUser = ref<any>(user);
      const project = ref<any>(projectProps.projectProps);
      const pits = ref<any>([]);
      const currentPit = ref<any>(pitProps);
      const prevPit = ref();
      const isOpen = ref(false);
      const isOpenNotes = ref(false);
      const noteDepth = ref(0);
      const isOpenDepth = ref(false);
      const note = ref("")
      const current_machine = ref<any>()
    
      onMounted(async () => {
        console.log(project.value);
        console.log(currentPit.value)
        
      });
  
        const modalManagerNotes = ()=>{
        
          if(isOpenNotes.value === true)
          {
            isOpenNotes.value = false;
           
          }
          else
          isOpenNotes.value = true;
        }
        const modalManagerDepth = (str:string)=>{
        if(isOpenDepth.value === true)
        {
          isOpenDepth.value = false;
         
        }
        else{
          note.value = str
          isOpenDepth.value = true;
        }
        
      }
  
        const setConfirm = ()=>{     
               currentPit.value.status = 'Done';
               currentPit.value.finishDate = new Date()
               savePitChanges();           
        }
  
        const setPending = ()=>{  
          if(currentPit.value.status === 'waiting'){
               currentPit.value.status = 'Pending';
               savePitChanges();
            }      
        }
  
        const unsetPending= ()=>{  
          if(currentPit.value.status === 'Pending'){
               currentPit.value.status = 'waiting';
               savePitChanges();
            }      
        }
        
        const savePitChanges= async()=>{
          let index = currentPit.value.p  * 1  - 1
            project.value.pits[index] = currentPit.value;
            if(currentPit.value.status === 'Done')
            {
              addToDailyReport();
            }
            
            await updateProjectPits(project.value)
            //modalManager("close")
        }
  
        const addToDailyReport = ()=>{
            let reports = project.value.reports
            let today = new Date();
            //if its a new project and this is the first report
            if(reports.length === 0){
              //reports = [];
              reports.push({date:today,pits:[currentPit.value,] })
              project.value.reports = reports
            }
            else{
              
              let index = reports.length  * 1  - 1
              let report = reports[index] ;
              let repoDate = new Date(report.date)
  
              //if the last report is today's report
              if(repoDate.getDate() == today.getDate() &&repoDate.getMonth() == today.getMonth() &&repoDate.getFullYear() == today.getFullYear()){
              project.value.reports[index].pits.push(currentPit.value)
            }
            //else- its a new report for today
            else{
              project.value.reports.push({date:today,pits:[currentPit.value] })
            }
            }
     
            
        }
      
        const addNewNoteToPit = async ()=>{
          if(currentPit.value.notes == null)
               currentPit.value.notes = []
  
          currentPit.value.notes.push({note:note.value, depth:noteDepth.value})
          currentPit.value.notes.sort((a: { depth: any; },b: { depth: any; })=> a.depth * 1 - b.depth * 1)
          let index = currentPit.value.p  * 1  - 1
          project.value.pits[index] = currentPit.value;
          await updateProjectPits(project.value)
          modalManagerDepth("") 
          note.value=""
          noteDepth.value = 0
          
        }
        
      //end modal block
      return {
        //methoods
       
        setConfirm,
        savePitChanges,
        setPending,
        unsetPending,
        addToDailyReport,
      
        modalManagerNotes,
        modalManagerDepth,
        addNewNoteToPit,
        //properties
        currentUser: user,
        project: project,
      
        pits: pits,
        currentPit:currentPit,
        prevPit:prevPit,
        currentDate: currentDate,
        isOpen: isOpen,
       
        isOpenNotes:isOpenNotes,
        noteDepth:noteDepth,
        isOpenDepth:isOpenDepth,
        note:note,
        current_machine:current_machine,
  
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
  