<template>
  
    <div class="homeContainer" v-if="loaded">

         <ion-card>
      <ion-card-header>
        <ion-card-subtitle></ion-card-subtitle>
        <ion-card-title>דו"ח ביצוע עבודה {{ report.date.getDate() + '/' + (report.date.getMonth() * 1 + 1) + '/' + report.date.getFullYear() }}</ion-card-title>
      </ion-card-header>
  
      <ion-card-content>
         <ion-item :key="pit._id" v-for="pit in report.pitsToShow">
          

          <p class="textMargin">{{pit.listName + " | " + "בור מס'" +' '+ pit.p +' ' +' | ' + ' עומק:' +' '+ pit.depth + ' ' +' | ' + 'קוטר:' + ' '+ pit.diameter + ' | ' + 'נפח בטון:' + ' ' + pit.concreteVolume.toFixed(2) }}</p>
          </ion-item>

      </ion-card-content>
      <ion-item v-show="report.signature" >
        <p class="textMargin">{{"שם החותם:"}}</p>
        <p class="textMargin">{{report.signatureName}}</p>
        <ion-thumbnail slot="end"> 
          <img  alt="signature" :src="report.signature" />
        </ion-thumbnail>
      </ion-item>
       
      
      <!-- <ion-button v-show="!repo.signature" @click="goTo('/sign-daily-report/'+repo._id)">מעבר לחתימת דו"ח יומי</ion-button> -->
      <ion-button v-show="showBtn" @click="goTo('/daily-report/'+report._id)">מעבר לדו"ח יומי</ion-button>
    </ion-card>
  
    </div>

    <ion-card  v-if="!loaded">
        <ion-card-header>
          <ion-card-subtitle></ion-card-subtitle>
          <h3><ion-skeleton-text :animated="true" style="width: 30%"></ion-skeleton-text></h3>
        </ion-card-header>
    
        <ion-card-content>
        <ion-item>
            <ion-skeleton-text :animated="true" style="width: 50%;"></ion-skeleton-text>
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
  
        <ion-item>
          <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
        <ion-thumbnail slot="end">
                <ion-skeleton-text :animated="true"></ion-skeleton-text>
              </ion-thumbnail>
            </ion-item>
      </ion-card>
  
  </template>
  
  <script lang="ts">
  import {onIonViewDidEnter,IonSkeletonText, IonList,IonListHeader,IonLabel, IonContent, IonPage,IonButton, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonThumbnail, } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {useAppState} from '../realm-state';

  import { home ,receiptOutline, constructOutline} from 'ionicons/icons';


  
 
  
  
  
  
  export default defineComponent({
    name: 'ReportComponent',
    
    components: {

      IonItem,
      IonCard,
      IonCardContent, 
      IonCardHeader, 
      IonCardSubtitle, 
      IonCardTitle,
      IonButton,
      IonThumbnail,
      IonSkeletonText,
    
  },
  props:{reportProp : Object, showButton: Boolean},
  emits: ['deleteMe'],
    setup(props, emits){
     
      const router = useRouter();
      const route = useRoute();
     
      const {user ,getReportPits,deleteReportByID, getProjectByID, getReportByID,getProjectReports, getAllProjects, updateProjectPits} = useAppState();
      const currentUser = ref<any>(user)
      const project = ref<any>();
      const reports = ref<any>();
      const report = ref<any>(props.reportProp);
      const project_id = ref<any>(route.params);//not working 
      const user_id = ref<any>();
      const pits = ref<any>();
      const repoDate = ref<any>()
      const projects =ref<any>()
      const siteManagers = ref<any>()
      const siteManager = ref<any>()
      const {id} = route.params
      const loaded = ref(false)
      const showBtn = ref(props.showButton)
     

      onMounted(async() => {
      
      user_id.value = user?.value.customData._id
      
  
        console.log(report.value);
        
        report.value.pitsToShow =  await getReportPits(report.value._id)
        if(report?.value.pitsToShow.length == 0){
            await deleteReportByID(report.value._id.toString())
            emits.emit('deleteMe')
            
        }
        else{
        loaded.value = true
        }
 
      
    });



    const goTo =(route:any)=>{
        router.push(route)
    }
    
  
   
       return {
        //methods
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
          loaded,
          showBtn,
        
          
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
  
  
  
  