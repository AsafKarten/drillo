<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content :fullscreen="true" >
 
      <h1> פרטי מכונת קידוח {{ machine?.name }} </h1>
     
      <div>
        <p>name: {{ machine?.name }} </p>
        <p>type: {{ machine?.type }} </p>
        <p>id: {{ machine_id.id }} </p>
        
    </div>
      <ion-button @click="addDrillerModalManager">הוספת קודח</ion-button>
    
    </ion-content>

    <ion-modal :is-open="isOpenAddDriller">
      <ion-header>
        <ion-toolbar>
          <ion-title>שיוך קודח למכונת קידוח</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="addDrillerModalManager">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
          <div>
            <ion-item :key="employee._id" v-for="employee in employees">
            <p>{{employee._id}}</p>
            <p>{{employee.first}} {{employee.last}}</p>
            <ion-button @click="viewEmployee(employee)">פרטי עובד</ion-button>
            <ion-button @click="addEmployee(employee)">בחר</ion-button>
            </ion-item>       
          </div>
        
      
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonModal, IonButton } from '@ionic/vue';
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
    AppHeader
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout,getAllDrillingMachines, getAllEmployees} = useAppState();
    const machine_id = ref<any>(route.params);
    const machine = ref<any>();
    const {id} = route.params
    const isOpenAddDriller = ref(false)
    const employees = ref<any>()
    const organization = ref<any>()
    
  onMounted(async()=>{
    const drillingMachines = await getAllDrillingMachines()
    machine.value = drillingMachines?.find(proj =>proj._id.toString() === machine_id.value.id)

    const allEmployees= await getAllEmployees();
    employees.value = allEmployees?.filter(emp => emp.organizationID === user.value.customData.organizationID)
    
   
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

  const addEmployee = (employee: any)=>{
    console.log(employee);
    
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
        organization:organization,
        
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