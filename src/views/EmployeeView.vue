<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content color="dark" :fullscreen="true" >
  
   <div class="homeContainer">
      <h1>פרופיל עובד</h1>

      <ion-card color="dark">
        <ion-card-header>
          <ion-card-subtitle>{{employee?.userType === 'driller' ? 'קודח' : 'מנהל משרד'}}</ion-card-subtitle>
          <ion-card-title>{{employee?.first}} {{employee?.last}}</ion-card-title>   
        </ion-card-header>

        <ion-card-content>
          <ion-item color="dark" v-show="project"> <p>{{'פרוייקט:'+' '+project?.name + ", " + project?.address}}</p></ion-item>
          <ion-item color="dark" v-show="machine" > <p>{{'מכונת קידוח:'+' '+ machine?.name}}</p></ion-item>
        </ion-card-content>
      </ion-card>
</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonIcon ,IonItem } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { trash } from 'ionicons/icons';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'




export default defineComponent({
  name: 'EmployeeView',
  components: {
    IonContent,
    IonPage,
    //IonButton,
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
    //IonIcon,
    IonItem,
    AppHeader
  },
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout,getAllEmployees,getProjectByID, getDrillingMachineByID } = useAppState();
    const employee_id = ref<any>(route.params);
    const employee = ref<any>();
    const {id} = route.params
    const organization = ref<any>()
    const employees = ref<any>()
      const project = ref<any>()
        const machine = ref<any>()

  onMounted(async()=>{
    if(user?.value.customData.organizationID === undefined)
          router.push('Login')
          
    const allEmployees= await getAllEmployees();
    employee.value = allEmployees?.find((emp: { _id: { toString: () => any; }; }) =>emp._id.toString() === employee_id.value.id)
    console.log(employee.value);
    if(employee.value.project_id !== "" && employee.value.project_id !== undefined){
        project.value = await getProjectByID(employee.value.project_id)
      console.log(project.value);
    }
    if(employee.value.machine_id !== "" && employee.value.machine_id !== undefined){
      machine.value = await getDrillingMachineByID(employee.value.machine_id)
      console.log(machine.value);
    }
    
    
   
   
  });
  // const deleteEmoloyee = ()=>{
  //   console.log(employee_id.value);
  //   deleteEmployeeFromDB() 
    
  // }


   
     return {
        //methoods
    
        //properties
        currentUser : user,
        employee:employee,
        employee_id:employee_id,
        id:id,
        organization:organization,
        employees:employees,
        project,
        machine,
        //icons properties
        trash,
        
  }
  },
 
});
</script>

<style scoped>

.homeContainer{
  display: block;
  background-color: black;
  padding-top: 2%;
  padding-bottom: 2%;
  height: 100%;
  text-align: center;
}

</style>