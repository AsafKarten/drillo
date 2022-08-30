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
   
      <h1>מכונות הקידוח שלי</h1>

         <div>
          <ion-button router-link="/create-machine">הוסף מכונה חדשה</ion-button>
        <ion-item :key="machine._id" v-for="machine in drillingMachines">
        <p>{{machine?.name + ": "}} </p>
        <p> {{ machine?.type}}</p>
        <ion-button  @click="goToMachine(machine)">צפייה במכונה</ion-button>
        </ion-item>       
      </div>
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
  name: 'MachinesView',
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
    const {user , logout, getAllDrillingMachines} = useAppState();
    const drillingMachines = ref<any>()
    
  onMounted(async()=>{
    //add code or delete
    drillingMachines.value = await getAllDrillingMachines();
    console.log(drillingMachines.value);
    
  });

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }

    const goToMachine =(machine:any)=>{
        router.push('/machine/'+ machine._id)
    }
     return {
        userLogout,
        goToMachine,
        currentUser : user,
        drillingMachines:drillingMachines,
        
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
