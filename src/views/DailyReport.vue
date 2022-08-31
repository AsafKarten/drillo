<template>
  <ion-page>
    <AppHeader/>
    
    <ion-content :fullscreen="true" >
  
   
      <h1>מנהל עבודה: {{currentUser?.customData.first}} {{currentUser?.customData.last}}</h1>
      <h5>פרוייקט: {{project?.name}}</h5>

       <ion-card :key="repo.date" v-for="repo in reports">
    <ion-card-header>
      <ion-card-subtitle>{{repo.date+":"+"תאריך"}}</ion-card-subtitle>
      <ion-card-title>דו"ח ביצוע עבודה יומי</ion-card-title>
    </ion-card-header>

    <ion-card-content>
       <ion-item :key="pit._id" v-for="pit in repo.pits">
        <p class="textMargin">{{pit.p}}</p>
        
        <p class="textMargin">{{pit.status}}</p>
        </ion-item>
        <ion-button v-if="!repo.approve" @click="confirmReport(repo.date)">אישור ביצוע</ion-button>
        <span v-else>אושר</span>
    </ion-card-content>
  </ion-card>

        <!-- <div :key="repo.date" v-for="repo in reports">
        <p>{{repo.date}}</p>
        <ion-item :key="pit._id" v-for="pit in repo.pits">
        <p>{{pit.p}}</p>
        <p>{{pit._id}}</p>
        <p>{{pit.status}}</p>
        </ion-item>
        <ion-button v-if="!repo.approve" @click="confirmReport(repo.date)">אישור ביצוע</ion-button>
        <span v-else>אושר</span>
      </div> -->

  
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

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
    AppHeader
   
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout, getAllProjects, updateProjectPits} = useAppState();
    const project = ref<any>();
    const reports = ref<any>();
    const report = ref<any>();
    const project_id = ref<any>();
    const user_id = ref<any>();
    const pits = ref<any>();
    const repoDate = ref<any>()
    const projects =ref<any>()
    const siteManagers = ref<any>()
    const siteManager = ref<any>()

  onMounted(async()=>{
    //the shown report is the last object in the array=> it needs to show all the reports that was not confirmed yet
    //need to fix the query so it will not find the project out of all projects in here.
    user_id.value = user.value.customData._id
    console.log(user_id.value);
      projects.value = await getAllProjects()
        console.log(projects);
        findProjectAndReports();

    
  });
  const findProjectAndReports = ()=>{

    for (let index = 0; index < projects.value.length; index++) {
          const tempProject =  projects.value[index]
          siteManagers.value = tempProject.site_managers
          let tempManager = tempProject.site_managers.find((sm: { _id: any; }) => sm._id.toString() === user.value.customData._id.toString())
          if(tempManager !== undefined){
            siteManager.value = tempManager
            project.value = tempProject
            reports.value = project.value.reports;
            return true;
          }  
        }
    
  }

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
        confirmReport,
        findProjectAndReports,
        currentUser : user,
        project:project,
        reports:reports,
        report:report,
        project_id:project_id,
        user_id:user_id,
        pits:pits,
        repoDate:repoDate,
        siteManagers:siteManagers,
        siteManager:siteManager,
        projects:projects,
        
  }
  },
 
});
</script>

<style scoped>
.textMargin{
  margin-left: 1%;
}

</style>



