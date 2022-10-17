<template>
    <ion-page>
      <ion-content  :fullscreen="true" >
            <AppHeader :str="'ניהול מכונת קידוח'"/>
            <DescriptionCard :header="machine?.name" :subtitle="machine?.licens_number"/>
            <GridButtons :buttons="buttons" :options="{buttonHeight:110}"/>
      </ion-content>
   
    </ion-page>
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage } from '@ionic/vue';
  import { defineComponent, onMounted, ref, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import AppHeader from '../Components/AppHeader.vue'
  import DescriptionCard from './Utilities/DescriptionCard.vue';
  import GridButtons from './Utilities/GridButtons.vue';

  import { home } from 'ionicons/icons';

  
  

  
  
  export default defineComponent({
    name: 'MachineManagment',
    components: {
    IonContent,
    IonPage,
    AppHeader,
    DescriptionCard,
    GridButtons
},
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getDrillingMachineByID} = useAppState();
      const currentUser = ref<any>(user)
      const machine_id = ref<any>(route.params);
      const project = ref<any>();
      const machine = ref<any>()

        const buttons = reactive(
        [
          {text:"טיפולים",          icon: home, badge:{count: 3, color:"warning"} ,click: ()=>goTo('/machine-maintainance/'+ machine_id.value) },
          {text:"תדלוק וצריכת דלק",            icon: home, fill:"solid", color: "success", badge:{count: 591, color:"danger"} ,click: ()=>goTo('/machine-gas/'+ machine_id.value) },
           {text:"אישורים",          icon: home, click: ()=>goTo('/machine-certifications/'+ machine_id.value) },
          {text:"ביטוח",            icon: home, click: ()=>goTo('/machine-insurance/'+ machine_id.value) },
          {text:"טסט",         icon: home, click: ()=>goTo('/machine-test/'+ machine_id.value) },
          {text:"אבטחה",             icon: home, click: ()=>goTo('/machine-security/'+ machine_id.value) },
       
        ]
      );
      //BUTTON TEMPLATE: {index:Number/nothing, text:String, icon:Icon, fill:"solid"/"clear"/"outline", color:String, badge:{count:String/Number, color:String} ,click: ()=>Function },
      //IONIC COLORS: primary, secondary, tertiary, success, warning, danger, light, medium, dark

      
    


      onMounted(async()=>{
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
    
           machine.value =  await getDrillingMachineByID(machine_id.value)
       
    
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
         machine,
         machine_id,

         buttons, 

     

          
      }
    }
  });
  </script>
  
  <style scoped>
   
  </style>