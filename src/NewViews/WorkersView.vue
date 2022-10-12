<template>
    <ion-page>
      <ion-content  :fullscreen="true" >

            <div :key="machine._id" v-for="machine in machines">
                <h3>{{machine.type +" "+ machine.model}}</h3>

                <ion-item :key="driller._id" v-for="driller in machine.drillers">
                    <ion-avatar slot="start">
                      <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </ion-avatar>
                    <ion-label>
                         {{driller.first +" "+ driller.last}} 
                    </ion-label>
                  </ion-item>
                  
            </div>

      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage, IonItem, IonAvatar, IonLabel } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';

  
  

  
  
  export default defineComponent({
    name: 'WorkersView',
    components: {
       IonContent,
       IonPage,
       IonItem, 
       IonAvatar, 
       IonLabel,
       
    },
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>(route.params);
      const project = ref<any>();

      const machines = ref<any>()
      const currentWorker = ref<any>()
    


      onMounted(async()=>{
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
    
        project.value = await getProjectByID(project_id.value)
        machines.value = project?.value.machines
        console.log(project.value);
    
      });

    
    
          
      return {
         //methods
       
         //properties
         currentUser,
         project,
         project_id,

         machines,
         currentWorker,

          
      }
    }
  });
  </script>
  
  <style scoped>
   
  </style>