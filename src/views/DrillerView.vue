<template>
  <ion-page>
    <ion-content>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div v-if="currentUser" class="header">
      <p class="headerText">{{currentUser.customData.first}} {{currentUser.customData.last}}</p>
       <p class="headerText">{{currentUser?.profile.email}} </p>
      <ion-button class="headerButton" @click="userLogout">Logout</ion-button>
    </div>
      </ion-toolbar>
    </ion-header>
    
    <MapBox id="map"/>
    
  
     
   
    
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';
import MapBox from './MapBox.vue';





export default defineComponent({
  name: 'DrillerView',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    MapBox,
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>();
    const {user , logout, getProject} = useAppState();
    const project = ref<any>({});
    const itm = ref<any>([]);
    
    
  onMounted(async()=>{
    project.value = await getProject();
    itm.value = project?.value.gps.itm
    console.log(itm.value);
    
  });

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }
     return {
        userLogout,
        currentUser : user,
        project: project,
        
  }
  },
 
});
</script >

<style scoped>
#map{
    height: 100%;
    width: 100%;

}
.header{
  display: flex;
  flex-direction: row;
  width: 100%;
  align-content: space-between;
  font-size: 20px;
 
}
.headerText {
  padding-left: 2%;
}
.headerButton{
  padding-left: 2%;
}



#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
