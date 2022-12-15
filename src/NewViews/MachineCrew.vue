<template>
    <ion-page>
      <ion-content  :fullscreen="true" >
            <AppHeader :str="'צוות מכונת קידוח' +' '+ machine?.name"/>
           <ion-item :key="driller._id" v-for="driller in machine?.drillers">
              <p>{{driller.first}} {{driller.last}}</p>
           </ion-item>
      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage,IonItem } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import AppHeader from '../Components/AppHeader.vue'

  
  

  
  
  export default defineComponent({
    name: 'MachineCrew',
    components: {
    IonContent,
    IonPage,
    IonItem,
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