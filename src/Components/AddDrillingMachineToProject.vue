<template>
    <ion-page>
       <AppHeader :showButtons="true"/>
      
      <ion-content :fullscreen="true" >
  
    
      <!-- <div class="splitScreen">
        <div class="screenTop"> -->
  
  
      <h1> הוספת מכונת קידוח לפרוייקט </h1>
      
      
      <ion-button @click="machinesModalManager">הוספת מכונת קידוח</ion-button>
          
     
  
      <div>
        <h3>מכונות קידוח</h3>
        <IonItem :key="machine?._id" v-for="machine in project?.machines">
            <p>{{machine?.name}}</p>
            <ion-button slot="end" @click="removeMachine(machine)">הסר</ion-button>
        </IonItem>
      </div>
  
  
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
              <!-- <p v-show="machine?.crew">מנהל צוות: {{machine?.crew.manager.first}} {{machine?.crew.manager.last}}</p>
              <p v-show="machine?.crew"> מפעיל: {{machine?.crew.operaitor.first}} {{machine?.crew.operaitor.last}}</p> -->
              <ion-button slot="end"  @click="addMachine(machine)">בחירת מכונה</ion-button>
              <ion-button slot="end"  @click="changeDrillerModalManager(machine)">החלפת קודח</ion-button>
              </ion-item>     
          </div>
          
        </ion-content>
      </ion-modal>
  
       <!--change driller in machine modal-->
       <ion-modal :is-open="isOpenDriller">
        <ion-header>
          <ion-toolbar>
            <ion-title>עריכת צוות קודחים</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="changeDrillerModalManager(null)">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">

            <div class="hebrewText">
                <ion-item :key="employee?._id" v-for="employee in current_machine.drillers">
                  <!-- <p>{{employee?._id}}</p> -->
                  <p>{{employee?.first}} {{employee?.last}}</p>
                  <ion-button slot="end" @click="viewEmployeeModalManager(employee)">פרטי עובד</ion-button>
                  <ion-button slot="end" @click="removeDrillerFromMachine(employee)">הסר</ion-button>
                  </ion-item>      
              </div>

          <div class="hebrewText">
            <ion-item :key="employee?._id" v-for="employee in employees">
              <!-- <p>{{employee?._id}}</p> -->
              <p>{{employee?.first}} {{employee?.last}}</p>
              <ion-button slot="end" @click="viewEmployeeModalManager(employee)">פרטי עובד</ion-button>
              <ion-button slot="end" @click="addDrillerToMachine(employee)">בחר</ion-button>
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
        
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle,IonInput,IonLabel,IonItem, } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from "vue-router";
  import {useAppState} from '../realm-state';

  
  import AppHeader from './AppHeader.vue'
  
  
  
  
  
  export default defineComponent({
    name: 'AddDrillingMachineToProject',
    components: {
      IonContent,
      IonHeader,
      IonPage,
      IonToolbar,
      IonButton,
      IonButtons,
      IonModal,
      IonTitle,
      //IonInput,
      //IonLabel,
      IonItem,
      AppHeader
  },
    setup(){
      const router = useRouter();
      const route = useRoute()
      const project_id = ref<any>(route.params)
      
      const {user ,getProjectByID, getDrillingMachineByID , updateProjectMachines, getDrillingMachinesByID,  updateMachineDrillers, updateEmployeeMachine,updateEmployeeProject, getEmployeesByOrganizationID, updateMachineProjectID} = useAppState();
      const currentUser = ref<any>(user);
      //const file = ref<any>(File);
      //const arrayBuffer = ref<any>(null);
      //const filelist = ref<any>(null);
      //const arraylist = ref<any>();
      //const pitsToShow = ref<any>([]);
      //const showMap = ref(false);
      //const isOpen = ref(false);
      const isOpenDriller = ref(false);
      const isOpenMachine = ref(false);
      const isOpeColumn = ref(false);
      //const currentPit = ref<any>();
      const project = ref<any>();
      //const projectAddress = ref("");
      //const projectClient = ref("");
      //const projectContactPerson = ref("");
      //const contactPersonPhone = ref("");
      //const contactPersonMail = ref("");
      //const projectPits = ref<any>();
      //const reports = ref<any>([])
      //const organizationID = ref<any>();
      const drillingMachines = ref<any>()
      const current_machine = ref<any>()
      const employees = ref<any>()
      const current_employee = ref<any>() 
      const isOpenEmp= ref(false)
      const projectMachines = ref<any>([])
      //const columnStart = ref(0)
      //const columnEnd = ref(0)
  
    onMounted(async()=>{
     // organizationID.value = user.value.customData.organizationID
      project.value = await getProjectByID(project_id.value)
      console.log(project.value);
      

      drillingMachines.value = await getDrillingMachinesByID();
      console.log(drillingMachines.value);
      
      const allEmployees= await getEmployeesByOrganizationID();
      employees.value = allEmployees?.filter(emp => emp.userType === 'driller')
      console.log(employees.value);
      
      
    });
 
  
    
  
  
  
         //modal block
    
        
        const changeDrillerModalManager = async (machine: any)=>{
          if(isOpenDriller.value)
          isOpenDriller.value=false;
          else{
            current_machine.value = machine

            const allEmployees= await getEmployeesByOrganizationID();
            employees.value = allEmployees?.filter(emp => emp.userType === 'driller')
            for (let index = 0; index < current_machine.value.drillers.length; index++) {
              let id = current_machine.value.drillers[index]._id
              employees.value =  employees.value.filter((driller: { _id: any; })=> driller._id.toString() !== id.toString())
            }
            

            isOpenDriller.value = true;
            // if(machine?.value.drillers !== undefined){
            //     current_employee.value = employees?.value.filter((emp: { _id: any; }) => emp._id.toString() === machine?.value.driller.driller_id.toString())
            //     current_employee.value = current_employee.value[0]
            //     console.log(current_employee.value);
            //   }
          }
          
        }
  
        const machinesModalManager = ()=>{
          if(isOpenMachine.value)
          isOpenMachine.value=false;
          else
          isOpenMachine.value = true;
        }
  
     
  
        const viewEmployeeModalManager = (employee: any)=>{
          if(isOpenEmp.value)
          isOpenEmp.value=false;
          else{
            current_employee.value = employee
            isOpenEmp.value = true;
           
          }
          
        }
  
        const addMachine = async (machine: any)=>{
          if(project.value.machines === undefined || project.value.machines === null)
          project.value.machines = []

          let check = project?.value.machines.find((m: { _id: any; })=> m._id === machine._id)
          if(check !== undefined){
            return
          }

          let tempMachine = {_id:machine._id, name:machine.name , licens_number:machine.licens_number }
          //check if the current machine is in another project
          if(machine.project_id !== "" && machine.project_id !== undefined){
            let prevProject = await getProjectByID(machine.project_id )
            let index = prevProject.machines.indexOf(tempMachine)
            prevProject.machines.splice(index,1)
            await updateProjectMachines(prevProject)
          }
            
          
          project.value.machines.push(tempMachine)
          await updateProjectMachines(project.value)
          machine.project_id = project.value._id
          await updateMachineProjectID(machine)
          await updateDrillersProjectID(machine)
          machinesModalManager()
          
        }
  
        const removeMachine = async (machine:any)=>{
          let i = project.value.machines.indexOf(machine)
          project.value.machines.splice(i,1)
          console.log(project.value.machines);
          await updateProjectMachines(project.value) 
          machine.project_id = ""
          await updateMachineProjectID(machine)
          await updateDrillersProjectID(machine)
          //machinesModalManager()
          
  }
  
  
    const addDrillerToMachine = async (employee: any)=>{
        if(current_machine.value.drillers === undefined){
          current_machine.value.drillers = []
        }

        let driller = {first: employee.first, last: employee.last, _id: employee._id}
        console.log(driller);

        //check if driller is assigned to another drilling machine
        if(employee.machine_id !== "" &&  employee.machine_id !== undefined){
          let prevMachine = await getDrillingMachineByID(employee.machine_id)
          let index = prevMachine.drillers.indexOf(driller)
          prevMachine.drillers.splice(index,1)
          await updateMachineDrillers(prevMachine)
        }

        
        
        
        current_machine.value.drillers.push(driller)
        await updateMachineDrillers(current_machine.value)
  
        employee.machine_id = current_machine.value._id
        employee.project_id = project.value._id
        await updateEmployeeMachine(employee)
        await updateEmployeeProject(employee)
        let index = employees.value.indexOf(employee) 
        employees.value.splice(index,1)
  
        //changeDrillerModalManager(null)
        
  
    }

    const removeDrillerFromMachine = async (employee: any)=>{

          let i = current_machine.value.drillers.indexOf(employee)
          current_machine.value.drillers.splice(i,1)
          console.log(current_machine.value.drillers);
          await updateMachineDrillers(current_machine.value)
  

        employee.machine_id = ""
        employee.project_id = ""
        await updateEmployeeMachine(employee)
        await updateEmployeeProject(employee)
  
        //changeDrillerModalManager(null)
        
  
    }

    const updateDrillersProjectID = async (machine: any)=>{
        console.log('updateDrillersProjectID');
        
        console.log(machine);

         let realMachine = await getDrillingMachineByID(machine._id)
        
        for (let index = 0; index < realMachine.drillers.length; index++) {
            let driller = realMachine.drillers[index]
            driller.project_id =  machine.project_id
            console.log(driller);
            
            await updateEmployeeProject(driller)
            
        }
    }
  
        
       return {
          //methoods
         
          changeDrillerModalManager,
          machinesModalManager,
          viewEmployeeModalManager,
      
          addMachine,
          removeMachine,
      
          addDrillerToMachine,
          removeDrillerFromMachine,
          updateDrillersProjectID,
      
         //properties
          currentUser,
          project,
          //file : file,
          //arrayBuffer :arrayBuffer,
          //filelist:filelist,
          //arraylist :arraylist,
          //pitsToShow :pitsToShow,
          //showMap:showMap,
          //isOpen:isOpen,
          isOpenDriller:isOpenDriller,
          isOpeColumn:isOpeColumn,
          isOpenMachine:isOpenMachine,
          //currentPit:currentPit,
          //projectName: projectName,
          //projectAddress: projectAddress,
          //projectClient:projectClient,
          //projectContactPerson:projectContactPerson,
          //contactPersonPhone:contactPersonPhone,
          //contactPersonMail:contactPersonMail,
          //projectPits:projectPits,
          //reports:reports,
          //organizationID:organizationID,
          drillingMachines:drillingMachines,
          current_machine:current_machine,
          employees:employees,
          current_employee:current_employee,
          isOpenEmp:isOpenEmp,
          projectMachines:projectMachines,
          //columnStart:columnStart,
          //columnEnd: columnEnd,
        
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