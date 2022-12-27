<template>
    <ion-page>
      <ion-content color="dark">
        <AppHeader :str="'רשימת כלונסאות'"/>
        
        <ion-item v-show="lastPit" color="dark">
          {{lastPit?.p}}
          <ion-button color="warning" slot="end" @click="pitClick({_id:lastPit?.p})">בחר</ion-button>
        </ion-item>

            <ion-accordion-group color="dark" :multiple="true" :value="['Waiting', 'Done']">
  
              <ion-accordion value="Waiting">
  
                <ion-item color="dark" slot="header">
                  <ion-label>לא הושלמו</ion-label>
                  <ion-badge style="margin:2px"> {{ pits.filter(pit=>pit.status!='Done').length }} </ion-badge>
                </ion-item>
  
                <div slot="content">
                  <ion-item color="dark" :key="pit._id" v-for="pit in pits.filter(pit=>pit.status!='Done')">
                    {{ pit.p}}
                    <ion-button :color="pit.status=='Done'?'success':'danger'" slot="end" @click="pitClick({_id:pit.p})">בחר</ion-button>
                  </ion-item>
                </div>
  
              </ion-accordion>
  
  
              <ion-accordion color="dark" value="Done">
  
                <ion-item color="dark" slot="header">
                  <ion-label>הסתיימו</ion-label>
                  <ion-badge style="margin:2px"> {{ pits.filter(pit=>pit.status=='Done').length }} </ion-badge>
                </ion-item>
  
                <div slot="content">
                  <ion-item color="dark" :key="pit._id" v-for="pit in pits.filter(pit=>pit.status=='Done')">
                    {{pit.p}}
                    <ion-button :color="pit.status=='Done'?'success':'danger'" slot="end" @click="pitClick({_id:pit.p})">לפירוט</ion-button>
                  </ion-item>
                </div>
                
              </ion-accordion>
  
            </ion-accordion-group>
         
            <ion-modal :is-open="isOpen" >
              <ion-header>
                <ion-toolbar color="dark">
                  <ion-title>בור קידוח מספר {{currentPit?.p}}</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="modalManager('close')">Close</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content color="dark" class="ion-padding">
                <div class="hebrewText">
                  <h5>{{currentPit?.p}}</h5>
                  <h6>נתוני קידוח</h6>
                  <ion-item color="dark">
                    <ion-button @click="openPopover('Depth')">עומק</ion-button>
                  <p @click="openPopover('Depth')">עומק: <span @click="openPopover('Depth')" class="coords">{{currentPit?.depth}}</span></p>
                  </ion-item>
                  <ion-popover  :is-open="popoverOpen" @didDismiss="popoverOpen = false">
                    <ion-content color="dark" class="ion-padding">
                      <ion-item color="dark">
                        <ion-label position="floating">שינוי עומק</ion-label>
                        <ion-input
                         
                          v-model="tempDepth"
                          clearInput
                          type="number"
                        ></ion-input>
                      </ion-item>
                      <ion-button color="success" @click="changePitDiameterOrDepth('Depth', currentPit.p.toString())">אישור</ion-button>
                    </ion-content>
                  </ion-popover>
                  <ion-item color="dark">
                  <ion-button @click="openPopover('Diameter')">קוטר</ion-button>
                  <p @click="openPopover('Diameter')" >קוטר: <span @click="openPopover('Diameter')" class="coords">{{currentPit?.diameter}}</span></p>
                  </ion-item>
                  <ion-popover :is-open="popoverOpenDiameter" @didDismiss="popoverOpenDiameter = false">
                    <ion-content color="dark" class="ion-padding">
                      <ion-item color="dark">
                        <ion-label position="floating">שינוי קוטר</ion-label>
                        <ion-input
                          v-model="tempDiameter"
                          type="number"
                        ></ion-input>
                      </ion-item>
                      <ion-button color="success" @click="changePitDiameterOrDepth('Diameter', currentPit.p.toString())">אישור</ion-button>
                    </ion-content>
                  </ion-popover>
                  
                  <p>נפח בטון תיאורטי: <span class="coords">{{currentPit?.concreteVolume?.toFixed(3)}}</span></p>
                  <div v-if="currentPit?.coordinates">
                  <h6>קואורדינטות</h6>
                  <p>Lon: <span class="coords">{{currentPit?.coordinates.long.toFixed(10)}}</span></p>
                  <p>Lat: <span class="coords">{{currentPit?.coordinates.lat.toFixed(10)}}</span></p>
                  <h6>רשת ישראל החדשה</h6>
                  <p>צפון: <span class="coords">{{currentPit?.itm.y}}</span></p>
                  <p>מערב: <span class="coords">{{currentPit?.itm.x}}</span></p>
                  </div>
                  <p>סטטוס: {{currentPit?.status === 'Done' ? 'בוצע' : 'לא בוצע' }}</p>
                  <div :key="note.depth" v-for="note in currentPit?.notes">
                  <p>סוג מפגע:{{note?.note}} עומק: {{note?.depth}}</p>
                </div>
                  <div>
                    <GridButtons v-if="currentPit?.status === 'waiting'" :buttons="pendingButton" :options="{buttonHeight:110}"/>
                    <GridButtons v-if="currentPit?.status === 'Pending'" :buttons="buttons" :options="{buttonHeight:110}"/>
                     <!-- <ion-button  @click="setPending" color="success">התחלת ביצוע</ion-button>
                     <ion-button v-if="currentPit?.status === 'Pending'" @click="unsetPending" color="danger">ביטול התחלת ביצוע</ion-button>
                     <ion-button v-if="currentPit?.status === 'Pending'" @click="setConfirm" color="success">סיום ביצוע</ion-button>
                     <ion-button v-if="currentPit?.status === 'Pending'" @click="modalManagerNotes" color="warning">הערות קידוח</ion-button> -->
                  </div>
                </div>
              </ion-content>
            </ion-modal>
      
            <!--drilling notes modal-->
            
            <ion-modal :is-open="isOpenNotes">
              <ion-header>
                <ion-toolbar color="dark">
                  <ion-title>בור קידוח מספר {{currentPit?.p}}</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="modalManagerNotes">Close</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content color="dark" class="ion-padding">
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
            <ion-modal :is-open="isOpenDepth" >
           
              <ion-content color="dark" class="ion-padding">
                <ion-item color="dark">
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
  import { defineComponent, onMounted, ref, reactive } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useAppState } from "../realm-state";
 
  
  import AppHeader from '../Components/AppHeader.vue'
  import GridButtons from "./Utilities/GridButtons.vue";
  import { home, checkmarkDoneOutline } from 'ionicons/icons';
  
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
      IonPopover,
      IonIcon,
      IonInput,
      //MapBox,
      AppHeader,
      GridButtons,
      
    },
    setup() {
      const currentDate = ref(new Date())
      const router = useRouter();
      const route = useRoute()
      const { user, saveNewReport,getReportByID,updateReportByID, logout,getProjectByID,updateProjectPits ,getDrillingMachineByID, updateProjectLastPit} = useAppState(); 
      const currentUser = ref<any>(user);
      const project_id = ref<any>(route.params)
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
      const current_machine = ref<any>()

      const lastPit = ref<any>()

      //popover change diameter and depth
      const popoverOpen = ref(false)
      const popoverOpenDiameter = ref(false)
      const tempDepth = ref<any>()
      const tempDiameter = ref<any>()

        const pendingButton = reactive(
        [
          {text:"תחילת ביצוע",  icon: home,  click: ()=>setPending() },
        
        ]
      );

      const buttons = reactive(
        [
          //{text:"ביטול תחילת ביצוע",  icon: home,  click: ()=>unsetPending() },
          {text:"אישור",  icon: checkmarkDoneOutline,  click: ()=>setConfirm() },
          //{text:"הוספת הערות קידוח",  icon: home,  click: ()=>modalManagerNotes()},
        
        ]
      );
     
    //<ion-icon name="checkmark-done-outline"></ion-icon>
      onMounted(async () => {
        if(user?.value.customData.organizationID === undefined)
            router.push('Login')

            
          project.value = await getProjectByID(currentUser?.value.customData.project_id.$oid);
          lastPit.value = project.value.pits[project.value.lastPit]
          
          console.log(project.value);
            
            pits.value = project.value.pits
            showMap.value = true
            pits.value.forEach((pit:any) => pit.selected = false );
            current_machine.value = await getDrillingMachineByID(currentUser?.value.customData.machine_id.$oid)
            console.log(current_machine.value);
             
      });
  
     
  
  //check error
      const pitClick = (clickData: { _id: any; }) => {
          const pitClicked = pits.value.find((pit: { p: { toString: () => any; }; }) => pit.p.toString() === clickData._id.toString());
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
        if(currentPit.value.diameter == 0 || currentPit.value.depth == 0 ){
          alert('יש לוודא עומק וקוטר פיר קידוח תקינים!')
          return
        } 
        else{
             currentPit.value.status = 'Done';
             currentPit.value.finishDate = new Date()
             savePitChanges(); 
            }          
      }

      const setPending = async ()=>{  
        if(currentPit.value.status === 'waiting'){
             currentPit.value.status = 'Pending';
             lastPit.value = currentPit.value
             project.value.lastPit = project.value.pits.indexOf(currentPit.value) 
             await updateProjectLastPit(project.value)
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
        
        let index = pits.value.indexOf(currentPit.value)
          project.value.pits[index] = currentPit.value;
          if(currentPit.value.status === 'Done')
          {
            await addToDailyReport();
          }
          
          await updateProjectPits(project.value)
          //await saveNewReport(currentPit.value)
          modalManager("close")
      }

      const addToDailyReport = async()=>{
          let reports = project.value.reports
          let today = new Date();
          //if its a new project and this is the first report
          if(reports.length === 0){
            let pits = [currentPit.value]
            let report = {date: today, pits , project_id:project.value._id, project_name: project.value.name, project_address: project.value.address }
            let resp = await saveNewReport(report)
            reports.push({date:today,report_id:resp })
            project.value.reports = reports
          }
          else{
            
            let index = reports.length  * 1  - 1
            let report = reports[index]
            let repoDate = new Date(report.date)

            //if the last report is today's report
            if(repoDate.getDate() == today.getDate() &&repoDate.getMonth() == today.getMonth() &&repoDate.getFullYear() == today.getFullYear()){
            //project.value.reports[index].pits.push(currentPit.value)
            let report_id = report.report_id ;
            report = await getReportByID(report_id)
            report.pits.push(currentPit.value)
            await updateReportByID(report)
          }
          //else- its a new report for today
          else{
            let pits = [currentPit.value]
            let report = {date: today, pits , project_id:project.value._id, project_name: project.value.name, project_address: project.value.address  }
            let resp = await saveNewReport(report)
            reports.push({date:today,report_id:resp })
            project.value.reports = reports
            //project.value.reports.push({date:today,pits:[currentPit.value] })
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

      const openPopover = (type: string)=> {

        if(currentPit.value.status === 'Done'){
            return
          }
          
        if(type === 'Diameter'){
          tempDiameter.value = null
          popoverOpenDiameter.value = true
        }
        if(type === 'Depth'){
          tempDepth.value = null
          popoverOpen.value = true
          
        }
        
        
        
      }

      const changePitDiameterOrDepth= async(type: string, _id:string)=>{
        
        let index = pits.value.indexOf(currentPit.value)
        console.log(index);
        
        let tempPit = currentPit.value
        if(type === 'Depth'){
          tempPit.depth = tempDepth.value * 1
          tempPit.concreteVolume = (3.14 * ((tempPit.diameter/2) * (tempPit.diameter/2)) * tempPit.depth)/10000
          popoverOpen.value = false
        }
        if(type === 'Diameter'){
          tempPit.diameter = tempDiameter.value * 1
          tempPit.concreteVolume = (3.14 * ((tempPit.diameter/2) * (tempPit.diameter/2)) * tempPit.depth)/10000
          popoverOpenDiameter.value = false
        }
        project.value.pits[index] = tempPit;
        console.log(project.value.pits);
        
        currentPit.value = tempPit
        console.log(currentPit.value);
        
          
        await updateProjectPits(project.value)
        
      }
        
  
     
  
        
     
      return {
        //methoods
        pitClick,
        modalManager,
        setConfirm,
        savePitChanges,
        setPending,
        unsetPending,
        addToDailyReport,
        goToReport,
        modalManagerNotes,
        modalManagerDepth,
        addNewNoteToPit,
        openPopover,
        changePitDiameterOrDepth,
     
        //properties
        project_id,
        currentUser,
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
        current_machine:current_machine,
        lastPit,
        popoverOpen,
        popoverOpenDiameter,
        tempDepth,
        tempDiameter,

        pendingButton,
        buttons,
  
  
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
  