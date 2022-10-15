<template>
    <ion-page>
      <ion-content :fullscreen="true" >

        <AppHeader/>
        <DescriptionCard :header="project?.name" :subtitle="project?.address"/>
        <GridButtons :buttons="buttons" :options="{buttonHeight:110}"/>

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
  
  
import { home } from 'ionicons/icons';


  
  
  export default defineComponent({
    name: 'ProjectManagment',
    components: {
    IonContent,
    IonPage,
    GridButtons,
    AppHeader,
    DescriptionCard
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
          {text:"רשימת עובדים",          icon: home, badge:{count: 3, color:"warning"} ,click: ()=>goTo('/workers-view/'+ project.value._id) },
          {text:"הוספת עובד",            icon: home, fill:"solid", color: "success", badge:{count: 591, color:"danger"} ,click: ()=>goTo('/add-worker/'+ project.value._id) },
          {text:"הוספת עבודה חיצונית",  icon: home, click: ()=>goTo('/add-job/'+ project.value._id) },
          {text:"יומן עבודה",            icon: home, click: ()=>goTo('/work-diary/'+ project.value._id) },
          {text:"מכונות קידוח",          icon: home, click: ()=>goTo('/project-machines/'+ project.value._id) },
          {text:"הוספת מכונת קידוח",     icon: home, click: ()=>goTo('/add-machine/'+ project.value._id) },
          {text:"דוחות עבודה",           icon: home, click: ()=>goTo('/project-reports/'+ project.value._id) },
          {text:"מפת אתר קידוח",         icon: home, click: ()=>goTo('/map/'+ project.value._id) },
          {text:"מסמכי אתר",             icon: home, click: ()=>goTo('/Project-files/'+ project.value._id) },
          {text:"ציוד",                  icon: home, click: ()=>goTo('/project-equipment/'+ project.value._id) },
          {text:"כלונסאות לקידוח",      icon: home, click: ()=>goTo('/pits-list/'+ project.value._id) },
          {text:"הזמנת הובלה",          icon: home, click: ()=>goTo('/machine-transportation/'+ project.value._id) },
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
    
          
      return {
         //methods
         goTo,
         //properties
         currentUser,
         project,
         project_id,

         buttons, 
      }
    }
  });
  </script>
  
  <style scoped>

  </style>