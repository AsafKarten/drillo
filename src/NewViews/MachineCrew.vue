<template>
    <ion-page>
      <ion-content  :fullscreen="true" >
            <AppHeader :str="'צוות מכונת קידוח' +' '+ machine?.name"/>
            <p>{{"מנהל צוות:"+ " "+ machine?.crew.manager.first + " " + machine?.crew.manager.last}}</p>
            <p>{{"מפעיל מכונת קידוח:"+ " "+ machine?.crew.operaitor.first + " " + machine?.crew.operaitor.last}}</p>
      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import AppHeader from '../Components/AppHeader.vue'

  
  

  
  
  export default defineComponent({
    name: 'MachineCrew',
    components: {
    IonContent,
    IonPage,
    AppHeader,
},
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getDrillingMachineByID} = useAppState();
      const currentUser = ref<any>(user)
      const machine_id = ref<any>(route.params);
      const machine = ref<any>()
      const currentWorker = ref<any>()
    


      onMounted(async()=>{
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
    
        machine.value = await getDrillingMachineByID(machine_id.value)
      console.log(machine.value);
      
    
    
      });

    
    
          
      return {
         //methods
       
         //properties
         currentUser,
         currentWorker,
         machine,
         machine_id,


          
      }
    }
  });
  </script>
  
  <style scoped>
   
  </style>