<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content :fullscreen="true" >
 
      <h1> פרטי מכונת קידוח {{ machine?.name }} </h1>
     
      <div>
        <p>סוג מכונה: {{ machine?.name }} </p>
        <p>מספר רישוי: {{ machine?.licens_number }} </p>
        <p>פרוייקט נוכחי:{{project?.name}}</p>
        <p>כתובת: {{project?.address}}</p>
        <h3>צוות קידוח</h3>
        <ion-item :key="driller._id" v-for="driller in machine?.drillers">
          <ion-avatar slot="start">
            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </ion-avatar>
          <ion-label>
               {{driller.first +" "+ driller.last}} 
          </ion-label>
        </ion-item>
      </div>      
    
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
    //IonButton,
    //IonModal,
    //IonButtons,
    //IonHeader,
    //IonToolbar,
   // IonTitle,
   IonAvatar,
   IonLabel,
    IonItem,
    AppHeader
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , getProjectByID,getDrillingMachinesByID, updateMachineDrillers, updateEmployeeMachine, getAllEmployees} = useAppState();
    const machine_id = ref<any>(route.params);
    const machine = ref<any>();
    const {id} = route.params
    const isOpenAddDriller = ref(false)
    const employees = ref<any>()
    const current_employee = ref<any>()
    const showEmp = ref(false)
    const organization = ref<any>()
    const project = ref<any>()
    
  onMounted(async()=>{
    if(user?.value.customData.organizationID === undefined)
          router.push('Login')
    const drillingMachines = await getDrillingMachinesByID()
    machine.value = drillingMachines?.find(proj =>proj._id.toString() === machine_id.value.id)

    const allEmployees= await getAllEmployees();
    employees.value = allEmployees?.filter(emp => emp.organizationID === user.value.customData.organizationID)

    if(machine.value.driller !== undefined){
      current_employee.value = employees?.value.filter((emp: { _id: any; }) => emp._id.toString() === machine.value.driller.driller_id.toString())
      current_employee.value = current_employee.value[0]
      showEmp.value = true
      console.log(current_employee.value);
      
    }

    if(machine.value.project_id !== "" && machine.value.project_id !== undefined  ){
      project.value = await getProjectByID(machine.value.project_id)
      console.log(project.value);
      
    }
    
   
  });

  const addDrillerModalManager = ()=>{

    if (isOpenAddDriller.value)
        isOpenAddDriller.value = false

    else
        isOpenAddDriller.value = true
  }

  const viewEmployee = (employee: any)=>{
    console.log(employee);
    
  }

  const addEmployee = async (employee: any)=>{
    machine.value.driller = {driller_id : employee._id, first: employee.first, last: employee.last}
    console.log(machine.value);
    employee.machine_id = machine.value._id
      
    if(current_employee.value !== undefined){
         current_employee.value.machine_id = ""
         await updateEmployeeMachine(current_employee.value)
        }

    await updateMachineDrillers(machine.value)
    await updateEmployeeMachine(employee)
    current_employee.value = employee
  }

     return {
      //methoods
      addDrillerModalManager,
      viewEmployee,
      addEmployee,
      //properties
        currentUser : user,
        machine:machine,
        machine_id:machine_id,
        id:id,
        isOpenAddDriller:isOpenAddDriller,
        employees:employees,
        current_employee:current_employee,
        showEmp:showEmp,
        organization:organization,
        project,
        
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

</style>