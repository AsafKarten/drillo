<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content :fullscreen="true" >
 
      <h1> פרטי מכונת קידוח {{ machine?.name }} </h1>
     
      <div>
        <p>name: {{ machine?.name }} </p>
        <p>type: {{ machine?.type }} </p>
        <p>id: {{ machine_id.id }} </p>
        
    </div>
    
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'




export default defineComponent({
  name: 'MachineView',
  components: {
    IonContent,
    IonPage,
    AppHeader
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout,getAllDrillingMachines} = useAppState();
    const machine_id = ref<any>(route.params);
    const machine = ref<any>();
    const {id} = route.params
    
  onMounted(async()=>{
    const drillingMachines = await getAllDrillingMachines()
    machine.value = drillingMachines?.find(proj =>proj._id.toString() === machine_id.value.id)
    console.log(machine_id.value);
   console.log(route.params);
   console.log(id);
   
  });

     return {
      //properties
        currentUser : user,
        machine:machine,
        machine_id:machine_id,
        id:id
        
  }
  },
 
});
</script>

<style scoped>

</style>