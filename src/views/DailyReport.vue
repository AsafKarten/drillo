<template>
  <ion-page>
    <AppHeader :str="'דוח עבודה יומי'"/>
    
    <ion-content :fullscreen="true" >
      <div class="homeContainer">
   <create-pdf :report="report" :signature="false"/>
      <h5>פרוייקט: {{report?.project_name + " " + report?.project_address}}</h5>

       <ion-card >
    <ion-card-header>
      <ion-card-subtitle>{{ "תאריך" + ":"+ report?.date.getDate() + '/' + (report?.date.getMonth() * 1 + 1) + '/' + report?.date.getFullYear() }}</ion-card-subtitle>
      <ion-card-title>דו"ח ביצוע עבודה יומי</ion-card-title>
    </ion-card-header>

    <ion-card-content>
       <div class="pitBorder" :key="pit._id" v-for="pit in pits">
        <p class="textMargin">{{"כלונס מספר: " + pit.p  }}</p>
        
        <p class="textMargin">{{'סטטוס: '}}{{pit.status === "Done" ? 'בוצע' :  pit.status }}</p>
        <p class="textMargin">{{' עומק:' +' '+ pit.depth + ' ' +' , ' + 'קוטר:' + ' '+ pit.diameter + ' , ' + 'נפח בטון:' + ' ' + pit.concreteVolume.toFixed(2) }}</p>
        <ion-item :key="n.depth" v-for="n in pit.notes">
          
          <p class="textMargin">{{n.note}}</p>
          
          <p class="textMargin">{{n.depth}}{{' מטר '}}</p>
          </ion-item>
        </div>
        <!-- <ion-button v-if="!report.approve" @click="confirmReport(report.date)">אישור ביצוע</ion-button>
        <span v-else>אושר</span> -->
    </ion-card-content>
    <ion-item v-show="report?.signature" >
      <p class="textMargin">{{"שם החותם:"}}</p>
      <p class="textMargin">{{report?.signatureName}}</p>
      <ion-thumbnail slot="end"> 
        <img  alt="signature" :src="report?.signature" />
      </ion-thumbnail>
    </ion-item>
  </ion-card>

    <div style="padding-top: 6px">
        <ion-button shape="round" @click="$router.push('/sign-daily-report/' + $route.params.id)" expand="full">{{'חתימה'}}
          <ion-icon :icon="pencilOutline"></ion-icon>
        </ion-button>
        <ion-button shape="round" @click="shareReport" expand="full">{{'שיתוף' }}
          <ion-icon :icon="shareSocialOutline"></ion-icon>
        </ion-button>
    </div>
</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonThumbnail ,IonIcon } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import { home ,receiptOutline, constructOutline, shareSocialOutline ,pencilOutline} from 'ionicons/icons';

import CreatePdf from '@/Components/CreatePdf.vue';
import { userInfo } from 'os';

import AppHeader from '../Components/AppHeader.vue'




export default defineComponent({
  name: 'DailyReport',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItem,
    IonCard,
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
    IonThumbnail,
    IonIcon,
    CreatePdf,
    AppHeader
   
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    
    const { user,getReportByID,updateReportByID, getAllProjects, updateProjectPits} = useAppState();
    const currentUser = ref<any>(user)
    const project = ref<any>();
    //const reports = ref<any>();
    const report = ref<any>();
    const pits = ref<any>();
    const repoDate = ref<any>()
    const projects =ref<any>()
    const siteManagers = ref<any>()
    const siteManager = ref<any>()
    const {id} = route.params

  onMounted(async()=>{

      report.value = await getReportByID(id.toString())
      console.log(report.value);
      
      pits.value = report.value.pits
  });
 

  //sharing functions:

    const fallbackCopyTextToClipboard = function(text:string) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try { document.execCommand('copy') } catch (err) { return }
      document.body.removeChild(textArea);
    }

    const copyTextToClipboard = function(text:string) {
      if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text); return;
      }
      navigator.clipboard.writeText(text)
    }

    const shareLink = function(link:string) {
      if (navigator && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && navigator.share) {
        navigator.share({
            title: 'Drillo',
            text: 'Sign a daily report',
            url: link,
          }).then(() => { return; }).catch(() => { return; });
      } else {
        copyTextToClipboard(link);
      }
    }

    const shareReport = function() {
      const signRoute = router.resolve('/sign-daily-report/' + route.params.id);
      const signRouteAbsoluteURL = new URL(signRoute.href, window.location.origin).href;

      console.log(signRouteAbsoluteURL)
      shareLink(signRouteAbsoluteURL);
    }





 
     return {
      //methods
       // confirmReport,
        shareReport,

        //properties
        currentUser:user,
        project:project,
        //reports:reports,
        report:report,
        pits:pits,
        repoDate:repoDate,
        projects:projects,
        id:id,

        shareSocialOutline,
        pencilOutline,
        
  }
  },
 
});
</script>

<style scoped>
.homeContainer{
  display: block;
  
  padding-top: 2%;
  padding-bottom: 2%;
}
.textMargin{
  margin-left: 1%;
}
.pitBorder{
  border-bottom: 1px black solid;
  margin-bottom: 2%;
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



