<template>
  <ion-page>
    <ion-content  :fullscreen="true" >

      <AppHeader :str="'ניהול פרוייקט'"/>
      <!-- <DescriptionCard :header="project?.name" :subtitle="project?.address"/> -->
      <GridButtons :buttons="buttons" :options="{buttonHeight:110}"/>

      <!-- <FileUpload :withPreview="true" :originID="project_id" :projectID="project_id" @fileUploaded="logFileUploaded"/> -->

      <ion-modal :is-open="isOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>מחיקת פרוייקט</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">ביטול</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p>
          האם למחוק פרוייקט זה?
          </p>
          <ion-button color="danger" @click="deleteProject()">מחק</ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  
  </ion-page>
</template>
  
<script lang="ts">
  import { IonContent, IonPage, IonModal, IonButton, IonButtons ,IonToolbar, IonHeader, IonTitle } from '@ionic/vue';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import GridButtons from './Utilities/GridButtons.vue';
  import DescriptionCard from './Utilities/DescriptionCard.vue'
  import AppHeader from '../Components/AppHeader.vue'
  
  import FileUpload from './Utilities/FileUpload.vue'
  
  import { home ,receiptOutline, constructOutline, peopleOutline, personAddOutline, closeCircleOutline} from 'ionicons/icons';

  
  export default defineComponent({
    name: 'ProjectManagment',
    components: {
    IonContent,
    IonPage,
    IonModal,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader, 
    IonTitle,
    GridButtons,
    AppHeader,
    //DescriptionCard,

    //FileUpload
},
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID, deleteProjectByID, deleteProjectPits} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>(route.params);
      const project = ref<any>();
      const isOpen = ref(false)


    
      const buttons = reactive(
        [
          {text:"צוות קידוח",      icon: peopleOutline,click: ()=>goTo('/workers-view/'+ project.value._id) },
          //{text:"מכונות קידוח",          icon: home, click: ()=>goTo('/project-machines/'+ project.value._id) },
          {text:" עריכת צוות קידוח", icon: personAddOutline,  click: ()=>goTo('/add-machine-project/'+ project.value._id) },
          {text:"דוחות עבודה",           icon: receiptOutline, click: ()=>goTo('/project-reports/'+ project.value._id) },
          //{text:"מפת אתר קידוח",         icon: home, click: ()=>goTo('/project-map/'+ project.value._id) },
          {text:"בורות קידוח",      icon: constructOutline, click: ()=>goTo('/managment-pits-list/'+ project.value._id) },
          {text:"מחיקת פרוייקט",      icon: closeCircleOutline, click: ()=>setOpen(true) },
          
          // {text:"הוספת עובד",            icon: home,click: ()=>goTo('/add-worker/'+ project.value._id) },
          //{text:"הוספת עבודה חיצונית",  icon: home, disabled:"true", click: ()=>goTo('/add-job/'+ project.value._id) },
          //{text:"יומן עבודה",            icon: home, disabled:"true", click: ()=>goTo('/work-diary/'+ project.value._id) },
          //{text:"מסמכי אתר",             icon: home, disabled:"true", click: ()=>goTo('/project-files/'+ project.value._id) },
          //{text:"ציוד",                  icon: home, disabled:"true", click: ()=>goTo('/project-tools/'+ project.value._id) },
          //{text:"הזמנת הובלה",          icon: home, disabled:"true", click: ()=>goTo('/machine-transportation/'+ project.value._id)  },
        ]
      );
      //BUTTON TEMPLATE: {index:Number/nothing, text:String, icon:Icon, fill:"solid"/"clear"/"outline", color:String, badge:{count:String/Number, color:String} ,click: ()=>Function },
      //IONIC COLORS: primary, secondary, tertiary, success, warning, danger, light, medium, dark


    onMounted(async()=>{
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
    
        project.value = await getProjectByID(project_id.value)
        console.log(project.value);
    
      });

      const goTo =(route:any)=>{
        router.push(route)
    }

    const deleteProject =async () => {
      await deleteProjectPits(project.value._id)
      await deleteProjectByID(project.value._id)
      .then(()=>{router.push('/home')})
      setOpen(false)
      
    }
    const setOpen = (value: boolean)=>{
      isOpen.value = value
    }






      


    const logFileUploaded = (id:any)=>console.log(id)
          
      return {
         //methods
         goTo,
         setOpen,
         deleteProject,
         //properties
         currentUser,
         project,
         project_id,
         isOpen,

         buttons, 


        logFileUploaded
      }
    }
  });
  </script>
  
  <style scoped>

  </style>