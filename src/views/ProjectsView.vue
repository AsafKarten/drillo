<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    <ion-content  :fullscreen="true" >
    <ion-segment
    :value="selectedSegment"
    @ionChange="segmentChanged"
    ref="myIonSegment"
>
    <ion-segment-button value="Active">פעילים</ion-segment-button>
    <ion-segment-button value="Done">הסתיימו</ion-segment-button>
    
</ion-segment>
    
    
    <div class="mainContainer">
      <h1>הפרוייקטים שלי</h1>
        <div>
          <ion-item  :key="project._id" v-for="project in projects">
          <p>{{project.name + ", " + project.address }}</p>
          <ion-button slot="end" shape="round" size="large" @click="goToProject(project)">{{'בחר'}}</ion-button>
          </ion-item>
          
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {onIonViewDidEnter, IonContent, IonPage,IonButton,IonItem,  IonSegment, IonSegmentButton, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/OfficeAppHeader.vue'





export default defineComponent({
  name: 'ProjectsView',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItem,
    IonSegment,
    IonSegmentButton,
    AppHeader
},
  setup(){
    const router = useRouter();
   
    const {user , logout, getAllProjectByOrganizationID} = useAppState();
    const currentUser = ref<any>(user)
    const allProjects = ref<any>([]);
    const projects = ref<any>([]);
    const myIonSegment = ref();
    const selectedSegment = ref("Active");
    
    
    onIonViewDidEnter(async()=>{
    if(user?.value.customData.organizationID === undefined)
          router.push('Login')

    allProjects.value = await getAllProjectByOrganizationID();
    projects.value = allProjects.value.filter((proj: { status: string; })=>proj.status =="Active")
    console.log(projects.value);
      
  });

  const segmentChanged = (e: CustomEvent) => {
            selectedSegment.value = e.detail.value;
            sortProjects()
        };

    const sortProjects = () =>{
      projects.value = allProjects.value.filter((proj: { status: string; })=>proj.status == selectedSegment.value)
    }

    
    const goToProject =(project:any)=>{
        router.push('/project-managment/'+ project._id)
    }
     return {
      //methods
        goToProject,
        segmentChanged,
        sortProjects,
        //properties
        currentUser,
        allProjects,
        projects,
        myIonSegment,
        selectedSegment,
  }
  },
 
});
</script>

<style scoped>
.mainContainer{
  display: block;
  direction: rtl;
  
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
