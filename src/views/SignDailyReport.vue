<template>
  <ion-page>
  <!-- <AppHeader :showButtons="false"/> -->
    <ion-content :fullscreen="true" >
      <h5>פרוייקט: {{project?.name}}</h5>
      <ion-card v-show="project">
        <ion-card-header>
          <ion-card-subtitle>{{":תאריך"}}</ion-card-subtitle>
          <ion-card-title>דו"ח ביצוע עבודה יומי</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item :key="pit._id" v-for="pit in pits">
            <p class="textMargin">{{pit.p}}</p>
            <p class="textMargin">{{pit.status}}</p>
          </ion-item>
          <!-- <ion-button v-if="!report.approve" @click="confirmReport(report.date)">אישור ביצוע</ion-button>
          <span v-else>אושר</span> -->
        </ion-card-content>
      </ion-card>

      <ion-card v-show="project">
        <ion-card-header>
          <ion-card-title>אישור הדו"ח:</ion-card-title>
        </ion-card-header>
        <ion-card-content>

          <ion-item>
            <ion-label position="end">שם החותם:</ion-label>
            <ion-input
              v-model="signatureName"
              type="text"
              :required="true"
            ></ion-input>
          </ion-item>

          <SignaturePad ref="SignaturePadComponent"/>

          <ion-item>
            <ion-button color="" @click="clearSignature()">ניקוי</ion-button>
            <ion-button color="" @click="saveAsPDF()">שמירה כ-PDF</ion-button>
            <ion-button color="success" @click="confirmReport()">שמירה ואישור הדו"ח</ion-button>
          </ion-item>

        </ion-card-content>
      </ion-card>

      <CreatePdf ref="CreatePdfComponent" :report="report" :signatureImage="signatureImageString" :signatureName="signatureName"/>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {IonContent, IonPage, IonButton, IonInput, IonLabel, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import CreatePdf from '@/Components/CreatePdf.vue';
import SignaturePad from '@/Components/SignaturePad.vue';
import { userInfo } from 'os';

//import AppHeader from '../Components/AppHeader.vue'

export default defineComponent({
  name: 'SignDailyReport',
  components: {

    IonContent,
    IonPage,
    IonButton,
    IonLabel,
    IonInput,
    IonItem,
    IonCard,
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
    CreatePdf,
    SignaturePad,
    //AppHeader
   
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    
    const {user, getReportByID, getProjectByID,getAllProjects, updateProjectPits} = useAppState();
    const currentUser = ref<any>(user)
    const project = ref<any>();
    const reports = ref<any>();
    const report = ref<any>();
    const pits = ref<any>();
    const repoDate = ref<any>()
    const projects =ref<any>()
    const siteManagers = ref<any>()
    const siteManager = ref<any>()
    const {id} = route.params

    const signatureName = ref();
    const signatureImageString = ref<string>();
    const SignaturePadComponent = ref<any>();
    const CreatePdfComponent = ref<any>();


    const clearSignature = ()=>SignaturePadComponent.value.clear();
    const saveAsPDF = async()=>{
      //save the signature as a string of a JPEG image
      signatureImageString.value = await SignaturePadComponent.value.save('image/jpeg');
      //await for 1 more line of code so the signature image updates in the createPDF component
      await (()=>{return null;});
      //call the generate PDF function inside createPDF component
      const pdfFileObject = await CreatePdfComponent.value.generatePDF({save: true});
      console.log(pdfFileObject)
    };

    const confirmReport = async(repo_date:Date)=>{
      console.log(repo_date);
      let repo = reports?.value.find( (rep: { date: Date; }) =>rep.date === repo_date)
      let index = reports.value.indexOf(repo)
      repo.approve = true;
      console.log(repo);
      reports.value[index]=repo;
      console.log(reports.value);
      project.value.reports = reports.value
      await updateProjectPits(project.value)
    }
    
    onMounted(async()=>{
      console.log(id);
      
      //get all projects from mongo
      //projects.value = await getAllProjects()
      //filter the projects by project id

      //need to fix
      //project.value = projects.value.filter((proj: { _id: any; } ) => proj._id.toString() == id)
      //const prj =  projects.value.find((proj: { _id: any; } ) => proj._id.toString() == id)
      //console.log(prj);
      
      project.value = await getReportByID(id.toString())
      //console.log(projects.value);
      console.log(project.value);
      reports.value = project?.value.reports;
      report.value = reports?.value[reports.value.length-1]
      pits.value = report.value.pits
    });

    return {
      //methods
      confirmReport,
      clearSignature,
      saveAsPDF,

      //properties
      currentUser,
      project,
      reports,
      report,
      pits,
      repoDate,
      projects,
      id,
      
      signatureName,
      signatureImageString,
      SignaturePadComponent,

      CreatePdfComponent,
    }
  },
 
});
</script>

<style scoped>
.textMargin{
  margin-left: 1%;
}

</style>



