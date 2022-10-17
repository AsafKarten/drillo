<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
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
import { IonContent, IonPage,IonButton, IonItem } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'




export default defineComponent({
  name: 'MachinesView',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItem,
    AppHeader
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout, getDrillingMachinesByID} = useAppState();
    const drillingMachines = ref<any>()
    
  onMounted(async()=>{
    if(user?.value.customData.organizationID === undefined)
          router.push('Login')
    else{
      //filter machines by organization id 
      const allMachines = await getDrillingMachinesByID();
      console.log(allMachines);
      drillingMachines.value= allMachines
      // drillingMachines.value = allMachines?.filter((mac)=> mac.organizationID === user?.value.customData.organizationID)
      // console.log(drillingMachines.value);
    }
    
    
  });

  

    const goToMachine =(machine:any)=>{
        router.push('/machine/'+ machine._id.toString())
    }
     return {
      //methods
        goToMachine,
        //properties
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

</style>
