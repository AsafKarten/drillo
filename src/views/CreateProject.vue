<template>
  <ion-page>
     <AppHeader :showButtons="true"/>
    
    <ion-content  :fullscreen="true" >

  
    <!-- <div class="splitScreen">
      <div class="screenTop"> -->


    <h1 id="title">יצירת פרוייקט חדש</h1>
    <div class="container">
      <h1 id="title">פרטים</h1>
     <ion-item >
          <ion-label position="floating">שם הפרוייקט</ion-label>
          <ion-input
            v-model="projectName"
            type="text"
          ></ion-input>
      </ion-item>
      <ion-item >
          <ion-label position="floating">כתובת</ion-label>
          <ion-input
            v-model="projectAddress"
            type="text"
          ></ion-input>
      </ion-item>
      <ion-item >
        <ion-label position="floating">שם המזמין</ion-label>
        <ion-input
          v-model="projectClient"
          type="text"
        ></ion-input>
    </ion-item>
    <ion-item >
      <ion-label position="floating">שם איש קשר/מנהל עבודה</ion-label>
      <ion-input
        v-model="projectContactPerson"
        type="text"
      ></ion-input>
  </ion-item>
  <ion-item >
    <ion-label position="floating">טלפון איש קשר</ion-label>
    <ion-input
      v-model="contactPersonPhone"
      type="tel"
    ></ion-input>
</ion-item>
<ion-item >
  <ion-label position="floating">מייל איש קשר</ion-label>
  <ion-input
    v-model="contactPersonMail"
    type="text"
  ></ion-input>
</ion-item>
<div class="center">
  <ion-button @click="saveProject">{{'שמירת פרוייקט ומעבר להוספת כלונסים'}}</ion-button>
</div>
</div>

<ion-alert
:is-open="isOpenAlert"
header="שגיאה"
sub-header="אנא מלא\י את כל השדות"
message="יש למלא את כל השדות ורק לאחר מכן לשמור את הפרוייקט החדש"
:buttons="['OK']"
@didDismiss="setOpen(false)"
></ion-alert>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle,IonInput,IonLabel,IonItem,IonAlert } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';
import MapBox from'../views/MapBox.vue';
//imports 
import * as XLSX from "xlsx";
import proj4 from 'proj4'

import AppHeader from '../Components/AppHeader.vue'





export default defineComponent({
  name: 'SecondExcelComponent',
  components: {
    IonContent,
   
    IonPage,
 
    IonButton,
  
  
   
    IonInput,
    IonLabel,
    IonItem,
    IonAlert,
    AppHeader
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>();
    const {user , createNewProject} = useAppState();
    const file = ref<any>(File);
    const arrayBuffer = ref<any>(null);
    const filelist = ref<any>(null);
    const arraylist = ref<any>();
    const pitsToShow = ref<any>([]);
    const showMap = ref(false);
    const isOpen = ref(false);
    const isOpenDriller = ref(false);
    const isOpenMachine = ref(false);
    const isOpeColumn = ref(false);
    const currentPit = ref<any>();
    const projectName = ref("");
    const projectAddress = ref("");
    const projectClient = ref("");
    const projectContactPerson = ref("");
    const contactPersonPhone = ref("");
    const contactPersonMail = ref("");
    const projectPits = ref<any>();
    const reports = ref<any>([])
    const organizationID = ref();
    const drillingMachines = ref<any>()
    const current_machine = ref<any>()
    const employees = ref<any>()
    const current_employee = ref<any>() 
    const isOpenEmp= ref(false)
    const projectMachines = ref<any>([])
    const columnStart = ref(0)
    const columnEnd = ref(0)
    const project_id= ref<any>()
    const isOpenAlert = ref(false)

    const setOpen = (state: boolean) => (isOpenAlert.value = state);

  onMounted(async()=>{
    organizationID.value = user.value.customData.organizationID

  });


    const saveProject =async ()=>{
      if(projectName.value === "" || projectAddress.value === "" || projectClient.value === "" || projectAddress.value === "" || projectContactPerson.value === "" || contactPersonPhone.value === "" ||contactPersonMail.value === "" ){
        setOpen(true)
        return
      }
      let contactPerson = {name:projectContactPerson.value, phone:contactPersonPhone.value, mail:contactPersonMail.value}
      let project_id = await createNewProject(projectName.value, projectAddress.value, projectClient.value ,contactPerson)
      clearForm()
      router.push('/add-columns/'+ project_id)
    }

    const clearForm = ()=>{
      projectName.value = ""
      projectAddress.value = ""
      projectClient.value = ""
      projectAddress.value = ""
      projectContactPerson.value = "" 
      contactPersonPhone.value = ""
      contactPersonMail.value = ""
    }

     return {
        //methoods
        saveProject,
        setOpen,
        clearForm,
       //properties
        currentUser : user,
        file : file,
        arrayBuffer :arrayBuffer,
        filelist:filelist,
        arraylist :arraylist,
        pitsToShow :pitsToShow,
        showMap:showMap,
        isOpen:isOpen,
        isOpenDriller:isOpenDriller,
        isOpeColumn:isOpeColumn,
        isOpenMachine:isOpenMachine,
        currentPit:currentPit,
        projectName: projectName,
        projectAddress: projectAddress,
        projectClient:projectClient,
        projectContactPerson:projectContactPerson,
        contactPersonPhone:contactPersonPhone,
        contactPersonMail:contactPersonMail,
        projectPits:projectPits,
        reports:reports,
        organizationID:organizationID,
        drillingMachines:drillingMachines,
        current_machine:current_machine,
        employees:employees,
        current_employee:current_employee,
        isOpenEmp:isOpenEmp,
        projectMachines:projectMachines,
        columnStart:columnStart,
        columnEnd: columnEnd,
        project_id,
        isOpenAlert,
      
  }
  },
 
});
</script>

<style scoped>
#title{
  text-align: center;
  color: #4DBA87;
  font-size: 30px;
  font-weight: bolder;
}
.container {
  border: #4DBA87 2px solid;
  border-radius: 10px;
  text-align: center;
  padding: 2%;
  margin: 2%;
}
.containerPits{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
 
}
.center{
  text-align: center;
padding-bottom: 2%;

}
.hebrewText{
  direction: rtl;
  line-height: 80%;
  overflow: scroll;
  margin-bottom: 10%;
}

.splitScreen {
  width: 100%;
  height: 100%;
}
.screenTop, .screenBottom {
  width: 100%;
  height: 50%;
}
.screenTop {
  overflow-y: scroll;
}
.screenBottom {
  display: flex;
}

h5,h6{
  font-weight: bold;
}

.coords {
  font-family: monospace;
  font-size: 150%;
  letter-spacing: 1px;
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