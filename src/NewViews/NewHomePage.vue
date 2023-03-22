<template>
    <ion-page class="back" v-show="showComponent">
      <ion-content  :fullscreen="true" >
      <AppHeader :str="'מסך בית'"/>
      
    
      <div class="homeContainer">
        <ion-grid>
            <ion-row>
              <ion-col sizeXl="1" sizeLg="1" sizeMd="1" sizeSm="3" size="3" :key="project._id" v-for="project in projects">
                <ProjectCard :projectProp="project"/>
            </ion-col>
            </ion-row>
          </ion-grid>
      </div>
 </ion-content>
      <ion-footer>
        <ion-toolbar class="toolBar">
            <ion-grid>
                <ion-row>
                  <ion-col><ion-button shape="round"  router-link="/create-project" >{{'פרוייקט חדש'}}</ion-button></ion-col>
                  <ion-col><ion-button shape="round" router-link="/projects">{{'פרוייקטים'}}</ion-button></ion-col>
                  <ion-col><ion-button shape="round" router-link="/employees">{{'עובדים'}}</ion-button></ion-col>
                  <ion-col><ion-button shape="round" router-link="/machines">{{' מכונות קידוח '}}</ion-button></ion-col>
                </ion-row>
              </ion-grid>
        </ion-toolbar>
      </ion-footer>
     
    </ion-page>
  </template>
  
  <script lang="ts">
  
  import {onIonViewDidEnter, IonContent, IonPage, IonToolbar, IonCol, IonGrid, IonRow, IonHeader,IonFooter, IonTitle,IonButton,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonIcon, } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter } from 'vue-router';
  import {useAppState} from '../realm-state';
  
  import AppHeader from '../Components/AppHeader.vue'
  import ProjectCard from './Utilities/ProjectCard.vue';
  import DescriptionCard from '@/NewViews/Utilities/DescriptionCard.vue';
  
  
  
  
  export default defineComponent({
    name: 'NewHomePage',
    components: {
      IonContent,
      IonPage,
      IonCol,
      IonGrid, 
      IonRow,
      IonFooter,  
      IonToolbar,
      IonButton,
      AppHeader,
      ProjectCard,
     
  },
    setup(){
      const router = useRouter();
     
      const {user , getOrganizationData , getAllProjectByOrganizationID} = useAppState(); 
      const currentUser = ref<any>(user)
      const showComponent = ref(false)
      const organization = ref<any>()
      const allProjects = ref<any>()
      const projects = ref<any>()
      
      onIonViewDidEnter(async()=>{
        
        if(currentUser?.value.customData.organizationID === undefined)
                router.push('Login')
                
        else {
          if(currentUser?.value.customData.userType == 'manager'){
             organization.value = await getOrganizationData()
            console.log(organization.value);
          
            showComponent.value = true
          }
          else if(currentUser?.value.customData.userType == 'driller'){
            router.push('/field-project-managment')
          }
         
        }
        allProjects.value = await getAllProjectByOrganizationID();
        projects.value = allProjects.value.filter((proj: { status: string; })=>proj.status =="Active")

      });
  
       return {
         //properties
          currentUser,
          showComponent,
          organization,
          allProjects,
          projects,
          
    }
    },
   
  });
  </script>
  
  <style scoped>
  ion-grid {
    --ion-grid-columns: 3;
  }
  .toolBar{
    --background:  #59AD86;
    justify-content: space-evenly;
  }
  .footBar{
    width: 100%;
    justify-content: space-evenly;
    
  }
  .homeContainer{
    display: block;
    padding-top: 2%;
    padding-bottom: 2%;
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
  