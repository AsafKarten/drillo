<template>

      
  
        <input
        type="file"
        v-on:change="addfile($event)"
        placeholder="Upload file"
        accept=".pdf"
      />
  
 
    
  </template>
  
  <script lang="ts">
  import { IonContent, IonPage,IonButton, IonItem } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter } from 'vue-router';
  import {useAppState} from '../realm-state';
  


  
  
  //this component need to ne delete
  
  export default defineComponent({
    name: 'UploadFile',
    components: {
      
  },
    setup(){
      const router = useRouter();
      const currentUser = ref<any>()
      const {user , logout,getAllEmployees} = useAppState();
      const employees = ref<any>()
      const organization = ref<any>()
   
      
    onMounted(async()=>{
      //add code or delete

      
    });
  
    const uploadNewFile = (file:any) => {
        console.log(file);
        
    }
    const addfile = (file:any)=>{
        console.log(file);
        
    }
      
     
       return {
        //methods
        uploadNewFile,
        addfile,
          //properties
          currentUser : user,
          employees:employees,
          organization:organization,

          
    }
    },
   
  });
  </script>
  
  <style scoped>
  .mainContainer{
    display: block;
    direction: rtl;
    
  }
  
  </style>
  