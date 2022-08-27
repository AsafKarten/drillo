<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div v-if="currentUser" class="header">
      <p class="headerText">{{currentUser.customData.first}} {{currentUser.customData.last}}</p>
       <p class="headerText">{{currentUser?.profile.email}} </p>
      <ion-button class="headerButton" @click="userLogout">יציאה</ion-button>
    </div>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true" >
  
   
      <h1>Project View</h1>
      <p>This page is under constructions</p>
      <div>
        <p>{{project?.name}}</p>
        <p>{{project_id}}</p>
        
      </div>

        <MapBox id="map" 
        :v-show="showMap"
      :pitsToShow="pitsToShow" 
      @pitClick="pitClick"
       />

        <ion-modal :is-open="isOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>בור קידוח מספר {{currentPit.p}}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="modalManager">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
        <h5>{{ currentPit.p}}</h5>
        <h6>קואורדינטות</h6>
        <p>{{"Lon: "+currentPit.coordinates.long+ " "}}{{"Lat: "+currentPit.coordinates.lat}}</p>
         <h6>רשת ישראל החדשה</h6>
        <p>{{"צפון: "+currentPit.itm.y+ " "}}{{"מערב: "+currentPit.itm.x}}</p>
           <p>{{currentPit.status? "בוצע": "ממתין" }}</p>
        <p>{{currentPit.garbage? "זבל בקידוח" :  " " }}</p>
        </div>
      </ion-content>
    </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {  IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle,IonInput,IonLabel,IonItem, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';
import MapBox from'../views/MapBox.vue';





export default defineComponent({
  name: 'ProjectView',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonButtons,
    IonModal,
    IonTitle,
    MapBox,
   
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout, getProjectByID, getAllProjects} = useAppState();
    const project_id = ref<any>(route.params);
    const project = ref<any>();
    const {id} = route.params

    const pitsToShow = ref<any>([]);
    const showMap = ref(false);
    const isOpen = ref(false);
    const currentPit = ref<any>();
    
  onMounted(async()=>{
//need to fix find project by id and remove the find function here
  
    const projects = await getAllProjects()
    project.value = projects?.find(proj =>proj._id.toString() === project_id.value.id)
    pitsToShow.value = project.value.pits 
    showMap.value = true;
   
  });

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }

       const pitClick = (clickData: { _id: any; }) => {
        const pitClicked = pitsToShow.value.find((pit: { p: { toString: () => any; }; }) => pit.p.toString() === clickData._id);
        currentPit.value = pitClicked
        modalManager();
        if (pitClicked == undefined) return;
        
    }
          //modal block
      const modalManager = ()=>{
        if(isOpen.value)
          isOpen.value=false;
        else
          isOpen.value = true;
      }
     return {
        userLogout,
        pitClick,
        modalManager,
        currentUser : user,
        project:project,
        project_id:project_id,
        id:id,
        pitsToShow:pitsToShow,
        showMap:showMap,
        isOpen:isOpen,
        currentPit:currentPit,

  }
  },
 
});
</script>

<style scoped>

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

</style>