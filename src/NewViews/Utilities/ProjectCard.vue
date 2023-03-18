 <template>
    <ion-card @click="goToProject()">
        <ion-card-header>
          <ion-card-title>{{project.name}}</ion-card-title>
          <ion-card-subtitle>{{project.address}}</ion-card-subtitle>
        </ion-card-header>
    
        <ion-card-content>
         <p>{{'סה"כ בוצעו:' +" "+ amountDone + "/" + amount +" " + "בורות קידוח"}}</p>
         <p>{{"בוצעו היום:" + " " + amountToday}}</p>
         <p v-if="reports?.length == 0">{{'אין דוחות לפרוייקט זה'}}</p>
         <div v-else>
         <p >{{isSigned== true? 'דו"ח יומי נחתם' : 'דו"ח יומי לא חתום'}}</p>
         <p>{{unSignedAmount == 0? 'כל הדוחות חתומים' : unSignedAmount + " " + 'דוחות לא חתומים'}}</p>
        </div>
        </ion-card-content>
      </ion-card>
 </template>
  
  <script lang="ts">
  import {  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../../realm-state';
  import MapBox from'../views/MapBox.vue';
  
  import AppHeader from '../Components/AppHeader.vue'
  
  import Datepicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
import { report } from 'process';
  
  
  
  export default defineComponent({
    name: 'ProjectView',
    components: {
        IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle },
        props:{projectProp:Object},
    setup(props){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID, getProjectPits, getProjectReports} = useAppState();
      const project_id = ref<any>();
      const currentUser = ref<any>(user)
      const project = ref<any>(props.projectProp);
      const pits = ref<any>()
      const amount = ref()
      const amountDone = ref()
      const amountToday = ref()
      const reports = ref<any>()
      const isSigned = ref()
      const unSignedAmount = ref()
  
    onMounted(async()=>{
    console.log(project.value);
    pits.value = await getProjectPits(project.value._id.toString())
    console.log(pits.value);
    countPits()

    reports.value = await getProjectReports(project.value._id.toString())
    checkReports()
    });

    const countPits= ()=>{
        amount.value = pits.value.length
        amountDone.value= pits.value.filter((pit: { status: string; })=>pit.status == "Done").length
        let today = new Date()
        
        amountToday.value = pits.value.filter((pit: { status: string; finishDate: Date; })=>pit.status == "Done" && pit.finishDate.setHours(0,0,0,0) == today.setHours(0,0,0,0)).length
        
    }

    const checkReports = ()=>{
        let today = new Date()
        let todayReport = reports.value.find((report: { date: Date; })=> report.date.setHours(0,0,0,0) == today.setHours(0,0,0,0))
        if(todayReport !== undefined){
            if(todayReport.signatureName !== undefined){
                isSigned.value = true
            }
            else
                isSigned.value = false
        }

        unSignedAmount.value = reports.value.filter((report: { signatureName: string; })=> report.signatureName == undefined).length
    }

    const goToProject =()=>{
        router.push('/project-managment/'+ project.value._id)
    }
   
        
       return {
        //methods
         countPits,
         checkReports,
         goToProject,
         
          //properties
          currentUser,
          project,
          project_id,
          pits,
          amount,
          amountDone,
          amountToday,
          reports,
          isSigned,
          unSignedAmount,
       
    }
    },
   
  });
  </script>
  
  <style scoped>
  .hebrewText{
    direction: rtl;
    line-height: 80%;
    overflow: scroll;
    margin-bottom: 10%;
  }
  .mainContainer{
    display: block;
    direction: rtl;
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
  </style>