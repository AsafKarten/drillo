<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content  :fullscreen="true" >
  
   <div class="homeContainer">
      <h1>פרופיל עובד</h1>

      <ion-card >
        <ion-card-header>
          <ion-card-subtitle>{{employee?.userType === 'driller' ? 'קודח' : 'מנהל משרד'}}</ion-card-subtitle>
          <ion-card-title>{{employee?.first}} {{employee?.last}}</ion-card-title>   
          <ion-button color="danger"  @click="deleteModalMAnager(true)">{{'מחיקת עובד'}}</ion-button>
        </ion-card-header>

        <ion-card-content>
          <ion-item  v-show="project"> <p>{{'פרוייקט:'+' '+project?.name + ", " + project?.address}}</p></ion-item>
          <ion-item  v-show="machine" > <p>{{'מכונת קידוח:'+' '+ machine?.name}}</p></ion-item>
        </ion-card-content>
      </ion-card>
</div>

        <!--delete machine modal-->
        <ion-modal :is-open="isOpenDelete">
          <ion-header>
            <ion-toolbar >
              <ion-title>מחיקת עובד</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="deleteModalMAnager(false)">סגירה</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content  class="ion-padding">
            <div class="hebrewText">
                <p>האם את/ה בטוח שברצונך למחוק עובד זו?</p>
                <ion-button slot="end" color="danger" @click="deleteEmoloyee()">{{'מחיקה'}}</ion-button>
                <ion-button slot="end" @click="deleteModalMAnager(false)">{{'ביטול'}}</ion-button>
                 
            </div>
            
          </ion-content>
        </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { onIonViewDidEnter ,IonContent, IonPage,IonButton,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonIcon ,IonTitle,IonItem,IonToolbar, IonModal,IonButtons,IonHeader, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { trash } from 'ionicons/icons';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/OfficeAppHeader.vue'




export default defineComponent({
  name: 'EmployeeView',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonModal,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
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
    const {user , logout, updateMachineDrillers ,deleteEmployeeFromOrganization,getAllEmployees,getProjectByID, getDrillingMachineByID } = useAppState();
    const employee_id = ref<any>(route.params);
    const employee = ref<any>();
    const {id} = route.params
    const organization = ref<any>()
    const employees = ref<any>()
    const project = ref<any>()
    const machine = ref<any>()
    const isOpenDelete = ref(false)

    onIonViewDidEnter(async()=>{
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
  const deleteEmoloyee = async ()=>{
    console.log(employee_id.value);
    if(employee.value.machine_id !== "" && employee.value.machine_id !== undefined && employee.value.machine_id !== null ){
      let machine = await getDrillingMachineByID(employee.value.machine_id)
      machine.drillers = machine.drillers.filter((d: { _id: any; }) => d._id.toString() !== employee.value._id.toString() )
      console.log(machine.drillers);
      await updateMachineDrillers(machine)
      
    }
    await deleteEmployeeFromOrganization(employee.value)
    deleteModalMAnager(false)
    router.push('/employees')
    
  }

  const deleteModalMAnager =(state: boolean)=> {
      isOpenDelete.value = state;
    }




   
     return {
        //methoods
        deleteEmoloyee,
        deleteModalMAnager,

        //properties
        currentUser : user,
        employee:employee,
        employee_id:employee_id,
        id:id,
        organization:organization,
        employees:employees,
        project,
        machine,
        isOpenDelete,
        //icons properties
        trash,
        
  }
  },
 
});
</script>

<style scoped>

.homeContainer{
  display: block;
  padding-top: 2%;
  padding-bottom: 2%;
  height: 100%;
  text-align: center;
}

</style>