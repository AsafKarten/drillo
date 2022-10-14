<template>
    <ion-page>
      <ion-content  :fullscreen="true" >


                <ion-item :key="driller._id" v-for="driller in drillers">
                    <ion-avatar slot="start">
                      <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </ion-avatar>
                    <ion-label>
                         {{driller.first +" "+ driller.last +" "}} {{driller.userType === "driller" ? "קודח":"מנהל"}}
                    </ion-label>
                    <ion-button @click="modalManager(driller)">הוספה</ion-button>
                  </ion-item>

                  <!--move this code block to dynamic component-->
                   <!--choose machine modal-->
                 <ion-modal :is-open="isOpen">
                     <ion-header>
                         <ion-toolbar>
                              <ion-title>{{currentWorker.first + " " + currentWorker.last }} בחירת מכונה </ion-title>
                              <ion-buttons slot="end">
                                  <ion-button @click="modalManager(currentWorker)">Close</ion-button>
                              </ion-buttons>
                         </ion-toolbar>
                     </ion-header>
                    <ion-content class="ion-padding">
                        <ion-item :key="machine._id" v-for="machine in project.machines">
                            <ion-avatar slot="start">
                              <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                            </ion-avatar>
                            <ion-label>
                                 {{machine.type +" "+ machine.name}}
                            </ion-label>
                            <ion-button @click="addDrillerToMachineTeam(machine)">בחירה</ion-button>
                          </ion-item>
                    </ion-content>
                 </ion-modal>
            <!--end of code block-->

      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage, IonItem, IonAvatar, IonLabel, IonButton , IonModal, IonTitle , IonToolbar , IonButtons, IonHeader } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';

  
  

  
  
  export default defineComponent({
    name: 'AddWorker',
    components: {
       IonContent,
       IonPage,
       IonItem, 
       IonAvatar, 
       IonLabel,
       IonButton, 
       IonModal, 
       IonTitle, 
       IonToolbar, 
       IonButtons,
       IonHeader,
       
    },
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID, getOrganizationDrillers, updateProjectMachines} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>(route.params);
      const project = ref<any>();

      const drillers = ref<any>()

      const machines = ref<any>()
      const currentWorker = ref<any>()

      const isOpen = ref(false)
    


      onMounted(async()=>{
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
    
        project.value = await getProjectByID(project_id.value)
        machines.value = project?.value.machines

        drillers.value = await getOrganizationDrillers()

        console.log(project.value);
    
      });

      const modalManager = (worker:object)=>{
            if(isOpen.value)
                isOpen.value = false

            else{
                currentWorker.value = worker
                isOpen.value = true
            }
      }

      const addDrillerToMachineTeam = async (machine: object) => {

        let index = project.value.machines.indexOf(machine)
        project.value.machines[index].drillers.push(currentWorker.value)
        await updateProjectMachines(project.value)
        
        modalManager(currentUser.value)
        router.push('/workers-view/'+ project.value._id)
      }

    
    
          
      return {
         //methods
         modalManager,
         addDrillerToMachineTeam,
       
         //properties
         currentUser,
         project,
         project_id,

         drillers,

         machines,
         currentWorker,

         isOpen,

          
      }
    }
  });
  </script>
  
  <style scoped>
   
  </style>