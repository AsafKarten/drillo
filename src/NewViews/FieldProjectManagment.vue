<template>
    <ion-page>
      <ion-content :fullscreen="true" >

        <AppHeader :str="'ניהול פרוייקט שטח'"/>
        <DescriptionCard :header="project?.name" :subtitle="project?.address" :text="machine?.name"/>
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
    name: 'FieldProjectManagment',
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
      const {user , getProjectByID, getDrillingMachineByID} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>();
      const project = ref<any>();
      const machine_id = ref<any>()
      const machine = ref<any>()


     // const goTo = (route:any) => { router.push(route) }
      const buttons = reactive(
        [
          {text:"רשימת עובדים",          icon: home, badge:{count: 3, color:"warning"} ,click: ()=>goTo('/machine-crew/'+ machine_id.value) },
          {text:"הוספת עובד",            icon: home, fill:"solid", color: "success", badge:{count: 591, color:"danger"} ,click: ()=>goTo('/add-worker/'+ project.value._id) },
           {text:"ניהול מכונת קידוח",          icon: home, click: ()=>goTo('/machine-managment/'+ machine_id.value) },
          {text:"יומן עבודה",            icon: home, click: ()=>goTo('/work-diary/'+ project.value._id) },
          {text:"מפת אתר קידוח",         icon: home, click: ()=>goTo('/project-map/'+ project.value._id) },
          {text:"מסמכי אתר",             icon: home, click: ()=>goTo('/project-files/'+ project.value._id) },
          {text:"ציוד",                  icon: home, click: ()=>goTo('/project-tools/'+ project.value._id) },
          {text:"כלונסאות לקידוח",      icon: home, click: ()=>goTo('/pits-list/'+ project.value._id) },
          {text:"דוחות עבודה",           icon: home, click: ()=>goTo('/project-reports/'+ project.value._id) },
          {text:'קבל"נים חיצוניים',  icon: home, click: ()=>goTo('/constractor-list/'+ project.value._id) },
           {text:"הזמנת הובלה",          icon: home, click: ()=>goTo('/machine-transportation/'+ project.value._id) }, 
        ]
      );
      //BUTTON TEMPLATE: {index:Number/nothing, text:String, icon:Icon, fill:"solid"/"clear"/"outline", color:String, badge:{count:String/Number, color:String} ,click: ()=>Function },
      //IONIC COLORS: primary, secondary, tertiary, success, warning, danger, light, medium, dark


      onMounted(async()=>{
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
              
       
        project_id.value = currentUser?.value.customData.current_project.$oid
        project.value = await getProjectByID(project_id.value)
        machine_id.value = currentUser?.value.customData.machine_id.$oid
        machine.value = await getDrillingMachineByID(machine_id.value)
        console.log(machine_id.value);
        
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
         machine_id,
         machine,

         buttons, 
      }
    }
  });
  </script>
  
  <style scoped>

  </style>