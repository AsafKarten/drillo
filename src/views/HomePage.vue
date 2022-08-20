<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div v-if="currentUser" class="header">
      <p class="headerText">{{currentUser.customData.first}} {{currentUser.customData.last}}</p>
       <p class="headerText">{{currentUser?.profile.email}} </p>
      <ion-button class="headerButton" @click="userLogout">Logout</ion-button>
    </div>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true" >
  
     <div class="homeContainer">

   <div class="homeBox">
    <h5>add new project</h5>
    <ion-button  router-link="/create-project" >add new project</ion-button>
   </div>

   <div class="homeBox">
    <h5>My projects</h5>
    <ion-button router-link="/projects" >My projects</ion-button>
   </div>

   <div class="homeBox">
    <h5>My employees</h5>
    <ion-button router-link="/employees">My employees</ion-button>
   </div>

    <div class="homeBox">
    <h5>My drilling Machines</h5>
    <ion-button router-link="/machines">My drilling Machines</ion-button>
   </div>

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
  name: 'HomePage',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
   
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout} = useAppState();
    
    
  onMounted(async()=>{
    //fix page render after login
    //add code or delete
  });

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }
     return {
        userLogout,
        currentUser : user,
        
  }
  },
 
});
</script>

<style scoped>
.homeContainer{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 1%;
}
.homeBox{
  box-sizing: content-box;
  text-align: center;
  width: 30%;
  padding: 2%;
  margin: 1%;
  border: 2px solid lightgray;
  border-radius: 5px;

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
