<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div v-if="currentUser" class="header">
      <p class="headerText">{{currentUser.customData.first}} {{currentUser.customData.last}}</p>
       <p class="headerText">{{currentUser?.profile.email}} </p>
      <ion-button class="headerButton" @click="userLogout">יציאה</ion-button>
    </div>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true" >
  <div class="mainContainer">
   
      <h1>Projects View</h1>
      <p>This page is under constructions</p>
      <div>
        <ion-item :key="project._id" v-for="project in projects">
        <p @click="goToProject(project)">{{project.name}}</p>
        <p>{{project.address}}</p>
        </ion-item>
        
      </div>
      
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonItem } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';







export default defineComponent({
  name: 'ProjectsView',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonItem,
   
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout, getAllProjects} = useAppState();
    const projects = ref<any>([]);
    
    
  onMounted(async()=>{
    projects.value = await getAllProjects();
  });

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }
    const goToProject =(project:any)=>{
        router.push('/project')
    }
     return {
        userLogout,
        goToProject,
        currentUser : user,
        projects:projects
        
  }
  },
 
});
</script>

<style scoped>
.mainContainer{
  display: block;
  direction: rtl;
  
}
.header{
  display: flex;
  flex-direction: row;
  width: 100%;
  align-content: space-between;
  font-size: 20px;
 
}
.headerText {
  padding-left: 2%;
}
.headerButton{
  padding-left: 2%;
}

</style>
