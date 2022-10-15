<template>
  <ion-page>
    <ion-content  :fullscreen="true" >
        <MachinesList/>
    </ion-content>
  </ion-page>

</template>

<script lang="ts">
import { IonContent, IonPage, IonItem, IonAvatar, IonLabel, IonButton } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppState } from '../realm-state';
import MachinesList from './Utilities/MachinesList.vue';






export default defineComponent({
name: 'AddMachine',
components: {
    MachinesList
},
props:{projectProps:Object},
setup(projectProps){
const router = useRouter();
const route = useRoute();
const {user ,getOrganizationDrillingMachines, getProjectByID} = useAppState();
const currentUser = ref<any>(user)
const project_id = ref<any>();
const project = ref<any>(projectProps.projectProps);

const machines = ref<any>()
const currentWorker = ref<any>()



onMounted(async()=>{

//console.log(project.value);    
//project.value = await getProjectByID(project_id.value)
machines.value = await getOrganizationDrillingMachines()
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