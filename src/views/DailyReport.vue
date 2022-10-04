<template>
  <ion-page>
    <!-- <AppHeader :showButtons="false"/> -->
    
    <ion-content :fullscreen="true" >
  
   <create-pdf :report="report"/>
      <h5>פרוייקט: {{project?.name}}</h5>

       <ion-card v-show="project">
    <ion-card-header>
      <ion-card-subtitle>{{":"+"תאריך"}}</ion-card-subtitle>
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
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import CreatePdf from '@/Components/CreatePdf.vue';
import { userInfo } from 'os';

//import AppHeader from '../Components/AppHeader.vue'




export default defineComponent({
  name: 'DailyReport',
  components: {
    IonContent,
    IonPage,
    //IonButton,
    IonItem,
    IonCard,
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
    CreatePdf,
    //AppHeader
   
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const { user, getAllProjects, updateProjectPits} = useAppState();
    const project = ref<any>();
    const reports = ref<any>();
    const report = ref<any>();
    const pits = ref<any>();
    const repoDate = ref<any>()
    const projects =ref<any>()
    const siteManagers = ref<any>()
    const siteManager = ref<any>()
    const {id} = route.params

  onMounted(async()=>{
    //await loginAnonymous() 
    console.log(id);
    
      //get all projects from mongo
      projects.value = await getAllProjects()
      //filter the projects by project id

      //need to fix
      //project.value = projects.value.filter((proj: { _id: any; } ) => proj._id.toString() == id)
      const prj =  projects.value.find((proj: { _id: any; } ) => proj._id.toString() == id.toString())
      console.log(prj);
      
      project.value = prj
      console.log(projects.value);
      console.log(project.value);
      reports.value = project?.value.reports;
      report.value = reports?.value[reports.value.length-1]
      pits.value = report.value.pits
      

  });
 
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

 
     return {
      //methods
        confirmReport,
        //properties
        currentUser:user,
        project:project,
        reports:reports,
        report:report,
        pits:pits,
        repoDate:repoDate,
        projects:projects,
        id:id,
        
  }
  },
 
});
</script>

<style scoped>
.textMargin{
  margin-left: 1%;
}

</style>



