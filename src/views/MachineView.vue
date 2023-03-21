<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content  :fullscreen="true" >
 
      <h1> פרטי מכונת קידוח {{ machine?.name }} </h1>
     
      <div>
        <p>סוג מכונה: {{ machine?.name }} </p>
        <p>מספר רישוי: {{ machine?.licens_number }} </p>
        <p>פרוייקט נוכחי:{{project?.name}}</p>
        <p>כתובת: {{project?.address}}</p>
        
        <h3>צוות קידוח</h3>
        <ion-button slot="end"  @click="changeDrillerModalManager()">{{'הוספת קודח'}}</ion-button>
        <ion-button color="danger"  @click="deleteModalMAnager(true)">{{'מחיקת מכונה'}}</ion-button>
      </div>   
      
      <!--new drilling team list-->
      <div class="hebrewText">
        <ion-item  v-show="employee?._id" :key="employee?._id" v-for="employee in machine?.drillers">
          <ion-avatar slot="start">
            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </ion-avatar>
          <ion-label>
            {{employee.first +" "+ employee.last}} 
       </ion-label>
          <ion-button slot="end" @click="goToEmployee(employee)">{{'פרופיל עובד'}}</ion-button>
          <ion-button color="danger" slot="end" @click="removeDrillerFromMachine(employee)">הסר</ion-button>
          </ion-item>      
      </div>



             <!--change driller in machine modal-->
             <ion-modal :is-open="isOpenDriller">
              <ion-header>
                <ion-toolbar >
                  <ion-title>עריכת צוות קודחים</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click="changeDrillerModalManager()">סגירה</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content  class="ion-padding">
                <div class="hebrewText">
                  <ion-item  :key="employee?._id" v-for="employee in employees">
                    <!-- <p>{{employee?._id}}</p> -->
                    <p>{{employee?.first}} {{employee?.last}}</p>
                    <ion-button slot="end" @click="goToEmployee(employee)">{{'פרופיל עובד'}}</ion-button>
                    <ion-button slot="end" @click="addDrillerToMachine(employee)">בחר</ion-button>
                    </ion-item>      
                </div>
                
              </ion-content>
            </ion-modal>

                 <!--delete machine modal-->
                 <ion-modal :is-open="isOpenDelete">
                  <ion-header>
                    <ion-toolbar >
                      <ion-title>מחיקת מכונת קידוח</ion-title>
                      <ion-buttons slot="end">
                        <ion-button @click="deleteModalMAnager(false)">סגירה</ion-button>
                      </ion-buttons>
                    </ion-toolbar>
                  </ion-header>
                  <ion-content  class="ion-padding">
                    <div class="hebrewText">
                        <p>האם את/ה בטוח שברצונך למחוק מכונה זו?</p>
                        <ion-button slot="end" color="danger" @click="deleteMachine()">{{'מחיקה'}}</ion-button>
                        <ion-button slot="end" @click="deleteModalMAnager(false)">{{'ביטול'}}</ion-button>
                         
                    </div>
                    
                  </ion-content>
                </ion-modal>
    
    </ion-content>

 
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonModal, IonButton, IonButtons,IonHeader,IonToolbar, IonTitle, IonItem,  IonLabel, IonAvatar } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'




export default defineComponent({
  name: 'MachineView',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonModal,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
   IonAvatar,
   IonLabel,
    IonItem,
    AppHeader
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , getProjectByID, updateProjectMachines,deleteMachineFromDB, getDrillingMachineByID,getEmployeesByOrganizationID, updateEmployeeProject, updateMachineDrillers, updateEmployeeMachine,} = useAppState();
    const machine_id = ref<any>(route.params);
    const machine = ref<any>();
    const {id} = route.params
    //const isOpenAddDriller = ref(false)
    const employees = ref<any>()
    const current_employee = ref<any>()
    const showEmp = ref(false)
    const organization = ref<any>()
    const project = ref<any>()
    const isOpenDriller = ref(false)
    const isOpenDelete = ref(false)
    
  onMounted(async()=>{
    if(user?.value.customData.organizationID === undefined)
          router.push('Login')

     machine.value = await getDrillingMachineByID(machine_id.value)


    if(machine.value.project_id !== "" && machine.value.project_id !== undefined  ){
      project.value = await getProjectByID(machine.value.project_id)
      console.log(project.value);
      
    }
    
   
  });

  const removeDrillerFromMachine = async (employee: any)=>{

    let i = machine.value.drillers.indexOf(employee)
    machine.value.drillers.splice(i,1)
    console.log(machine.value.drillers);
    await updateMachineDrillers(machine.value)


    employee.machine_id = ""
    employee.project_id = ""
    //remove current machine id from user data
    await updateEmployeeMachine(employee)
    //remove project id from user data
    await updateEmployeeProject(employee)

  }

  const goToEmployee =(employee:any)=>{
        router.push('/employee/'+ employee._id)
        isOpenDriller.value=false;
    }


    const changeDrillerModalManager = async ()=>{
          if(isOpenDriller.value)
          isOpenDriller.value=false;
          else{
        
            const allEmployees= await getEmployeesByOrganizationID();
            employees.value = allEmployees?.filter(emp => emp.userType === 'driller')
            //filter employees that already assign to this machine
            for (let index = 0; index < machine?.value.drillers.length; index++) {
              let id = machine.value.drillers[index]._id
              employees.value =  employees.value.filter((driller: { _id: any; })=> driller?._id.toString() !== id?.toString())
            }
            

            isOpenDriller.value = true;
          
          }
          
        }

        const addDrillerToMachine = async (employee: any)=>{
        if(machine.value.drillers === undefined){
          machine.value.drillers = []
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

        
        
        
        machine.value.drillers.push(driller)
        await updateMachineDrillers(machine.value)
  
        employee.machine_id = machine.value._id
        employee.project_id = machine.value.project_id
        await updateEmployeeMachine(employee)
        await updateEmployeeProject(employee)
        let index = employees.value.indexOf(employee) 
        employees.value.splice(index,1)
  
        isOpenDriller.value = false
        
  
    }

    const deleteModalMAnager =(state: boolean)=> {
      isOpenDelete.value = state;
    }

    const deleteMachine = async ()=>{
      if(project.value !== undefined && project.value !== null ){
      project.value.machines = project.value.machines.filter((m: { _id: any; })=>m._id.toString() !== machine.value._id.toString())
      console.log(project.value);
      await updateProjectMachines(project.value)
    }

      if(machine.value.drillers !== undefined){
      for (let index = 0; index < machine.value.drillers.length; index++) {
        let employee = machine.value.drillers[index]
        employee.machine_id = ""
        employee.project_id = ""
        await updateEmployeeMachine(employee)
        await updateEmployeeProject(employee)
      }
    }
      console.log(machine.value);
      await deleteMachineFromDB(machine.value)
      deleteModalMAnager(false)
      router.push('/machines/')
      
    }


     return {
      //methoods
      removeDrillerFromMachine,
      goToEmployee,
      changeDrillerModalManager,
      addDrillerToMachine,
      deleteModalMAnager,
      deleteMachine,

      //properties
        currentUser : user,
        machine:machine,
        machine_id:machine_id,
        id:id,
        //isOpenAddDriller:isOpenAddDriller,
        employees:employees,
        current_employee:current_employee,
        showEmp:showEmp,
        organization:organization,
        project,
        isOpenDriller,
        isOpenDelete,
        
  }
  },
 
});
</script>

<style scoped>
  .hebrewText{
    direction: rtl;
    line-height: 80%;
    margin-bottom: 10%;
  }

</style>