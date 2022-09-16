<template>

      
  
   <button>צור דוח</button>




</template>

<script lang="ts">
import { IonContent, IonPage,IonButton, IonItem } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'





/* eslint-disable */
export default defineComponent({
name: 'UploadFile',
components: {
  //IonContent,
  //IonPage,
  //IonButton,
  //IonItem,
  //AppHeader
},
props:{report:Object},
setup(props){
  const router = useRouter();
  const currentUser = ref<any>()
  const {user , logout,getAllEmployees, uploadFile} = useAppState();
  const employees = ref<any>()
  const organization = ref<any>()
  const pdfDoc = ref<any>()
const report = props.report

  
onMounted(async()=>{
  //add code or delete
   
  
});

const uploadNewFile =async (file:any) => {
    console.log(file);
    
}

  
 
   return {
    //methods
    uploadNewFile,
      //properties
      currentUser : user,
      employees:employees,
      organization:organization,
      pdfDoc:pdfDoc,
      
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
