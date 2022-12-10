<template>
    <ion-page>
      <AppHeader :str="'דוחות עבודה'"/>
      
      <ion-content :fullscreen="true" >
    
     
        <!-- <h1>מנהל עבודה: {{currentUser?.customData?.first}} {{currentUser?.customData?.last}}</h1> -->
        <h5>פרוייקט: {{project?.name}}</h5>
       <!-- <ion-button @click="goTo('/daily-report/'+project._id)">מעבר לדו"ח יומי</ion-button>-->
  
         <ion-card :key="repo.date" v-for="repo in reports">
      <ion-card-header>
        <ion-card-subtitle>{{ "תאריך" + ":"+ repo.date.getDate() + '/' + (repo.date.getMonth() * 1 + 1) + '/' + repo.date.getFullYear() }}</ion-card-subtitle>
        <ion-card-title>דו"ח ביצוע עבודה יומי</ion-card-title>
      </ion-card-header>
  
      <ion-card-content>
         <ion-item :key="pit._id" v-for="pit in repo.pits">
          
          <p class="textMargin">{{pit.p}}</p>
          
          <p class="textMargin">{{pit.status === 'Done' ? 'בוצע' : pit.status}}</p>
          </ion-item>

      </ion-card-content>
      <ion-item v-show="repo.signature" >
        <p class="textMargin">{{"שם החותם:"}}</p>
        <p class="textMargin">{{repo.signatureName}}</p>
        <ion-thumbnail slot="end"> 
          <img  alt="signature" :src="repo.signature" />
        </ion-thumbnail>
      </ion-item>
       
      
      <!-- <ion-button v-show="!repo.signature" @click="goTo('/sign-daily-report/'+repo._id)">מעבר לחתימת דו"ח יומי</ion-button> -->
      <ion-button @click="goTo('/daily-report/'+repo._id)">מעבר לדו"ח יומי</ion-button>
    </ion-card>
  
    
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage,IonButton, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonThumbnail, } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../realm-state';
  
  import AppHeader from '../Components/AppHeader.vue'
  
  
  
  
  export default defineComponent({
    name: 'ProjectReports',
    components: {
      IonContent,
      IonPage,
      IonItem,
      IonCard,
      IonCardContent, 
      IonCardHeader, 
      IonCardSubtitle, 
      IonCardTitle,
      IonButton,
      IonThumbnail,
      AppHeader
     
  },
    setup(){
      const router = useRouter();
      const route = useRoute();
     
      const {user , getProjectByID, getReportByID, getAllProjects, updateProjectPits} = useAppState();
      const currentUser = ref<any>(user)
      const project = ref<any>();
      const reports = ref<any>();
      const report = ref<any>();
      const project_id = ref<any>(route.params);//not working 
      const user_id = ref<any>();
      const pits = ref<any>();
      const repoDate = ref<any>()
      const projects =ref<any>()
      const siteManagers = ref<any>()
      const siteManager = ref<any>()
      const {id} = route.params
  
    onMounted(async()=>{
      user_id.value = user?.value.customData._id
      console.log(project_id.value);
      
        project.value = await getProjectByID(id.toString()) 
        console.log(project);
        await getAllReports()
        console.log(reports.value);
        
  
      
    });
    const getAllReports = async ()=>{
        let tempArr = []
      for (let index = 0; index < project.value.reports.length; index++) {
        //remove this if after creating new project
        if(project?.value.reports[index].report_id !== undefined){
          let report = await getReportByID(project?.value.reports[index].report_id.toString())
          tempArr.push(report)
          console.log(report);
          
        }
          
          
          }
      reports.value = tempArr.reverse()
    }
  

    const goTo =(route:any)=>{
        router.push(route)
    }
    
  
   
       return {
        //methods
          getAllReports,
          goTo,
          //properties
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
          id:id,
          
    }
    },
   
  });
  </script>
  
  <style scoped>
  .textMargin{
    margin-left: 1%;
    
  }
  .sig {
    width: 20%;
  }
  
  </style>
  
  
  
  