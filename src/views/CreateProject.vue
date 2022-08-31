<template>
  <ion-page>
    <AppHeader/>
    
    <ion-content :fullscreen="true" >
    <!---merge components???-->
      <ExcelComponent/>
    
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import ExcelComponent from '../Components/ExcelComponent.vue'
import AppHeader from '../Components/AppHeader.vue'





export default defineComponent({
  name: 'CreateProject',
  components: {
    IonContent,
    IonPage,
    ExcelComponent,
    AppHeader
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout} = useAppState();
    
    
  onMounted(async()=>{
    //add code or delete
  });

  
     return {
        currentUser : user,
        
  }
  },
 
});
</script>

<style scoped>
h1{
  color:  black;
}
</style>
