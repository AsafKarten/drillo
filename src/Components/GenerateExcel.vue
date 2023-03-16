<template>
  <ion-page>
    <ion-content  :fullscreen="true" >

      <AppHeader :str="'ניהול פרוייקט'"/>
  <ion-item>
    <ion-label position="floating">תאריך התחלה</ion-label>
    <ion-input
      v-model="startDate"
      type="date"
    ></ion-input>
</ion-item>
<ion-item>
  <ion-label position="floating">תאריך סיום</ion-label>
  <ion-input
    v-model="endDate"
    type="date"
  ></ion-input>
</ion-item>
<ion-button expand="block" @click='sortPits'>יצירת דו"ח לפי תאריך</ion-button>
<ion-button expand="block" @click='getFullReport'>יצירת דו"ח לכל הפרוייקט</ion-button>
  <table id="my-table-id" v-show="pits">
    <tr>
      <th>רשימה</th>
      <th>מספר בור קידוח</th>
      <th>עומק</th>
      <th>קוטר</th>
      <th>נפח בטון תיאורטי</th>
      <th>תאריך ביצוע</th>
    </tr>
    <tr :key="pit?._id" v-for="pit in pits">
      <td>{{pit.listName}}</td>
      <td>{{pit.p}}</td>
      <td>{{pit.depth}}</td>
      <td>{{pit.diameter}}</td>
      <td>{{pit.concreteVolume}}</td>
      <td>{{pit.finishDate.getDate() + '/' + (pit.finishDate.getMonth() * 1 + 1) + '/' + pit.finishDate.getFullYear()}}</td>
    </tr>
  </table>
  <IonButton expand="block" @click="createXl">שמירת דו"ח</IonButton>
    </ion-content>
    </ion-page>
</template>
  
<script lang="ts">
import { onIonViewWillEnter,onIonViewDidLeave, IonContent, IonHeader, IonPage, IonToolbar, IonButton, IonButtons, IonModal, IonTitle, IonInput, IonLabel, IonItem, IonLoading} from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppState } from '../realm-state';
import AppHeader from '../Components/AppHeader.vue'

//imports 
import * as XLSX from "xlsx";






export default defineComponent({
  name: 'GenerateExcel',
  components: {
    IonPage,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    AppHeader,

  },
  setup() {
    const router = useRouter();
    const route = useRoute()
    const { user,getProjectPits, getProjectByID} = useAppState(); 
    const currentUser = ref<any>(user);
    const project_id = ref<any>(route.params)
    const project = ref<any>()
    const startDate = ref<Date>(new Date())
    const endDate =ref<Date>(new Date())
    const allPits = ref<any>([]);
    const pits = ref<any>();
    
    onIonViewWillEnter(async()=>{
      allPits.value = await getProjectPits(project_id.value)
      console.log(allPits.value);
      project.value = await getProjectByID(project_id.value)
      console.log(project.value);
      
      
    });

    onIonViewDidLeave(()=>{
       //project_id.value = null
       project.value = null
       allPits.value = null
      // // startDate.value = new Date()
      // // endDate.value = new Date()
       pits.value = null
    })

    const sortPits = () => {
      let start = new Date(startDate.value)
      let end = new Date(endDate.value)
      console.log(start);
      console.log(end);
    
      
      pits.value = allPits.value.filter((pit: { finishDate: Date; status: string; })=> pit.finishDate?.valueOf() >= start.setHours(0, 0, 0, 0).valueOf() && pit.finishDate?.valueOf() <= end.setHours(0, 0, 0, 0).valueOf() && pit.status == 'Done' )
      pits.value.sort((pit1: { finishDate: Date; }, pit2: { finishDate: Date; })=>pit1.finishDate.valueOf() - pit2.finishDate.valueOf() )
      console.log(pits.value);
      
    }

    const getFullReport = () =>{
      pits.value = allPits.value.filter((pit: { status: string; })=> pit.status == 'Done')
      pits.value.sort((pit1: { finishDate: Date; }, pit2: { finishDate: Date; })=>pit1.finishDate.valueOf() - pit2.finishDate.valueOf() )
    }

    const createXl = () => {
      if(pits.value == null || pits.value.length == 0){
        alert('לא ניתן ליצר דו"ח ריק') 
        return
      }
      console.log("createXl");
      // Acquire Data (reference to the HTML table)
      var table_elt = document.getElementById("my-table-id");

      // Extract Data (create a workbook object from the table)
      var workbook = XLSX.utils.table_to_book(table_elt);
      // Process Data (add a new row)
      var ws = workbook.Sheets["Sheet1"];
      XLSX.utils.sheet_add_aoa(ws, [["Created " + new Date().toISOString()]], { origin: -1 });
      let date = new Date()
      let today = date.getDate() + '/' + (date.getMonth() * 1 + 1) + '/' + date.getFullYear()
      let fileName = ""+ project.value.name +"_"+ today + ".xlsb"
      // Package and Release Data (`writeFile` tries to write and save an XLSB file)
      XLSX.writeFile(workbook, fileName);

    }

    return {
      createXl,
      sortPits,
      getFullReport,

      currentUser,
      project_id,
      project,
      allPits,
      pits,
      startDate,
      endDate
    }
  },

});
</script>
  
<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
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