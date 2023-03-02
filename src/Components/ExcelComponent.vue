<template>
  <ion-page>

    <ion-loading
    :is-open="isOpenLoading"
    cssClass="my-custom-class"
    message="יוצר כלונסים"
    
  >
  </ion-loading>
     <AppHeader :showButtons="true"/>
    
    <ion-content  :fullscreen="true" >

  
    <!-- <div class="splitScreen">
      <div class="screenTop"> -->


   
<div class="container">
  <h1 id="title">הוספת כלונסים</h1>
  <p> מספר כלונסים:{{pitsNumber}}</p>
<div class="containerPits">

    <!-- <div >
      <p>קובץ כלונסים</p>
      <input
        type="file"
        v-on:change="addfile($event)"
        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </div> -->
      
    <div> 
      <ion-button @click="columnsModalManager">הוספת כלונסים ידנית </ion-button>
      
    </div>

   
    </div>
  </div>
  <div class="center">
    <ion-button @click="updateProject">{{'שמירת פרוייקט ומעבר להוספת מכונת קידוח'}}</ion-button>
  </div>
    

     <MapBox v-show="showMap" id="map" 
      :pitsToShow="pitsToShow" 
      @pitClick="pitClick"
       />


      <!-- </div> -->
    <!-- </div> -->



       <ion-modal  :is-open="isOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>בור קידוח מספר {{currentPit.p}}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="modalManager">סגירה</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
          <h5>{{currentPit?.p}}</h5>
          <h6>נתוני קידוח</h6>
          <p>עומק: <span class="coords">{{currentPit?.diameter}}</span></p>
          <p>קוטר: <span class="coords">{{currentPit?.depth}}</span></p>
          <p>נפח בטון תיאורטי: <span class="coords">{{currentPit?.concreteVolume.toFixed(3)}}</span></p>
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

         <!--add columns manualy modal-->
         <ion-modal :is-open="isOpeColumn">
          <ion-header>
            <ion-toolbar>
              <ion-title>הוספת כלונסים ידנית</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="columnsModalManager">סגירה</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <div class="hebrewText">
              <ion-item>
                <ion-label position="floating">שם רשימה</ion-label>
                <ion-input
                  v-model="listName"
                  type="text"
                ></ion-input>
            </ion-item>
              <ion-item>
                <ion-label position="floating">כלונס התחלה</ion-label>
                <ion-input
                  v-model="columnStart"
                  type="number"
                ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">כלונס סיום</ion-label>
              <ion-input
                v-model="columnEnd"
                type="number"
              ></ion-input>
            </ion-item>
            <ion-button @click="createColumnsManually()">אישור</ion-button>
            </div>
            
          </ion-content>
        </ion-modal>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle,IonInput,IonLabel,IonItem,IonLoading } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';
import MapBox from'../views/MapBox.vue';
//imports 
import * as XLSX from "xlsx";
import proj4 from 'proj4'

import AppHeader from './AppHeader.vue'





