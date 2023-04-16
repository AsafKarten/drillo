<template>
  <ion-page>
    <ion-content  :fullscreen="true" >

      <OfficeAppHeader :str="'ניהול פרוייקט'"/>
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
<ion-item>
  <ion-label position="floating">מחיר למטר</ion-label>
  <ion-input
    v-model="price"
    type="number"
  ></ion-input>
</ion-item>
<ion-button expand="block" @click='generateRegularReport'>יצירת דו"ח לפי תאריך</ion-button>
<ion-button expand="block" @click='getFullReport'>יצירת דו"ח לכל הפרוייקט</ion-button>
<ion-button expand="block" @click='generatePaymentReport'>יצירת דו"ח תשלום לפי תאריך</ion-button>

        <!--regular riport table-->
  <table id="my-table-id" v-show="regularReport" >
    <tr>
      <th>רשימה</th>
      <th>מספר בור קידוח</th>
      <th>עומק</th>
      <th>קוטר</th>
      <th>נפח בטון תיאורטי</th>
      <th>מחיר</th>
      <th>תאריך ביצוע</th>
    </tr>
    <tr :key="pit?._id" v-for="pit in pits">
      <td>{{pit.listName}}</td>
      <td>{{pit.p}}</td>
      <td>{{pit.depth}}</td>
      <td>{{pit.diameter}}</td>
      <td>{{pit.concreteVolume}}</td>
      <td>{{(pit.depth * price)}}</td>
      <td>{{pit.finishDate.getDate() + '/' + (pit.finishDate.getMonth() * 1 + 1) + '/' + pit.finishDate.getFullYear()}}</td>
    </tr>
  </table>

        <!--payment riport table-->
        <table id="payment-table-id" v-show="paymentReport" >
       
          <thead>
            <tr>
               <th colspan="10" style="text-align: center;" >{{'חשבון לחודש'+' '+month + ' ' + 'עבור קידוח כלונסאות' + ' ' + project?.name + ' ' + project?.address}}</th>
            </tr>
            <tr>
            <th colspan="1">מס' רץ</th>
            <th style="text-align: center;" colspan="7">תאור</th>
            <th colspan="1"></th>
            <th colspan="1"></th>
            </tr>
            
         </thead>
          
          <tr>
            <th>#</th>
            <th>תאריך</th>
            <th>יום</th>
            <th>מס' כלונס</th>
            <th>קוטר</th>
            <th>עומק</th>
            <th>כמות</th>
            <th>מטר אורך</th>
            <th colspan="1">מחיר יחידה</th>
            <th colspan="1">סה"כ</th>
          </tr>
          <tr :key="pit?._id" v-for="pit in pits">
            <td>{{pit.listName}}</td>
            <td>{{pit.p}}</td>
            <td>{{pit.depth}}</td>
            <td>{{pit.diameter}}</td>
            <td>{{pit.concreteVolume}}</td>
            <td>{{(pit.depth * price)}}</td>
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
import OfficeAppHeader from '../Components/OfficeAppHeader.vue'

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
    //IonModal,
    //IonHeader,
    //IonToolbar,
    //IonTitle,
    //IonButtons,
    OfficeAppHeader,

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
    const price = ref(0)
    const allPits = ref<any>([]);
    const pits = ref<any>();
    const regularReport = ref(false)
    const paymentReport = ref(false)
    const isOpenMonth = ref(false)
    const month = ref()
    
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
    
    const generateRegularReport=()=>{
      sortPits()
      paymentReport.value = false
      regularReport.value = true
    }

    const generatePaymentReport =()=>{
      sortPits()
      let dateVar = new Date(startDate.value)
      month.value ="" + (dateVar.getUTCMonth()*1+1) + "/" + dateVar.getFullYear()
      regularReport.value = false
      paymentReport.value = true
      
    }

    const sortPits = () => {
      let start = new Date(startDate.value)
      let end = new Date(endDate.value)
      console.log(start);
      console.log(end);
    
      
      pits.value = allPits.value.filter((pit: { finishDate: Date; status: string; })=> pit.finishDate?.valueOf() >= start.setHours(0, 0, 0, 0).valueOf() && pit.finishDate?.valueOf() <= end.setHours(23, 60, 60, 0).valueOf() && pit.status == 'Done' )
      pits.value.sort((pit1: { finishDate: Date; }, pit2: { finishDate: Date; })=>pit1.finishDate.valueOf() - pit2.finishDate.valueOf() )
      console.log(pits.value);
      
      
    }

    const getFullReport = () =>{
      pits.value = allPits.value.filter((pit: { status: string; })=> pit.status == 'Done')
      pits.value.sort((pit1: { finishDate: Date; }, pit2: { finishDate: Date; })=>pit1.finishDate.valueOf() - pit2.finishDate.valueOf() )
      paymentReport.value = false
      regularReport.value = true
    }

 



    const createXl = () => {
      let table = ''
      if(pits.value == null || pits.value.length == 0){
        alert('לא ניתן ליצר דו"ח ריק') 
        return
      }
      if(regularReport.value)
        table = "my-table-id"
      if(paymentReport.value)
        table = "payment-table-id"

      console.log("createXl");
      // Acquire Data (reference to the HTML table)
      var table_elt = document.getElementById(table);

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

    const openChooseMonth = ()=>{

      if(isOpenMonth.value)
          isOpenMonth.value = false

      else
        isOpenMonth.value = true
    }

    return {
      createXl,
      generateRegularReport,
      generatePaymentReport,
      sortPits,
      getFullReport,
      openChooseMonth,

      currentUser,
      project_id,
      project,
      allPits,
      pits,
      startDate,
      endDate,
      price,
      regularReport,
      paymentReport,
      isOpenMonth,
      month,
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