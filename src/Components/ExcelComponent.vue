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
    <h1>יצירת פרוייקט חדש</h1>
     <ion-item>
          <ion-label position="floating">שם הפרוייקט</ion-label>
          <ion-input
            v-model="projectName"
            type="text"
          ></ion-input>
      </ion-item>
      <ion-item>
          <ion-label position="floating">כתובת</ion-label>
          <ion-input
            v-model="projectAddress"
            type="text"
          ></ion-input>
      </ion-item>
    <div class="uploadBox">
      <p>קובץ קלונסאות</p>
      <input
        type="file"
        v-on:change="addfile($event)"
        placeholder="Upload file"
        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </div>
     <MapBox v-show="showMap" id="map" 
      :pitsToShow="pitsToShow" 
      @pitClick="pitClick"
       />

       <ion-button @click="saveProject">שמירת פרוייקט</ion-button>

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
        </div>
      </ion-content>
    </ion-modal>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle,IonInput,IonLabel,IonItem, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';
import MapBox from'../views/MapBox.vue';
//imports 
import * as XLSX from "xlsx";
import proj4 from 'proj4'







export default defineComponent({
  name: 'SecondExcelComponent',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonButtons,
    IonModal,
    IonTitle,
    IonInput,
    IonLabel,
    IonItem,
    MapBox,
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>();
    const {user , logout, createNewProject} = useAppState();
    const file = ref<any>(File);
    const arrayBuffer = ref<any>(null);
    const filelist = ref<any>(null);
    const arraylist = ref<any>();
    const pitsToShow = ref<any>([]);
    const showMap = ref(false);
    const isOpen = ref(false);
    const currentPit = ref<any>();
    const projectName = ref("");
    const projectAddress = ref("");
  onMounted(async()=>{
    //add code or delete
  });
 const addfile = (event:any) =>{
      file.value = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file.value);
      fileReader.onload = (e) => {
        arrayBuffer.value = fileReader.result;
        var data = new Uint8Array(arrayBuffer.value);
        var arr = [];
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        //console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        arraylist.value =  XLSX.utils.sheet_to_json(worksheet, { raw: true });
        filelist.value = [];
        var pits= []
        for(i = 0 ; i < arraylist.value.length ; i++){
            let p = arraylist.value[i].p;
            let itm = {x : arraylist.value[i].x , y : arraylist.value[i].y }
            const [long, lat] = proj4('+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees', [itm.x, itm.y]);
            pits[i]= {p:p , itm:itm , coordinates: {long:long,lat:lat}}
        }
        pitsToShow.value = pits;
        showMap.value = true;
        console.log(pitsToShow.value);
      };
    }
    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
    
    }

     const pitClick = (clickData: { _id: any; }) => {
        const pitClicked = pitsToShow.value.find((pit: { p: { toString: () => any; }; }) => pit.p.toString() === clickData._id);
        console.log("pitClicked:")
        console.log(pitClicked)
        currentPit.value = pitClicked
        modalManager();
        if (pitClicked == undefined) return;
        
    }

    const saveProject =async ()=>{
      await createNewProject(projectName.value, projectAddress.value, pitsToShow.value)
    }

       //modal block
      const modalManager = ()=>{
        if(isOpen.value)
          isOpen.value=false;
        else
          isOpen.value = true;
      }
     return {
        //methoods
        userLogout,
        addfile,
        pitClick,
        modalManager,
        saveProject,
       //properties
        currentUser : user,
        file : file,
        arrayBuffer :arrayBuffer,
        filelist:filelist,
        arraylist :arraylist,
        pitsToShow :pitsToShow,
        showMap:showMap,
        isOpen:isOpen,
        currentPit:currentPit,
        projectName: projectName,
        projectAddress: projectAddress

        
  }
  },
 
});
</script>

<style scoped>
.hebrewText{
  direction: rtl;
  
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
.uploadBox{
   border: 2px solid lightgray;
   border-collapse: collapse;
   margin-top: 1%;
}
</style>