export default defineComponent({
  name: 'SecondExcelComponent',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonButtons,
    IonModal,
    IonTitle,
    IonInput,
    IonLabel,
    IonItem,
    IonLoading,
    MapBox,
    AppHeader
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>();
    const {user , saveNewPit, saveProjectPits, updateProjectPitsList,getProjectByID,getProjectPits,updateProjectPits,  getDrillingMachinesByID,  updateMachineDrillers, updateEmployeeMachine, getAllEmployees} = useAppState();
    const file = ref<any>(File);
    const arrayBuffer = ref<any>(null);
    const filelist = ref<any>(null);
    const arraylist = ref<any>();
    const pitsToShow = ref<any>([]);
    const showMap = ref(false);
    const isOpen = ref(false);
    const isOpenDriller = ref(false);
    const isOpenMachine = ref(false);
    const isOpeColumn = ref(false);
    const currentPit = ref<any>();
    const projectName = ref("");
    const projectAddress = ref("");
    const projectClient = ref("");
    const projectContactPerson = ref("");
    const contactPersonPhone = ref("");
    const contactPersonMail = ref("");
    const projectPits = ref<any>();
    const reports = ref<any>([])
    const organizationID = ref();
    const drillingMachines = ref<any>()
    const current_machine = ref<any>()
    const employees = ref<any>()
    const current_employee = ref<any>() 
    const isOpenEmp= ref(false)
    const projectMachines = ref<any>([])
    const listName = ref("")
    const columnStart = ref(0)
    const columnEnd = ref(0)
    const project_id = ref<any>(route.params.id)
    const project = ref<any>()
    const isOpenLoading = ref(false)
    const pitsNumber = ref(0)

  onMounted(async()=>{
    organizationID.value = user.value.customData.organizationID
    project.value = await getProjectByID(project_id.value)
    
  });
 const addfile = async (event:any) =>{
  
      file.value = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file.value);
      fileReader.onload = async (e) => {
        isOpenLoading.value = true
        arrayBuffer.value = fileReader.result;
        var data = new Uint8Array(arrayBuffer.value);
        var arr = [];
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        //console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        arraylist.value =  XLSX.utils.sheet_to_json(worksheet, { raw: true });
        filelist.value = [];
        var pits= []
        for(i = 0 ; i < arraylist.value.length ; i++){
            let p = arraylist.value[i].p;
            let diameter =arraylist.value[i].diameter;
            let depth = arraylist.value[i].depth;
            let itm = {x : arraylist.value[i].x , y : arraylist.value[i].y }
            let concreteVolume = (3.14 * ((diameter/2) * (diameter/2)) * depth)/10000
            const [long, lat] = proj4('+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees', [itm.x, itm.y]);
            let pit = {project_id: project.value._id, p:p ,depth, diameter, itm:itm , coordinates: {long:long,lat:lat}, status:'waiting',concreteVolume:concreteVolume}
            //let pit_id = await saveNewPit(pit)
            pits.push(pit) 
            
        }
        project.value.pits = pits
        pitsToShow.value = await getProjectPits(project_id.value);
        showMap.value = true;
        console.log(project.value);
        console.log(pitsToShow.value);
        isOpenLoading.value = false
      };
    }

    const createColumnsManually = async ()=>{
      if(columnEnd.value === columnStart.value){
        alert("יש לוודא תקינות קלט")
        return;
      }
      console.log("called");
      isOpenLoading.value = true
      var pits= []
        for(var i = 0; i <= columnEnd.value - columnStart.value ; i++){
            let p = columnStart.value * 1 + i ;
            let pit = {listName:listName.value, project_id: project.value._id, p:p ,depth:0, diameter:0, status:'waiting',concreteVolume:0}
            //let pit_id = await saveNewPit(pit)
            pits.push(pit)
        }
        let res = await saveProjectPits(pits)
        console.log(res);
        pitsNumber.value += pits.length
        if(project.value.pitsList === undefined || project.value.pitsList === null){
          project.value.pitsList = []
        }
        project.value.pitsList.push(listName.value)
        await updateProjectPitsList(project.value)
        
        //project.value.pits = pits;
        console.log(project.value);
        
        columnsModalManager();
        isOpenLoading.value = false
    }

     const pitClick = (clickData: { _id: any; }) => {
        const pitClicked = pitsToShow.value.find((pit: { p: { toString: () => any; }; }) => pit.p.toString() === clickData._id);
        console.log("pitClicked:")
        console.log(pitClicked)
        currentPit.value = pitClicked
        modalManager();
        if (pitClicked == undefined) return;
        
    }

    const updateProject =async ()=>{
      await updateProjectPits(project.value)
      router.push('/add-machine-project/'+ project_id.value)
    }

       //modal block
      const modalManager = ()=>{
        if(isOpen.value)
          isOpen.value=false;
        else
          isOpen.value = true;
      }
      
      const changeDrillerModalManager = (machine: any)=>{
        if(isOpenDriller.value)
        isOpenDriller.value=false;
        else{
          current_machine.value = machine
          isOpenDriller.value = true;
          if(machine?.value.driller !== undefined){
              current_employee.value = employees?.value.filter((emp: { _id: any; }) => emp._id.toString() === machine?.value.driller.driller_id.toString())
              current_employee.value = current_employee.value[0]
              console.log(current_employee.value);
            }
        }
        
      }

      const machinesModalManager = ()=>{
        if(isOpenMachine.value)
        isOpenMachine.value=false;
        else
        isOpenMachine.value = true;
      }

      const columnsModalManager = ()=>{
        if(isOpeColumn.value)
        isOpeColumn.value=false;
        else
        isOpeColumn.value = true;
      }

      const viewEmployeeModalManager = (employee: any)=>{
        if(isOpenEmp.value)
        isOpenEmp.value=false;
        else{
          current_employee.value = employee
          isOpenEmp.value = true;
         
        }
        
      }

      const addMachine = (machine: any)=>{
        if(projectMachines.value === undefined)
            projectMachines.value = []

        projectMachines.value.push(machine)
        machinesModalManager()
      }

      const removeMachine = (machine:any)=>{
        let i = projectMachines.value.indexOf(machine)
        projectMachines.value.splice(i,1)
        console.log(projectMachines.value);
        
}


  const addEmployee = async (employee: any)=>{
    current_machine.value.driller = {driller_id : employee._id, first: employee.first, last: employee.last}
    console.log(current_machine.value);
    employee.machine_id = current_machine.value._id
      
    if(current_employee.value !== undefined){
         current_employee.value.machine_id = ""
         await updateEmployeeMachine(current_employee.value)
        }

    await updateMachineDrillers(current_machine.value)
    await updateEmployeeMachine(employee)
    current_employee.value = employee
  }

  const addDrillerToMachine = async (employee: any)=>{
      if(current_machine.value.drillers === undefined){
        current_machine.value.drillers = []
      }
      let driller = {first: employee.first, last: employee.last, _id: employee._id}
      console.log(driller);
      
      current_machine.value.drillers.push(driller)
      await updateMachineDrillers(current_machine.value)

      employee.machine_id = current_machine.value._id
      await updateEmployeeMachine(employee)

      changeDrillerModalManager(null)
      

  }

      
     return {
        //methoods
        addfile,
        pitClick,
        modalManager,
        changeDrillerModalManager,
        machinesModalManager,
        viewEmployeeModalManager,
        columnsModalManager,
        updateProject,
        addMachine,
        removeMachine,
        addEmployee,
        addDrillerToMachine,
        createColumnsManually,
       //properties
        currentUser : user,
        file : file,
        arrayBuffer :arrayBuffer,
        filelist:filelist,
        arraylist :arraylist,
        pitsToShow :pitsToShow,
        showMap:showMap,
        isOpen:isOpen,
        isOpenDriller:isOpenDriller,
        isOpeColumn:isOpeColumn,
        isOpenMachine:isOpenMachine,
        currentPit:currentPit,
        projectName: projectName,
        projectAddress: projectAddress,
        projectClient:projectClient,
        projectContactPerson:projectContactPerson,
        contactPersonPhone:contactPersonPhone,
        contactPersonMail:contactPersonMail,
        projectPits:projectPits,
        reports:reports,
        organizationID:organizationID,
        drillingMachines:drillingMachines,
        current_machine:current_machine,
        employees:employees,
        current_employee:current_employee,
        isOpenEmp:isOpenEmp,
        projectMachines:projectMachines,
        listName,
        columnStart:columnStart,
        columnEnd: columnEnd,
        project_id,
        project,
        isOpenLoading,
        pitsNumber
      
  }
  },
 
});
</script>

<style scoped>
#title{
  text-align: center;
  color: #4DBA87;
  font-size: 30px;
  font-weight: bolder;
}
.container {
  border: #4DBA87 2px solid;
  border-radius: 10px;
  text-align: center;
  padding: 2%;
  margin: 2%;
}
.containerPits{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
 
}
.center{
  text-align: center;
padding-bottom: 2%;

}
.hebrewText{
  direction: rtl;
  line-height: 80%;
  overflow: scroll;
  margin-bottom: 10%;
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

h5,h6{
  font-weight: bold;
}

.coords {
  font-family: monospace;
  font-size: 150%;
  letter-spacing: 1px;
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