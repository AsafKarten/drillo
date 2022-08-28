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
  
   
      <h1>Daily Report</h1>
      <p>This page is under constructions</p>
      <p>{{repoDate}}</p>
        <div>
        <ion-item :key="pit._id" v-for="pit in pits">
        <p>{{pit.p}}</p>
        <p>{{pit._id}}</p>
        <p>{{pit.status}}</p>
        </ion-item>
        
      </div>

  
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton, IonItem } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';






export default defineComponent({
  name: 'DailyReport',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonItem

   
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout, getAllProjects} = useAppState();
    const project = ref<any>();
    const reports = ref<any>();
    const report = ref<any>();
    const project_id = ref<any>();
    const user_id = ref<any>();
    const pits = ref<any>();
    const repoDate = ref<any>()

  onMounted(async()=>{
    //the shown report is the last object in the array=> it needs to show all the reports that was not confirmed yet
    //need to fix the query so it will not find the project out of all projects in here.
    user_id.value = user.value.customData._id
    console.log(user_id.value);
     const projects = await getAllProjects()
        console.log(projects);
        
        project.value = projects?.find(proj =>proj.site_manager === user_id.value)
        reports.value = project.value.reports;
        report.value = reports.value[reports.value.length-1];
        pits.value = report.value.pits;
        repoDate.value = report.value.date;
        console.log(report.value);
    
   
    
  });

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }

 
     return {
        userLogout,
        currentUser : user,
        project:project,
        reports:reports,
        report:report,
        project_id:project_id,
        user_id:user_id,
        pits:pits,
        repoDate:repoDate,
        
  }
  },
 
});
</script>

<style scoped>

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
