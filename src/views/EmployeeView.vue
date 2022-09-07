<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content :fullscreen="true" >
  
   
      <h1>פרופיל עובד</h1>

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{employee?.userType}}</ion-card-subtitle>
          <ion-card-title>{{employee?.first}} {{employee?.last}}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <IonButton color="danger"
            @click="deleteEmoloyee" >מחיקת עובד
            <IonIcon slot="end" :icon="trash" />
          </IonButton>
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonIcon } from '@ionic/vue';
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
    IonButton,
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
    IonIcon,
    AppHeader
  },
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout,getAllEmployees,deleteEmployeeFromDB } = useAppState();
    const employee_id = ref<any>(route.params);
    const employee = ref<any>();
    const {id} = route.params
    const organization = ref<any>()
    const employees = ref<any>()

  onMounted(async()=>{
    //add code or delete
    const allEmployees= await getAllEmployees();
    employee.value = allEmployees?.find((emp: { _id: { toString: () => any; }; }) =>emp._id.toString() === employee_id.value.id)
    console.log(employee.value);
   
   
  });
  const deleteEmoloyee = ()=>{
    console.log(employee_id.value);
    deleteEmployeeFromDB() 
    
  }


   
     return {
        //methoods
        deleteEmoloyee,
        //properties
        currentUser : user,
        employee:employee,
        employee_id:employee_id,
        id:id,
        organization:organization,
        employees:employees,
        //icons properties
        trash,
        
  }
  },
 
});
</script>

<style scoped>

</style>