<template>
  <ion-page>
    <ion-content :fullscreen="true" >

      <AppHeader :str="'ניהול פרוייקט'"/>
      <DescriptionCard :header="project?.name" :subtitle="project?.address"/>
      <GridButtons :buttons="buttons" :options="{buttonHeight:110}"/>

      <!-- <FileUpload :withPreview="true" :originID="project_id" :projectID="project_id" @fileUploaded="logFileUploaded"/> -->

    </ion-content>
  
  </ion-page>
</template>
  
<script lang="ts">
  import { IonContent, IonPage } from '@ionic/vue';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import GridButtons from './Utilities/GridButtons.vue';
  import DescriptionCard from './Utilities/DescriptionCard.vue'
  import AppHeader from '../Components/AppHeader.vue'
  
  import FileUpload from './Utilities/FileUpload.vue'
  
  import { home } from 'ionicons/icons';
  
  export default defineComponent({
    name: 'ProjectManagment',
    components: {
    IonContent,
    IonPage,
    GridButtons,
    AppHeader,
    DescriptionCard,

    //FileUpload
},
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>(route.params);
      const project = ref<any>();


     // const goTo = (route:any) => { router.push(route) }
      const buttons = reactive(
        [
          {text:"רשימת עובדים",          icon: home,click: ()=>goTo('/workers-view/'+ project.value._id) },
          {text:"מכונות קידוח",          icon: home, click: ()=>goTo('/project-machines/'+ project.value._id) },
          {text:"הוספת מכונת קידוח ושינוי עובדים", icon: home,  click: ()=>goTo('/add-machine-project/'+ project.value._id) },
          {text:"דוחות עבודה",           icon: home, click: ()=>goTo('/project-reports/'+ project.value._id) },
          {text:"מפת אתר קידוח",         icon: home, click: ()=>goTo('/project-map/'+ project.value._id) },
          {text:"כלונסאות לקידוח",      icon: home, click: ()=>goTo('/managment-pits-list/'+ project.value._id) },
          
          // {text:"הוספת עובד",            icon: home,click: ()=>goTo('/add-worker/'+ project.value._id) },
          {text:"הוספת עבודה חיצונית",  icon: home, disabled:"true", click: ()=>goTo('/add-job/'+ project.value._id) },
          {text:"יומן עבודה",            icon: home, disabled:"true", click: ()=>goTo('/work-diary/'+ project.value._id) },
          {text:"מסמכי אתר",             icon: home, disabled:"true", click: ()=>goTo('/project-files/'+ project.value._id) },
          {text:"ציוד",                  icon: home, disabled:"true", click: ()=>goTo('/project-tools/'+ project.value._id) },
          {text:"הזמנת הובלה",          icon: home, disabled:"true", click: ()=>goTo('/machine-transportation/'+ project.value._id)  },
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






      


    const logFileUploaded = (id:any)=>console.log(id)
          
      return {
         //methods
         goTo,
         //properties
         currentUser,
         project,
         project_id,

         buttons, 


        logFileUploaded
      }
    }
  });
  </script>
  
  <style scoped>

  </style>