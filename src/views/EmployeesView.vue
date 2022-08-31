<template>
  <ion-page>
    <AppHeader/>
    
    <ion-content :fullscreen="true" >
  
   <div class="mainContainer">
      <h1>העובדים שלי</h1>
      
      <ion-button router-link="/create-employee">צור עובד חדש</ion-button>

         <div>
        <ion-item :key="employee._id" v-for="employee in employees">
        <p>{{employee._id}}</p>
        <p>{{employee.first}} {{employee.last}}</p>
        <ion-button @click="goToEmployee(employee)">פרופיל עובד</ion-button>
        </ion-item>       
      </div>
      
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton, IonItem } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'




export default defineComponent({
  name: 'EmployeesView',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItem,
    AppHeader
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout,getAllEmployees} = useAppState();
    const employees = ref<any>()
    const organization = ref<any>()
    
  onMounted(async()=>{
    //add code or delete
    const allEmployees= await getAllEmployees();
    employees.value = allEmployees?.filter(emp => emp.organizationID === user.value.customData.organizationID)
    console.log(employees.value);
    
  });

    
      const goToEmployee =(employee:any)=>{
        router.push('/employee/'+ employee._id)
    }
     return {
        goToEmployee,
        currentUser : user,
        employees:employees,
        organization:organization,
        
  }
  },
 
});
</script>

<style scoped>
.mainContainer{
  display: block;
  direction: rtl;
  
}

</style>
