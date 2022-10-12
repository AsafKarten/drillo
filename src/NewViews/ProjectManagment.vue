<template>
    <ion-page>
      <ion-content :fullscreen="true" >

        <GridButtons :buttons="buttons" :options="{buttonHeight:150}"/>

      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage } from '@ionic/vue';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import GridButtons from './Utilities/GridButtons.vue';
  
  
  import { home } from 'ionicons/icons';
  
  
  export default defineComponent({
    name: 'ProjectManagment',
    components: {
       IonContent,
       IonPage,
       GridButtons
    },
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>(route.params);
      const project = ref<any>();


      const goTo = (route:any) => { router.push(route) }
      const buttons = reactive(
        [
          {text:"רשימת עובדים",         icon: home, badge:{count: 3, color:"warning"} ,click: ()=>goTo('/WorkersView/') },
          {text:"הוספת עובד",           icon: home, fill:"solid", color: "success", badge:{count: 591, color:"danger"} ,click: ()=>goTo('/create-employee/') },
          {text:"הוספת עבודה חיצונית", icon: home, click: ()=>goToAddJob() }
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

      const goToAddJob =()=>{
        router.push('/add-job/'+ project.value._id)
    }
    
          
      return {
         //methods
         goToAddJob,
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