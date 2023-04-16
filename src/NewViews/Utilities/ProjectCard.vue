 <template>
  <div v-if="loaded">
    <ion-card lang="he" @click="goToProject()">
        <ion-card-header class="cardHeader">
          <ion-card-title lang="he">{{project.name}}</ion-card-title>
          <ion-card-subtitle>{{project.address}}</ion-card-subtitle>
        </ion-card-header>
    
        <ion-card-content>
          <ion-item>
         <p class="cardText"> {{'סה"כ בוצעו:'+" "+ amountDone + "/" + amount +" " + "כלונסאות"}}</p>
         <CircleProgressBar slot="end" :total="amount*1" :current="amountDone*1" />
        </ion-item>
        <ion-item>
         <p class="cardText" >{{"בוצעו היום:" + " " + amountToday + " " + "כלונסאות"}}</p>
        </ion-item>
        <ion-item>
         <p class="cardText" v-if="reports?.length == 0">{{'אין דוחות לפרוייקט זה'}}</p>
         <div v-else>
          <div v-if="isToday">
         <p class="cardText" >{{isSigned== true? 'דו"ח יומי נחתם' : 'דו"ח יומי לא חתום'}}</p>
          </div>
          <div v-else>
            <p class="cardText">{{'אין דו"ח להיום'}}</p>
          </div>
         <p class="cardText">{{unSignedAmount == 0? 'כל הדוחות חתומים' : unSignedAmount + " " + 'דוחות לא חתומים'}}</p>
        </div>
      </ion-item>
        </ion-card-content>
      </ion-card>
    </div>

    <ion-card  v-if="!loaded">
      <ion-card-header>
        <ion-card-subtitle></ion-card-subtitle>
        <h3><ion-skeleton-text :animated="true" style="width: 40%"></ion-skeleton-text></h3>
        <h3><ion-skeleton-text :animated="true" style="width: 20%"></ion-skeleton-text></h3>
      </ion-card-header>
  
      <ion-card-content>
      <ion-item>
          <ion-skeleton-text :animated="true" style="width: 40%;"></ion-skeleton-text>
          <ion-thumbnail style="width: 100px ; height: 100px" slot="end">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-thumbnail>
      </ion-item>
      <ion-item>
        <ion-skeleton-text :animated="true" style="width: 50%;"></ion-skeleton-text>
    </ion-item>
    <ion-item>
      <ion-skeleton-text :animated="true" style="width: 50%;"></ion-skeleton-text>
  </ion-item>
  <ion-item>
    <ion-skeleton-text :animated="true" style="width: 50%;"></ion-skeleton-text>
</ion-item>
</ion-card-content>
</ion-card>
 </template>
  
  <script lang="ts">
  import {  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,  IonThumbnail, IonSkeletonText, IonItem} from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../../realm-state';
  import ProgressCircele from './ProgressCircele.vue'
 
  import CircleProgressBar from './CircleProgressBar.vue';
  
  
  
 
  
  
  
  export default defineComponent({
    name: 'ProjectView',
    components: {
        IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonThumbnail, IonSkeletonText, CircleProgressBar  },
        props:{projectProp:Object, isClick:Boolean},
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
      const isToday = ref()
      const isSigned = ref()
      const unSignedAmount = ref()
      const loaded = ref(false)
      const isClickable = ref(props.isClick)
  
    onMounted(async()=>{
    console.log(project.value);
    pits.value = await getProjectPits(project.value._id.toString())
    console.log(pits.value);
    countPits()

    reports.value = await getProjectReports(project.value._id.toString())
    checkReports()
    loaded.value = true
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
          isToday.value = true
            if(todayReport.signatureName !== undefined){
                isSigned.value = true
            }
            else
                isSigned.value = false
        }
        else{
          isToday.value = false
        }

        unSignedAmount.value = reports.value.filter((report: { signatureName: string; })=> report.signatureName == undefined).length
    }

    const goToProject =()=>{
      if(isClickable.value)
          router.push('/project-managment/'+ project.value._id)
      else
        return
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
          isToday,
          isSigned,
          unSignedAmount,
          loaded,
          isClickable,
       
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
  .cardHeader{
    background-color: #59AD86;
    margin-bottom: 2%;
    border: 1px solid lightgray;
  }
  .cardText{
    font-size: 100%;
    font-weight: bold;
  }
  .cardHeaders{
    font-size: 130%;
    font-weight: bold;
  }
  ion-card-title{
    color: white;
    font-size: 200%;
  }
  ion-card-subtitle{
    color: white;
    font-size: 150%;
  }
  ion-skeleton-text {
    --border-radius: 9999px;
   
  }

  </style>