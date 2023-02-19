<template>
    <ion-page>
      <AppHeader :str="'דוחות עבודה'"/>
      
      <ion-content :fullscreen="true" >
    <div class="homeContainer">
     
        <!-- <h1>מנהל עבודה: {{currentUser?.customData?.first}} {{currentUser?.customData?.last}}</h1> -->
        <h5>פרוייקט: {{project?.name}}</h5>
       <!-- <ion-button @click="goTo('/daily-report/'+project._id)">מעבר לדו"ח יומי</ion-button>-->

         <ion-card  :key="repo.date" v-for="repo in reports">
      <ion-card-header>
        <ion-card-subtitle>{{ "תאריך" + ":"+ repo.date.getDate() + '/' + (repo.date.getMonth() * 1 + 1) + '/' + repo.date.getFullYear() }}</ion-card-subtitle>
        <ion-card-title>דו"ח ביצוע עבודה יומי</ion-card-title>
      </ion-card-header>
  
      <ion-card-content>
         <ion-item :key="pit._id" v-for="pit in repo.pitsToShow">
          
          <!-- <p class="textMargin">{{' ' + pit.p + ' '+}}</p> -->
          
          <!-- <p class="textMargin">{{pit.status === 'Done' ? 'בוצע' : pit.status}}</p> -->

          <p class="textMargin">{{pit.p + '-בוצע, ' + ' עומק:' +' '+ pit.depth + ' ' +' , ' + 'קוטר:' + ' '+ pit.diameter + ' , ' + 'נפח בטון:' + ' ' + pit.concreteVolume.toFixed(2) }}</p>
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
  
    </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import {onIonViewWillEnter,onIonViewDidEnter, IonContent, IonPage,IonButton, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonThumbnail, } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../realm-state';

  import { home ,receiptOutline, constructOutline} from 'ionicons/icons';
  
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
     
      const {user ,getReportPits, getProjectByID, getReportByID,getProjectReports, getAllProjects, updateProjectPits} = useAppState();
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
     

      onIonViewDidEnter(() => {
      console.log('Home page did enter');
      
    });

      onIonViewWillEnter(async() => {
      console.log('Home page will enter');
      user_id.value = user?.value.customData._id
      
        project.value = await getProjectByID(id.toString()) 
        reports.value = await getProjectReports(project_id.value)
        console.log(project.value);
        await getAllReports()
    });

    // onMounted(async()=>{
    //   user_id.value = user?.value.customData._id
      
    //     project.value = await getProjectByID(id.toString()) 
    //     reports.value = await getProjectReports(project_id.value)
    //     console.log(project.value);
    //     await getAllReports()
    // });

    const getAllReports = async ()=>{        
      for ( let index = 0; index < reports.value.length; index++) {
         let pitsToShow = await getReportPits(reports.value[index]._id.toString()) ;
         reports.value[index].pitsToShow =  pitsToShow 
      }
      reports.value = reports.value.reverse()
      
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
  .homeContainer{
    display: block;
    padding-top: 2%;
    padding-bottom: 2%;
  }
  .textMargin{
    margin-left: 1%;
    
  }
  .sig {
    width: 20%;
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
  
  
  
  