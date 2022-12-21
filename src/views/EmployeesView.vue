<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content :fullscreen="true" >
  
   <div class="mainContainer">
      <h1>העובדים שלי</h1>
      
      <ion-button router-link="/create-employee">צור עובד חדש</ion-button>

         <div>
        <ion-item :key="employee._id" v-for="employee in employees">
        <p> {{employee.userType ===  'driller' ? ' קודח' : ' מנהל משרד' }} {{" "+ ','}}</p>
        <p> {{" " + employee.first}} {{employee.last + " "}}</p>
        <ion-button slot="end" @click="goToEmployee(employee)">פרופיל עובד</ion-button>
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
    
    const {user , logout,getEmployeesByOrganizationID} = useAppState();
    const currentUser = ref<any>(user)
    const employees = ref<any>()
    const organization = ref<any>()
    
  onMounted(async()=>{
    if(user?.value.customData.organizationID === undefined)
          router.push('Login')
          
    const allEmployees= await getEmployeesByOrganizationID();
    employees.value = allEmployees?.filter(emp => emp.userID !== currentUser?.value.customData.userID)
    console.log(allEmployees);
    
  });

    
      const goToEmployee =(employee:any)=>{
        router.push('/employee/'+ employee._id)
    }
     return {
      //methods
        goToEmployee,
        //properties
        currentUser : currentUser,
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
