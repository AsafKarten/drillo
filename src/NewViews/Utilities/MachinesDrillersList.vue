<template>
    
            <div :key="machine._id" v-for="machine in machines">
                <h3>{{machine.name +" "+ machine.licens_number}}</h3>

                <ion-item color="dark" :key="driller._id" v-for="driller in machine.drillers">
                    <ion-avatar slot="start">
                      <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </ion-avatar>
                    <ion-label>
                         {{driller.first +" "+ driller.last}} 
                    </ion-label>
                  </ion-item>
                  
            </div>

   
</template>
  
<script lang="ts">
  import { IonContent, IonPage, IonItem, IonAvatar, IonLabel } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../../realm-state';

  
  

  
  
  export default defineComponent({
    name: 'MachinesDrillersList',
    components: {
       IonItem, 
       IonAvatar, 
       IonLabel,
   
    },
    props:{projectProps:Object},
    setup(projectProps){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID, getDrillingMachineByID} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>();
      const project = ref<any>(projectProps.projectProps);

      const machines = ref<any>([])
      const currentWorker = ref<any>()
    


      onMounted(async()=>{
   
        //console.log(project.value);    
        //project.value = await getProjectByID(project_id.value)
        project?.value.machines
        console.log(project.value);
        
        for (let index = 0; index < project?.value.machines.length; index++) {
          let id = project?.value.machines[index]._id
          const machine = await getDrillingMachineByID(id)
          machines.value.push(machine)
          
        }
        console.log(machines.value);
    
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