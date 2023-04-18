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
       
          <thead  >
            <tr >
               <th colspan="14" style="text-align: center;" >{{'חשבון לחודש'+' '+month + ' ' + 'עבור קידוח כלונסאות' + ' ' + project?.name + ' ' + project?.address}}</th>
            </tr>
            <tr>
            <th colspan="1">מס' רץ</th>
            <th style="text-align: center;" colspan="11">תאור</th>
            <th colspan="1" rowspan="2">מחיר יחידה</th>
            <th colspan="1" rowspan="2" >סה"כ</th>
            </tr>
            
         
          
          <tr>
            <th>#</th>
            <th colspan="2">תאריך</th>
            <th colspan="2">יום</th>
            <th colspan="2">מס' כלונס</th>
            <th>קוטר</th>
            <th>עומק</th>
            <th>כמות</th>
            <th>מטר אורך</th>
            
          </tr>
        </thead>
     
          <tr :key="day?.number" v-for="day in daysOfWork">
            
            <td>{{day.number}}</td>
            <td>{{day.currentDate.getDate() + '/' + (day.currentDate.getMonth() * 1 + 1) + '/' + day.currentDate.getFullYear()}}</td>
            <!-- <PaymentTableRows :row="day.rows" :currentDay="day.day"/> -->
            <td colspan="2">
              <tr colspan="2" :key="row?.listName" v-for="row in day.rows">
                <td colspan="2">{{day.day}}</td>
                
              </tr>
           </td>
           <td colspan="2">
            <tr colspan="2" :key="row?.listName" v-for="row in day.rows">
              <td>{{row.listName + ": "}}{{row.columnsNumbers}}</td>
            </tr>
         </td>
         <td colspan="2">
          <tr colspan="2" :key="row?.listName" v-for="row in day.rows">
            <td>{{row.diameter}}</td>
          </tr>
       </td>
       <td colspan="1">
        <tr colspan="1" :key="row?.listName" v-for="row in day.rows">
          <td>{{row.depth}}</td>
        </tr>
     </td>
     <td colspan="1">
      <tr colspan="1" :key="row?.listName" v-for="row in day.rows">
        <td>{{row.amount}}</td>
      </tr>
   </td>
   <td colspan="2">
    <tr colspan="2" :key="row?.listName" v-for="row in day.rows">
      <td>{{row.totalDepth}}</td>
    </tr>
 </td>
 <td colspan="1">
  <tr colspan="1" :key="row?.listName" v-for="row in day.rows">
    <td>{{price}}</td>
  </tr>
</td>
 <td colspan="2">
  <tr colspan="2" :key="row?.listName" v-for="row in day.rows">
    <td>{{(row.totalDepth*price)}}</td>
  </tr>
</td>
           
              
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
import PaymentTableRows from './PaymentTableRows.vue';






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
    //PaymentTableRows
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

    const daysOfWork = ref<any>()
    
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
      makePaymetRows()
      regularReport.value = false
      paymentReport.value = true
      
    }

    const makePaymetRows = ()=>{
      let daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
      let day = ''
      let rows = [{listName:'', depth:0, diameter:0, columnsNumbers:'', amount:0, totalDepth:0 }]
      let numOfDays = []
      let currentNumber = 1
      let numOfColumns = 1
      let currentDate = null
      for (let index = 0; index < pits.value.length; index++) {
        let date = pits.value[index].finishDate.setHours(0, 0, 0, 0)
        if(index === 0){
          currentDate =pits.value[index].finishDate.setHours(0, 0, 0, 0)
          day = daysOfWeek[pits.value[index].finishDate.getDay()]
          numOfDays.push({number : currentNumber , currentDate : new Date(currentDate)  , day: day , numOfColumns : numOfColumns, rows:rows })
          
        }
        else if(date === currentDate){
          numOfColumns+=1
          numOfDays[numOfDays.length-1].numOfColumns = numOfColumns

        }
        else{
          numOfDays[numOfDays.length-1].rows =sortPaymentPits(currentDate)
          numOfColumns = 1
          currentNumber++
          day = daysOfWeek[pits.value[index].finishDate.getDay()]
          currentDate =pits.value[index].finishDate.setHours(0, 0, 0, 0)
          numOfDays.push({number : currentNumber , currentDate :new Date(currentDate) , day: day , numOfColumns : numOfColumns,  rows:rows  })
        }
      }
      numOfDays[numOfDays.length-1].rows =sortPaymentPits(currentDate)
      console.log(numOfDays);
      daysOfWork.value = numOfDays
      
    }

    const sortPaymentPits = (finishDate:number)=>{
      let rows = []
      let listName=''
      let depth = 0
      let diameter = 0
      let columnsNumbers = ''
      let amount = 0
      let totalDepth = 0
      let tempDate = new Date(finishDate)
      let sortedPits = pits.value.filter((pit: { finishDate: Date; status: string; })=> pit.finishDate?.setHours(0, 0, 0, 0).valueOf() === tempDate.setHours(0, 0, 0, 0).valueOf())

      for (let index = 0; index < sortedPits.length; index++) {
        let pit = sortedPits[index]

        if(index === 0){
          //the first pit is inserted twice ::fix
          listName = pit.listName
          depth = pit.depth
          diameter = pit.diameter
          columnsNumbers = '' + pit.p
          amount = 1
          totalDepth = pit.depth
          rows.push({listName:listName, depth:depth, diameter:diameter, columnsNumbers:columnsNumbers, amount:amount, totalDepth:totalDepth })
        }
        else if (listName === pit.listName && depth === pit.depth && diameter === pit.diameter){
          amount++
          rows[rows.length-1].columnsNumbers = rows[rows.length-1].columnsNumbers + ", " + pit.p
          rows[rows.length-1].amount= amount
          rows[rows.length-1].totalDepth += pit.depth
        }
        else{
          let row = rows.find((row)=>row.listName === pit.listName && row.depth === pit.depth && row.diameter === pit.diameter)
          if(row !== undefined){
            let rowIndex = rows.indexOf(row)
            let tempAmount = rows[rowIndex].amount + 1
            rows[rowIndex].columnsNumbers = rows[rows.length-1].columnsNumbers + ", " + pit.p
            rows[rowIndex].amount= tempAmount
            rows[rowIndex].totalDepth += pit.depth
    
          }
          else{
          listName = pit.listName
          depth = pit.depth
          diameter = pit.diameter
          columnsNumbers = '' + pit.p
          amount = 1
          totalDepth = pit.depth
          rows.push({listName:listName, depth:depth, diameter:diameter, columnsNumbers:columnsNumbers, amount:amount, totalDepth:totalDepth })
          }

         
        }
        
      }
      return rows
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
      makePaymetRows,
      sortPaymentPits,
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

      daysOfWork,
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
  border: 1px solid #000000;
  text-align: left;
  padding: 8px;
  text-align: center;
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