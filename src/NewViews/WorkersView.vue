<template>
  <ion-page>
    <ion-content  :fullscreen="true" >
      <AppHeader :str="'רשימת עובדים'"/>
      <MachinesDrillersList v-if="project" :projectProps="project"/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonContent, IonPage } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import AppHeader from '../Components/AppHeader.vue'
  import MachinesDrillersList from './Utilities/MachinesDrillersList.vue'

  export default defineComponent({
      name: 'WorkersView',
      components: {
      IonContent,
      IonPage,
      AppHeader,
      MachinesDrillersList
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