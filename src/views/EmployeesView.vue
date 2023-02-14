<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content  :fullscreen="true" >
  
   <div class="homeContainer">
      <!-- <h1>העובדים שלי</h1> -->
      
      <ion-button router-link="/create-employee">יצירת עובד חדש</ion-button>

        
        <ion-item  :key="employee._id" v-for="employee in employees">
          <ion-avatar slot="start">
            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </ion-avatar>
        <p> {{employee.userType ===  'driller' ? ' קודח' : ' מנהל משרד' }} {{" "+ ','}}</p>
        <p> {{" " + employee.first}} {{employee.last + " "}}</p>
        <ion-button slot="end" @click="goToEmployee(employee)">פרופיל עובד</ion-button>
        </ion-item>       
     
      
    </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton, IonItem, IonAvatar } from '@ionic/vue';
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
    IonAvatar,
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

.homeContainer{
  display: block;
  
  padding-top: 2%;
  padding-bottom: 2%;
  height: 100%;
  text-align: center;
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
