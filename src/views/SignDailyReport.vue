<template>
  <ion-page >
    
    <ion-content :fullscreen="true" >
    <AppHeader v-show="currentUser?.customData.first" :str="'חתימה על דוח יומי'"/>
   <div v-if="!report?.signature">
      <ion-card v-show="report" >
        <ion-card-header>
          <ion-card-subtitle>{{report?.project_name + " " + report?.project_address}}</ion-card-subtitle>
          <ion-card-title>דו"ח ביצוע עבודה יומי {{ "תאריך" + ":"+ report?.date.getDate() + '/' + (report?.date.getMonth() * 1 + 1) + '/' + report?.date.getFullYear() }}</ion-card-title>
      
        </ion-card-header>
    
        <ion-card-content>
           <div class="pitBorder" :key="pit._id" v-for="pit in pits">
            <p class="textMargin">{{pit.listName + " | " + "כלונס מספר: " + pit.p  }}</p>
            
            <p class="textMargin">{{'סטטוס: '}}{{pit.status === "Done" ? 'בוצע' :  pit.status }}</p>

            <p class="textMargin">{{' עומק:' +' '+ pit.depth + ' ' +' , ' + 'קוטר:' + ' '+ pit.diameter + ' , ' + 'נפח בטון:' + ' ' + pit.concreteVolume.toFixed(2) }}</p>
            <ion-item :key="n.depth" v-for="n in pit.notes">
              
              <p class="textMargin">{{n.note}}</p>
              
              <p class="textMargin">{{n.depth}}{{' מטר '}}</p>
              </ion-item>
            </div>
      
        </ion-card-content>
      </ion-card>

      <ion-card v-show="report">
        <ion-card-header>
          <ion-card-title>אישור הדו"ח:</ion-card-title>
        </ion-card-header>
        <ion-card-content>

          <ion-item>
            <ion-label position="end">שם החותם:</ion-label>
            <ion-input
              v-model="signatureName"
              type="text"
              :required="true"
            ></ion-input>
          </ion-item>

          <SignaturePad ref="SignaturePadComponent"/>

          <ion-item>
            <ion-button color="" @click="clearSignature()">ניקוי</ion-button>
            <!-- <ion-button color="" @click="saveAsPDF()">שמירה כ-PDF</ion-button> -->
            <ion-button color="success" @click="confirmReport()">שמירה ואישור הדו"ח</ion-button>
          </ion-item>

        </ion-card-content>
      </ion-card>

      <CreatePdf ref="CreatePdfComponent" :report="report" :signatureImage="signatureImageString" :signatureName="signatureName"/>
</div>
<div v-else class="drilloCard">
  <ion-card v-show="report" >
    <ion-card-header>
      <ion-card-subtitle>{{report?.project_name + " " + report?.project_address}}</ion-card-subtitle>
      <ion-card-title>דו"ח ביצוע עבודה יומי {{ "תאריך" + ":"+ report?.date.getDate() + '/' + (report?.date.getMonth() * 1 + 1) + '/' + report?.date.getFullYear() }}</ion-card-title>
   
    </ion-card-header>

    <ion-card-content>
       <div class="pitBorder" :key="pit._id" v-for="pit in pits">
        <p class="textMargin">{{pit.listName + " | " + "כלונס מספר: " + pit.p  }}</p>
        
        <p class="textMargin">{{'סטטוס: '}}{{pit.status === "Done" ? 'בוצע' :  pit.status }}</p>

        <p class="textMargin">{{' עומק:' +' '+ pit.depth + ' ' +' , ' + 'קוטר:' + ' '+ pit.diameter + ' , ' + 'נפח בטון:' + ' ' + pit.concreteVolume.toFixed(2) }}</p>
        <ion-item :key="n.depth" v-for="n in pit.notes">
          
          <p class="textMargin">{{n.note}}</p>
          
          <p class="textMargin">{{n.depth}}{{' מטר '}}</p>
          </ion-item>
        </div>
  
    </ion-card-content>
    <ion-item v-show="report?.signature" >
      <p class="textMargin">{{"שם החותם:"}}</p>
      <p class="textMargin">{{report?.signatureName}}</p>
      <ion-thumbnail slot="end"> 
        <img  alt="signature" :src="report?.signature" />
      </ion-thumbnail>
    </ion-item>
  </ion-card>
</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {IonContent, IonPage, IonButton, IonInput, IonLabel, IonItem,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,IonThumbnail, IonCardTitle, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';

import CreatePdf from '@/Components/CreatePdf.vue';
import SignaturePad from '@/Components/SignaturePad.vue';
import { userInfo } from 'os';

import AppHeader from '../Components/AppHeader.vue'

export default defineComponent({
  name: 'SignDailyReport',
  components: {

    IonContent,
    IonPage,
    IonButton,
    IonLabel,
    IonInput,
    IonItem,
    IonCard,
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
    IonThumbnail,
    CreatePdf,
    SignaturePad,
    AppHeader
   
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    
    const {user, getReportPits, loginAnon, getReportByID,updateReportSigByID, getProjectByID,getAllProjects, updateProjectPits} = useAppState();
    const currentUser = ref<any>(user)
    const project = ref<any>();
    const reports = ref<any>();
    const report = ref<any>();
    const pits = ref<any>();
    const repoDate = ref<any>()
    const projects =ref<any>()
    const siteManagers = ref<any>()
    const siteManager = ref<any>()
    const {id} = route.params

    const signatureName = ref("");
    const signatureImageString = ref<string>();
    const SignaturePadComponent = ref<any>();
    const CreatePdfComponent = ref<any>();
    const emptySig = ref("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAGQAlgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=")

    
    const clearSignature = ()=>SignaturePadComponent.value.clear();
    const saveAsPDF = async()=>{
      //save the signature as a string of a JPEG image
      signatureImageString.value = await SignaturePadComponent.value.save('image/jpeg');
      //await for 1 more line of code so the signature image updates in the createPDF component
      await (()=>{return null;});
      //call the generate PDF function inside createPDF component
      //const pdfFileObject = await CreatePdfComponent.value.generatePDF({save: true});
      //console.log(pdfFileObject)
    };

    onMounted(async()=>{
      if(!currentUser.value)
      {
        await loginAnon()
      }
      console.log(id);
      report.value = await getReportByID(id.toString())
      pits.value = await getReportPits(report.value._id)
      console.log(report.value);
      
    });

    
    const confirmReport = async()=>{
      if( signatureName.value === ""){
        alert("יש למלא שם")
        return
      }
      await saveAsPDF()
      console.log(signatureImageString.value);
      if(signatureImageString.value === emptySig.value){
        alert("יש לחתום במלבן הריק")
        return
      }
      
      report.value.signature = signatureImageString.value
      report.value.signatureName = signatureName.value
      await updateReportSigByID(report.value)
    }
    


    return {
      //methods
      confirmReport,
      clearSignature,
      saveAsPDF,

      //properties
      currentUser,
      project,
      reports,
      report,
      pits,
      repoDate,
      projects,
      id,
      emptySig,
      
      signatureName,
      signatureImageString,
      SignaturePadComponent,

      CreatePdfComponent,
    }
  },
 
});
</script>

<style scoped>
.textMargin{
  text-align: right;
  margin-left: 1%;
}
.drilloCard{
  text-align: right;
  
}
.pitBorder{
  border-bottom: 1px black solid;
  margin-bottom: 2%;
}

</style>



