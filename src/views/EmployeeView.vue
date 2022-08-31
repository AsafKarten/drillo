<template>
  <ion-page>
    <AppHeader/>
    
    <ion-content :fullscreen="true" >
  
   
      <h1>פרופיל עובד</h1>
      <div>

        <p>{{employee?.first}} {{employee?.last}}</p>
        <p>{{employee?.userType}}</p>
        <p>{{employee?.organizationID}}</p>
        <p>{{employee_id}}</p>
        
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'




export default defineComponent({
  name: 'EmployeeView',
  components: {
    IonContent,
    IonPage,
  },
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout,getAllEmployees} = useAppState();
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


   
     return {
        currentUser : user,
        employee:employee,
        employee_id:employee_id,
        id:id,
        organization:organization,
        employees:employees,
        
  }
  },
 
});
</script>

<style scoped>

</style>