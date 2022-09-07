<template>

      
  
   <button @click="addfile">צור דוח</button>




</template>

<script lang="ts">
import { IonContent, IonPage,IonButton, IonItem } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'



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
const addfile = async ()=>{
    // Create a new PDFDocument
    pdfDoc.value = await PDFDocument.create()
    // Embed the Times Roman font
    const timesRomanFont = await pdfDoc.value.embedFont(StandardFonts.TimesRoman)
    // Add a blank page to the document
    const page = pdfDoc.value.addPage()
    // Get the width and height of the page
const { width, height } = page.getSize()

// Draw a string of text toward the top of the page
const fontSize = 30
let str = report?.date.toString() + "pdf"
page.drawText(str, {
  x: 50,
  y: height - 4 * fontSize,
  size: fontSize,
  font: timesRomanFont,
  color: rgb(0, 0.53, 0.71),
})

// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.value.save()
console.log(pdfBytes);


// For example, `pdfBytes` can be:
//   • Written to a file in Node
//   • Downloaded from the browser
//   • Rendered in an <iframe>
   
    
}
  
 
   return {
    //methods
    uploadNewFile,
    addfile,
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
