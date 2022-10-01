<template>
  <ion-page>
    <ion-content>
      <AppHeader :showButtons="false"/>
      <ion-button @click="goToReport">דוח יומי</ion-button>
      <div class="splitScreen">
        <div class="screenTop">

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
        </div>
        <div class="screenBottom">

        <MapBox id="map" 
        v-show="showMap"
        :pitsToShow="pits" 
        @pitClick="pitClick"
        />
        </div>
      </div>


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
            <ion-button color="success" @click="setPending" >התחלת ביצוע</ion-button>
            <ion-button color="success" @click="setConfirm" >סיום ביצוע</ion-button>
            <ion-button @click="modalManagerNotes" color="warning">הערות קידוח</ion-button>
            <ion-button @click="setGarbage" color="warning">זבל בקידוח</ion-button>
          </div>
        </ion-content>
      </ion-modal>

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
          <div class="hebrewText">
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
  IonPopover,
  IonIcon
  
} from "@ionic/vue";
import { flashOutline, trashOutline} from 'ionicons/icons';
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppState } from "../realm-state";
import MapBox from "./MapBox.vue";

import AppHeader from '../Components/AppHeader.vue'

export default defineComponent({
  name: "DrillerView",
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
    IonIcon,
    IonInput,
    MapBox,
    AppHeader,
    
  },
  setup() {
    const currentDate = ref(new Date())
    const router = useRouter();
    const currentUser = ref<any>();
    const { user, logout, getAllProjects,updateProjectPits } = useAppState();
    const project = ref<any>({});
    const projects = ref<any>();
    const pits = ref<any>([]);
    const currentPit = ref();
    const prevPit = ref();
    const isOpen = ref(false);
    const showMap = ref(false)
    const isOpenNotes = ref(false);
    const noteDepth = ref(0);
    const isOpenDepth = ref(false);
    const note = ref("")
  
    onMounted(async () => {
      projects.value = await getAllProjects();
      findProject()
  
    
           
    });

    const findProject = ()=>{ 

       projects.value = projects.value?.filter((proj: { organizationID: any; }) => proj.organizationID === user.value.customData.organizationID)

      
      for (let index = 0; index < projects.value.length; index++) {
        const element = projects.value[index];
        let employee = element.drillers.find((emp: { _id: any; }) => emp._id == user.value.customData._id)

        if(employee !== undefined){
          project.value = element
          pits.value = element.pits
          showMap.value = true
          pits.value.forEach((pit:any) => pit.selected = false );
          return
        }
        
      }
      
      
       
    
    }

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

      const setGarbage = ()=>{
        if(!currentPit.value.garbage)
          currentPit.value.garbage = true;
          else
             return
        
      }
      const savePitChanges= async()=>{
        let index = currentPit.value.p  * 1  - 1
          project.value.pits[index] = currentPit.value;
          if(currentPit.value.status === 'Done')
          {
            addToDailyReport();
          }
          
          await updateProjectPits(project.value)
          modalManager("close")
      }

      const addToDailyReport = ()=>{
          let reports = project.value.reports
          let today = new Date();
          //if its a new project and this is the first report
          if(reports == undefined){
            reports = [];
            reports.push({date:today,pits:[currentPit.value] })
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
      const goToReport = ()=>{
        router.push('/daily-report/'+ project.value._id)
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
      pitClick,
      modalManager,
      setConfirm,
      setGarbage,
      savePitChanges,
      setPending,
      addToDailyReport,
      findProject,
      goToReport,
      modalManagerNotes,
      modalManagerDepth,
      addNewNoteToPit,
      //properties
      currentUser: user,
      project: project,
      projects:projects,
      pits: pits,
      currentPit:currentPit,
      prevPit:prevPit,
      currentDate: currentDate,
      isOpen: isOpen,
      showMap:showMap,
      isOpenNotes:isOpenNotes,
      noteDepth:noteDepth,
      isOpenDepth:isOpenDepth,
      note:note,

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
</style>
