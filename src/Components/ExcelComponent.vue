<template>
  <ion-page>
     <AppHeader :showButtons="true"/>
    
    <ion-content :fullscreen="true" >

  
    <div class="splitScreen">
      <div class="screenTop">


    <h1>יצירת פרוייקט חדש</h1>
     <ion-item>
          <ion-label position="floating">שם הפרוייקט</ion-label>
          <ion-input
            v-model="projectName"
            type="text"
          ></ion-input>
      </ion-item>
      <ion-item>
          <ion-label position="floating">כתובת</ion-label>
          <ion-input
            v-model="projectAddress"
            type="text"
          ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">שם המזמין</ion-label>
        <ion-input
          v-model="projectClient"
          type="text"
        ></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="floating">שם איש קשר/מנהל עבודה</ion-label>
      <ion-input
        v-model="projectContactPerson"
        type="text"
      ></ion-input>
  </ion-item>
  <ion-item>
    <ion-label position="floating">טלפון איש קשר</ion-label>
    <ion-input
      v-model="contactPersonPhone"
      type="text"
    ></ion-input>
</ion-item>
<ion-item>
  <ion-label position="floating">מייל איש קשר</ion-label>
  <ion-input
    v-model="contactPersonMail"
    type="text"
  ></ion-input>
</ion-item>
    <div>
      <p>קובץ כלונסים</p>
      <input
        type="file"
        v-on:change="addfile($event)"
        placeholder="Upload file"
        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </div>
    <div :key="machine.id" v-for="machine in projectMachines">
      <p>{{machine.name}}</p>
      <p>{{machine.type}}</p>
      <p>{{machine.driller.first}} {{machine.driller.last}}</p>
      <ion-button @click="removeMachine(machine)">הסר</ion-button>
    </div>
    <div>
      <p> מספר כלונסים:{{projectPits?.length}}</p>
    </div>
    <ion-button @click="columnsModalManager">הוספת כלונסים ללא קובץ</ion-button>
    
    <ion-button @click="machinesModalManager">הוספת מכונת קידוח</ion-button>
        
    <ion-button @click="saveProject">שמירת פרוייקט</ion-button>

      </div>
      <div class="screenBottom">


     <MapBox v-show="showMap" id="map" 
      :pitsToShow="pitsToShow" 
      @pitClick="pitClick"
       />


      </div>
    </div>



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

    <!--Add machine to project modal-->
    <ion-modal :is-open="isOpenMachine">
      <ion-header>
        <ion-toolbar>
          <ion-title>הוספת מכונת קידוח לפרוייקט</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="machinesModalManager">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
          <ion-item :key="machine._id" v-for="machine in drillingMachines">
            <p>{{machine?.name + ": "}} </p>
            <p> {{ machine?.type}}</p>
            <p>קודח: {{machine?.driller.first}} {{machine?.driller.last}}</p>
            <ion-button  @click="addMachine(machine)">בחירת מכונה</ion-button>
            <ion-button  @click="changeDrillerModalManager(machine)">החלפת קודח</ion-button>
            </ion-item>     
        </div>
        
      </ion-content>
    </ion-modal>

     <!--change driller in machine modal-->
     <ion-modal :is-open="isOpenDriller">
      <ion-header>
        <ion-toolbar>
          <ion-title>הוספת מכונת קידוח לפרוייקט</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="changeDrillerModalManager(null)">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
          <ion-item :key="employee._id" v-for="employee in employees">
            <p>{{employee._id}}</p>
            <p>{{employee.first}} {{employee.last}}</p>
            <ion-button @click="viewEmployeeModalManager(employee)">פרטי עובד</ion-button>
            <ion-button @click="addEmployee(employee)">בחר</ion-button>
            </ion-item>      
        </div>
        
      </ion-content>
    </ion-modal>

       <!--view driller-->
       <ion-modal :is-open="isOpenEmp">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{current_employee?.first}} {{current_employee?.last}}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="viewEmployeeModalManager(null)">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="hebrewText">
            <p>שם: {{current_employee?.first}} {{current_employee?.last}}</p>
          </div>
          
        </ion-content>
      </ion-modal>

         <!--add columns manualy modal-->
         <ion-modal :is-open="isOpeColumn">
          <ion-header>
            <ion-toolbar>
              <ion-title>הוספת כלונסים ידנית</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="columnsModalManager">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <div class="hebrewText">
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
            <ion-button @click="createColumnsManually()">צור</ion-button>
            </div>
            
          </ion-content>
        </ion-modal>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle,IonInput,IonLabel,IonItem, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
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
    MapBox,
    AppHeader
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>();
    const {user , logout, createNewProject, getDrillingMachinesByID,  updateMachineDriller, updateEmployeeMachine, getAllEmployees} = useAppState();
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
    const projectMachines = ref<any>()
    const columnStart = ref(0)
    const columnEnd = ref(0)
  onMounted(async()=>{
    organizationID.value = user.value.customData.organizationID
    drillingMachines.value = await getDrillingMachinesByID();
    const allEmployees= await getAllEmployees();
    employees.value = allEmployees?.filter(emp => emp.organizationID === user.value.customData.organizationID)
    
  });
 const addfile = (event:any) =>{
      file.value = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file.value);
      fileReader.onload = (e) => {
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
            pits[i]= {p:p ,depth, diameter, itm:itm , coordinates: {long:long,lat:lat}, status:'waiting',concreteVolume:concreteVolume}
        }
        projectPits.value = pits
        pitsToShow.value = pits;
        showMap.value = true;
        console.log(pitsToShow.value);
      };
    }

    const createColumnsManually = ()=>{
      console.log("called");
      
      var pits= []
        for(var i = 0; i < columnEnd.value - columnStart.value ; i++){
            let p = columnStart.value * 1 + i ;
            pits[i]= {p:p ,depth:"", diameter:"", status:'waiting',concreteVolume:""}
        }
        projectPits.value = pits;
        columnsModalManager();
    }

     const pitClick = (clickData: { _id: any; }) => {
        const pitClicked = pitsToShow.value.find((pit: { p: { toString: () => any; }; }) => pit.p.toString() === clickData._id);
        console.log("pitClicked:")
        console.log(pitClicked)
        currentPit.value = pitClicked
        modalManager();
        if (pitClicked == undefined) return;
        
    }

    const saveProject =async ()=>{
      let contactPerson = {name:projectContactPerson.value, phone:contactPersonPhone.value, mail:contactPersonMail.value}
      await createNewProject(organizationID.value,projectName.value, projectAddress.value, projectClient.value ,contactPerson, projectPits.value, projectMachines.value, reports.value)
      router.replace('/projects')
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

    await updateMachineDriller(current_machine.value)
    await updateEmployeeMachine(employee)
    current_employee.value = employee
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
        saveProject,
        addMachine,
        removeMachine,
        addEmployee,
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
        columnStart:columnStart,
        columnEnd: columnEnd,
      
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
</style>