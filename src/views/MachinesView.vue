<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content color="dark" :fullscreen="true" >
  <div class="mainContainer">
   
      <h1>מכונות הקידוח שלי</h1>

         <div>
          <ion-button router-link="/create-machine">הוסף מכונה חדשה</ion-button>
        <ion-item color="dark" :key="machine._id" v-for="machine in drillingMachines">
          <ion-avatar slot="start">
            <img alt="Silhouette of a person's head" src="../../public/assets/icon/favicon.png" />
          </ion-avatar>
        <p>{{'  '+ machine?.name + ' : '}} </p>
        <p> {{ machine?.licens_number}}</p>
        <ion-button  slot="end" @click="goToMachine(machine)">צפייה במכונה</ion-button>
        </ion-item>       
      </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,IonButton, IonItem , IonAvatar} from '@ionic/vue';
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
    IonAvatar,
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
