<template>
    <ion-page>
      <ion-content >
        <AppHeader :str="'רשימת כלונסאות'"/>
        
        <!-- <ion-item v-show="lastPit" >
          <p slot="end" class="pitText">{{lastPit?.p}}</p> 
          <ion-button color="warning"  size="large" slot="start" @click="pitClick({_id:lastPit?.p})">בחר</ion-button>
        </ion-item> -->

            <ion-accordion-group  :multiple="true" :value="['Waiting', 'Done']">

              <ion-accordion>
  
                <ion-item slot="header">
                  <ion-label>מיון</ion-label>
                </ion-item>
      
                <div slot="content">
                  <ion-item :key="listObj" v-for="listObj in project?.pitsList ">
             
                    <ion-button class="sortButton" size="large" expand="block" fill="outline"  @click="sortPits(listObj.listName.toString())">{{listObj.listName}}</ion-button>
              
                  </ion-item>
                </div>
      
              </ion-accordion>
  
              <ion-accordion value="Waiting">
  
                <ion-item  slot="header">
                  <ion-label>לא הושלמו</ion-label>
                  <ion-badge style="margin:2px"> {{ pits?.filter((pit: { status: string; })=>pit.status!='Done').length }} </ion-badge>
                </ion-item>
  
                <div slot="content">
                  <ion-item  :key="pit?._id" v-for="pit in pits.filter((pit: { status: string; })=>pit.status!='Done')">
                  
                    <ion-button :color="pit?.status=='Done'?'success':'danger'"  size="large"  @click="pitClick({_id:pit.p})">בחר</ion-button>
                    <p slot="" class="pitText">{{ pit.listName}}</p> 
                    <p slot="end" class="pitText">{{pit.p}}</p> 
                  </ion-item>
                </div>
  
              </ion-accordion>
  
  
              <ion-accordion  value="Done">
  
                <ion-item   slot="header">
                  <ion-label>הסתיימו</ion-label>
                  <ion-badge style="margin:2px"> {{ pits.filter((pit: { status: string; })=>pit.status=='Done').length }} </ion-badge>
                </ion-item>
  
                <div slot="content">
                  <ion-item class="pitsList" :key="pit._id" v-for="pit in pits.filter((pit: { status: string; })=>pit.status=='Done')">
                    
                    <ion-button :color="pit.status=='Done'?'success':'danger'"  size="large"  @click="pitClick({_id:pit.p})">בחר</ion-button>
                    <p slot="" class="pitText">{{ pit.listName}}</p> 
                    <p slot="end" class="pitText">{{pit.p}}</p> 
                  </ion-item>
                </div>
                
              </ion-accordion>
  
            </ion-accordion-group>
         
            <ion-modal :is-open="isOpen" @willDismiss="modalManager('close')" >
              <ion-header>
                <ion-toolbar >
                  <ion-title>בור קידוח מספר {{currentPit?.p}}</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="modalManager('close')">Close</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content  class="ion-padding">
                <div class="hebrewText">
                  <h5>{{currentPit?.listName +" " + currentPit?.p}}</h5>
                  <h6>נתוני קידוח</h6>
                  <ion-item @click="openPopover('Depth')" >
                    <ion-button size="large" @click="openPopover('Depth')">עומק</ion-button>
                  <p slot="end" @click="openPopover('Depth')"><span @click="openPopover('Depth')" class="coords">{{currentPit?.depth +" "+ 'מטר'}}</span></p>
                  </ion-item>
                  <ion-popover  :is-open="popoverOpen" @didDismiss="popoverOpen = false">
                    <ion-content  class="ion-padding">
                      <ion-item >
                        <ion-label position="floating">שינוי עומק</ion-label>
                        <ion-input
                          :autofocus="true"
                          v-model="tempDepth"
                          clearInput="true"
                          type="number"
                        ></ion-input>
                      </ion-item>
                      <ion-button  color="success" @click="changePitDiameterOrDepth('Depth', currentPit._id)">אישור</ion-button>
                    </ion-content>
                  </ion-popover>
                  <ion-item @click="openPopover('Diameter')" >
                  <ion-button size="large" @click="openPopover('Diameter')">קוטר</ion-button>
                  <p slot="end" @click="openPopover('Diameter')" > <span @click="openPopover('Diameter')" class="coords">{{currentPit?.diameter +" "+ 'ס"מ'}}</span></p>
                  </ion-item>
                  <ion-popover :is-open="popoverOpenDiameter" @didDismiss="popoverOpenDiameter = false">
                    <ion-content  class="ion-padding">
                      <ion-item >
                        <ion-label position="floating">שינוי קוטר</ion-label>
                        <ion-input
                          v-model="tempDiameter"
                          type="number"
                        ></ion-input>
                      </ion-item>
                      <ion-button color="success" @click="changePitDiameterOrDepth('Diameter', currentPit._id)">אישור</ion-button>
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
                    <GridButtons v-if="currentPit?.status === 'waiting'" :buttons="buttons" :options="{buttonHeight:110}"/>
                    <GridButtons v-if="currentPit?.status === 'Done'" :buttons="unDoneButton" :options="{buttonHeight:110}"/>
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
                <ion-toolbar >
                  <ion-title>בור קידוח מספר {{currentPit?.p}}</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="modalManagerNotes">Close</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content  class="ion-padding">
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
           
              <ion-content  class="ion-padding">
                <ion-item >
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
    onIonViewDidEnter,
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
  import { home, checkmarkDoneOutline, closeCircleOutline } from 'ionicons/icons';
  
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
      const { user,updateProjectReports, unsetReportSigByID, updatePitStatusAndReport,updatePitDepth, updatePitDiameter, getProjectPits, saveNewReport,getReportByID,updateReportByID, logout,getProjectByID,updateProjectPits ,getDrillingMachineByID, updateProjectLastPit} = useAppState(); 
      const currentUser = ref<any>(user);
      const project_id = ref<any>(route.params)
      const project = ref<any>({});
      const projects = ref<any>();
      const allPits = ref<any>([])
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

        const unDoneButton = reactive(
        [
          {text:"ביטול ביצוע",  icon: closeCircleOutline,  click: ()=>setUnDone() },
        
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
    onIonViewDidEnter(async () => {
        if(user?.value.customData.organizationID === undefined)
            router.push('Login')

          
          project.value = await getProjectByID(currentUser?.value.customData.project_id.$oid);
          
          
          //lastPit.value = project.value.pits[project.value.lastPit]

          
          
          
            allPits.value = await getProjectPits(currentUser?.value.customData.project_id.$oid)
            allPits.value= allPits.value.sort((a: { p: number; },b: { p: number; })=>a.p*1 - b.p*1)
            pits.value = allPits.value
            
            showMap.value = true
            pits.value.forEach((pit:any) => pit.selected = false );
            current_machine.value = await getDrillingMachineByID(currentUser?.value.customData.machine_id.$oid)
        
             
      });
  
     
      const sortPits = (listName:string)=>{
        if(listName === 'איפוס'){
          pits.value = allPits.value
          project.value.pitsList.splice(0,1)
        }
        else{
          pits.value = allPits.value.filter((pit: { listName: string; })=> pit.listName === listName)
          if(project.value.pitsList[0].listName === 'איפוס' ){
            return
          }
          let tempArr = [{listName:'איפוס'}]
          project.value.pitsList = tempArr.concat(project.value.pitsList)
        }
        
      }
  
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

      const setConfirm = async ()=>{ 
        console.log("setConfirm");
           
        if(currentPit.value.diameter == 0 || currentPit.value.depth == 0 ){
          alert('יש לוודא עומק וקוטר פיר קידוח תקינים!')
          return
        } 
        else{
             currentPit.value.status = 'Done';
             currentPit.value.finishDate = new Date()
             await savePitChanges(); 
            }          
      }

      const setUnDone = async ()=>{  
        if(currentPit.value.status === 'Done'){
          let report = await getReportByID(currentPit?.value.report_id)
            if(report.signatureName !== undefined){
              alert('לא ניתן לבצע שינוי מאחר שהדו"ח חתום')
              return
            }
            else{
             currentPit.value.status = 'waiting';
             //remove pit from report
             console.log(currentPit.value);
             
             //let report = await getReportByID(currentPit.value.report_id.toString())
             //console.log(report);
             
             //report.pits = report.pits.filter((pit: { pit_id: any; })=> pit.pit_id === currentPit.value._id)
            // await updateReportByID(report)
             //remove report  from pit
             currentPit.value.report_id = ""
             await updatePitStatusAndReport(currentPit.value)
             savePitChanges();
            }
          }      
      }

      const unsetPending= ()=>{  
        if(currentPit.value.status === 'Pending'){
             currentPit.value.status = 'waiting';
             savePitChanges();
          }      
      }
      
      const savePitChanges= async()=>{
        console.log("savePitChanges");
        let index = pits.value.indexOf(currentPit.value)
          pits.value[index] = currentPit.value;
          if(currentPit.value.status === 'Done')
          {
            await addToDailyReport();
          }
          
          //await updateProjectPits(project.value)
          //await saveNewReport(currentPit.value)
          modalManager("close")
      }

      const addToDailyReport = async()=>{
         console.log("addToDailyReport");
         if(project.value.reports === null){
          project.value.reports = []
         }

          let today = new Date();
          //if its a new project and this is the first report
          if(project.value.reports.length === 0){
            let reports = []
            //let pits = [currentPit.value._id]
            let report = {date: today, project_id:project.value._id, project_name: project.value.name, project_address: project.value.address }
            let resp = await saveNewReport(report)
            currentPit.value.report_id = resp
            await updatePitStatusAndReport(currentPit.value)
            reports.push({date:today,report_id:resp })
            project.value.reports = reports
            //await updateProjectReports(project.value)
          }
          else{
            
            let index = project.value.reports.length  * 1  - 1
            let report = project.value.reports[index]
            let repoDate = new Date(report.date)

            //if the last report is today's report
            if(repoDate.getDate() == today.getDate() &&repoDate.getMonth() == today.getMonth() &&repoDate.getFullYear() == today.getFullYear()){
            //project.value.reports[index].pits.push(currentPit.value)
            let report_id = report.report_id ;
            let tempReport = await getReportByID(report_id.toString())
            //if today's report is already signed 
            if(tempReport.signatureName !== undefined || tempReport.signatureName !== ""){
              console.log('is today');
              //add confirmation prompt
                await unsetReportSigByID(tempReport)
            }
            //report.pits.push(currentPit.value._id)
            //await updateReportByID(report)
            currentPit.value.report_id = report_id
            await updatePitStatusAndReport(currentPit.value)
            
          }
          //else- its a new report for today
          else{
            let reports = project.value.reports
            //let pits = [currentPit.value._id]
            let report = {date: today , project_id:project.value._id, project_name: project.value.name, project_address: project.value.address  }
            let resp = await saveNewReport(report)
            currentPit.value.report_id = resp
            await updatePitStatusAndReport(currentPit.value)
            reports.push({date:today,report_id:resp })
            project.value.reports = reports
            console.log(resp);
            
            
            //project.value.reports.push({date:today,pits:[currentPit.value] })
          }

          
          }
          await updateProjectReports(project.value)
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

      const changePitDiameterOrDepth= async(type: string, _id:any)=>{
        
        let index = pits.value.indexOf(currentPit.value)
        console.log(index);
        
        let tempPit = currentPit.value
        if(type === 'Depth'){
          tempPit.depth = tempDepth.value * 1
          tempPit.concreteVolume = (3.14 * ((tempPit.diameter/2) * (tempPit.diameter/2)) * tempPit.depth)/10000
          await  updatePitDepth(tempPit)
          popoverOpen.value = false
        }
        if(type === 'Diameter'){
          tempPit.diameter = tempDiameter.value * 1
          tempPit.concreteVolume = (3.14 * ((tempPit.diameter/2) * (tempPit.diameter/2)) * tempPit.depth)/10000
          await  updatePitDiameter(tempPit)
          popoverOpenDiameter.value = false
        }
        pits.value[index] = tempPit;
        console.log(pits.value);
        
        currentPit.value = tempPit
        console.log(currentPit.value);
        
      }
        
  
     
  
        
     
      return {
        //methoods
        sortPits,
        pitClick,
        modalManager,
        setConfirm,
        savePitChanges,
        setUnDone,
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
        allPits,
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

        unDoneButton,
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
    font-size: 150%;
    letter-spacing: 1px;
  }
  
  .grid-container {
    display: grid;
    justify-content: space-evenly;
    align-content: center;
  }

  .pitText{
    font-size: 150%;
  }
  .sortButton{
    width:100%;
  }

  </style>
  