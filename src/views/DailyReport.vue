<template>
  <ion-page>
    <AppHeader :str="'דוח עבודה יומי'"/>
    
    <ion-content :fullscreen="true" >
      <div class="homeContainer" v-if="loaded" >
   <create-pdf :report="report" :signature="false"/>
      <h5>פרוייקט: {{report?.project_name + " " + report?.project_address}}</h5>

      <ReportComponent v-if="report" :reportProp="report" :showButton="false"/>
     

       <!-- <ion-card  >
        <ion-card-header>
          <ion-card-subtitle></ion-card-subtitle>
          <ion-card-title>דו"ח ביצוע עבודה {{ report?.date.getDate() + '/' + (report?.date.getMonth() * 1 + 1) + '/' + report?.date.getFullYear() }}</ion-card-title>
        </ion-card-header>
    
        <ion-card-content>
           <ion-item :key="pit._id" v-for="pit in report?.pitsToShow"> -->
            
            <!-- <p class="textMargin">{{' ' + pit.p + ' '+}}</p> -->
            
            <!-- <p class="textMargin">{{pit.status === 'Done' ? 'בוצע' : pit.status}}</p> -->
  
            <!-- <p class="textMargin">{{pit.listName + " | " + "בור מס'" +' '+ pit.p +' ' +' | ' + ' עומק:' +' '+ pit.depth + ' ' +' | ' + 'קוטר:' + ' '+ pit.diameter + ' | ' + 'נפח בטון:' + ' ' + pit.concreteVolume.toFixed(2) }}</p>
            </ion-item> -->
  
        <!-- </ion-card-content>
        <ion-item v-show="report?.signature" >
          <p class="textMargin">{{"שם החותם:"}}</p>
          <p class="textMargin">{{report?.signatureName}}</p>
          <ion-thumbnail slot="end"> 
            <img  alt="signature" :src="report?.signature" />
          </ion-thumbnail>
        </ion-item>
  </ion-card> -->

    <div style="padding-top: 6px">
        <ion-button shape="round" @click="$router.push('/sign-daily-report/' + $route.params.id)" expand="full">{{'חתימה'}}
          <ion-icon :icon="pencilOutline"></ion-icon>
        </ion-button>
        <ion-button shape="round" @click="shareReport" expand="full">{{'שיתוף' }}
          <ion-icon :icon="shareSocialOutline"></ion-icon>
        </ion-button>
    </div>
</div>

<div v-if="!loaded" style="width: 100%; height: 100% ">

    
  <ion-thumbnail slot="end">
          <ion-skeleton-text :animated="true" style="width: 300px ; height: 40px ; margin-top: 30px" ></ion-skeleton-text>
  </ion-thumbnail>
  <ion-thumbnail slot="end">
    <ion-skeleton-text :animated="true" style="width: 1000px ; height: 50px ; margin-top: 300px" ></ion-skeleton-text>
</ion-thumbnail>
<ion-thumbnail slot="end">
  <ion-skeleton-text :animated="true" style="width: 1000px ; height: 50px ; margin-top: 20px" ></ion-skeleton-text>
</ion-thumbnail>
</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {onIonViewDidEnter,onIonViewWillEnter, IonContent, IonPage,IonButton,IonSkeletonText, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonThumbnail ,IonIcon } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import { home ,receiptOutline, constructOutline, shareSocialOutline ,pencilOutline} from 'ionicons/icons';

import CreatePdf from '@/Components/CreatePdf.vue';
import { userInfo } from 'os';

import AppHeader from '../Components/OfficeAppHeader.vue'
import ReportComponent from '@/Components/ReportComponent.vue';



export default defineComponent({
  name: 'DailyReport',
  components: {
    IonContent,
    IonPage,
    IonButton,
    //IonItem,
    //IonCard,
    //IonCardContent,
    //IonCardHeader,
    //IonCardSubtitle,
    //IonCardTitle,
    IonThumbnail,
    IonSkeletonText,
    IonIcon,
    CreatePdf,
    AppHeader,
    ReportComponent
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    
    const { user,getReportPits,getReportByID,updateReportByID, getAllProjects, updateProjectPits} = useAppState();
    const currentUser = ref<any>(user)
    const project = ref<any>();
    //const reports = ref<any>();
    const report = ref<any>();
    const pits = ref<any>();
    const pitsToShow = ref<any>()
    const repoDate = ref<any>()
    const projects =ref<any>()
    const siteManagers = ref<any>()
    const siteManager = ref<any>()
    const {id} = route.params
    const loaded = ref(false)

    onIonViewWillEnter(async()=>{

      report.value = await getReportByID(id.toString())
      report.value.pitsToShow = await getReportPits(report.value._id)
      console.log(report.value);
      
      pits.value = report.value.pits
      loaded.value = true
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
        pitsToShow,
        repoDate:repoDate,
        projects:projects,
        id:id,
        loaded,

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



