<template>
  <ion-page>
    <ion-content>
      <ion-header :translucent="true">
        <ion-toolbar>
          <div v-if="currentUser" class="header">
            <p class="headerText">
              {{ currentUser.customData.first }}
              {{ currentUser.customData.last }}
            </p>
            <p class="headerText">{{ currentDate.getDate() +"/"
                + (currentDate.getMonth()+1)  + "/" 
                + currentDate.getFullYear() + "  "  
                + currentDate.getHours() + ":"  
                + currentDate.getMinutes() + ":" 
                + currentDate.getSeconds() }}</p>
            <ion-button class="headerButton" @click="userLogout"
              >Logout</ion-button
            >
          </div>
        </ion-toolbar>
      </ion-header>

      <MapBox id="map" 
      :pitsToShow="pits" 
      :centerPoint="centerPoint"
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
        <h5>{{"P-" + currentPit.p+" "}}</h5>
        <h6>קואורדינטות</h6>
        <p>{{"Lon: "+currentPit.coordinates.lon+ " "}}{{"Lat: "+currentPit.coordinates.lat}}</p>
         <h6>רשת ישראל החדשה</h6>
        <p>{{"צפון: "+currentPit.itm.y+ " "}}{{"מערב: "+currentPit.itm.x}}</p>
        <p>{{currentPit.status? "בוצע": "ממתין" }}</p>
        <p>{{currentPit.garbage? "!זבל בקידוח" :  " " }}</p>
        <ion-button color="success" @click="setConfirm" >{{currentPit.status?"ביטול ביצוע" : "אישור ביצוע"   }}</ion-button>
        <ion-button @click="setGarbage" color="warning">{{currentPit.garbage?"ביטול זבל" : "!זבל בקידוח"    }}</ion-button>
      </ion-content>
    </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonModal,
  IonTitle,
  
} from "@ionic/vue";
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppState } from "../realm-state";
import MapBox from "./MapBox.vue";

export default defineComponent({
  name: "DrillerView",
  components: {
    IonButtons,
    IonModal,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonTitle,
    MapBox,
  },
  setup() {
    const currentDate = ref(new Date())
    const router = useRouter();
    const currentUser = ref<any>();
    const { user, logout, getProject } = useAppState();
    const project = ref<any>({});
    const pits = ref<any>([]);
    const centerPoint = ref<any>();
    const currentPit = ref();
    const isOpen = ref(false);

    onMounted(async () => {
      project.value = await getProject();
      pits.value = project?.value.pits;
      centerPoint.value = {lon:project?.value.pits[0].coordinates.lon, lat:project?.value.pits[0].coordinates.lat};
      
    });

    const userLogout = async () => {
      await logout();
      currentUser.value = null;
      router.replace("/login");
    };

//check error
    const pitClick = (clickData) => {
        const pitClicked = pits.value.find(pit => pit.p.toString() === clickData._id);
        console.log("pitClicked:")
        console.log(pitClicked)
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

      const setConfirm = ()=>{
        if(!currentPit.value.status)
             currentPit.value.status = true;
        else 
           currentPit.value.status = false;   
      }

      const setGarbage = ()=>{
        if(!currentPit.value.garbage)
          currentPit.value.garbage = true;
          else
             currentPit.value.garbage = false;
        
      }
      
    //end modal block
    return {
      //methoods
      userLogout,
      pitClick,
      modalManager,
      setConfirm,
      setGarbage,
      //properties
      currentUser: user,
      project: project,
      pits: pits,
      currentPit:currentPit,
      centerPoint: centerPoint,
      currentDate: currentDate,
      isOpen: isOpen,
    };
  },
});
</script >

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
.header {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-content: space-between;
  font-size: 20px;
}
.headerText {
  padding-left: 2%;
}
.headerButton {
  
  padding-left: 12%;
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
