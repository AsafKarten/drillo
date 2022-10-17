<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content :fullscreen="true" >
    <div class="mainContainer">
      <h1>הפרוייקטים שלי</h1>
        <div>
          <ion-item :key="project._id" v-for="project in projects">
          <p>{{project.name + ", " + project.address }}</p>
          <ion-button @click="goToProject(project)">צפייה בפרוייקט</ion-button>
          </ion-item>
          
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton,IonItem } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'





export default defineComponent({
  name: 'ProjectsView',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItem,
    AppHeader
},
  setup(){
    const router = useRouter();
   
    const {user , logout, getAllProjectByOrganizationID} = useAppState();
     const currentUser = ref<any>(user)
    const projects = ref<any>([]);
    
    
  onMounted(async()=>{
    if(user?.value.customData.organizationID === undefined)
          router.push('Login')
    const allProjects = await getAllProjectByOrganizationID();
    console.log(allProjects);
    
    projects.value = allProjects
  });

    
    const goToProject =(project:any)=>{
        router.push('/project-managment/'+ project._id)
    }
     return {
      //methods
        goToProject,
        //properties
        currentUser,
        projects
        
  }
  },
 
});
</script>

<style scoped>
.mainContainer{
  display: block;
  direction: rtl;
  
}

</style>
