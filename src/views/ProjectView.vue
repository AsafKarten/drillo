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
  
   
      <h1>Project View</h1>
      <p>This page is under constructions</p>
      <div>
        <p>{{project?.name}}</p>
        <p>{{project?.address}}</p>
        
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton } from '@ionic/vue';
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
   
},
  setup(props){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout,getProjectByID} = useAppState();
    const project_id = ref<any>();
    const project = ref<any>();
    
  onMounted(async()=>{
   console.log(props);
   
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
        project_id:project_id
        
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