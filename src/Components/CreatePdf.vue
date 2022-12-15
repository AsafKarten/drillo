<template>
  <div ref="reportDiv" style="display:none;">
        <table style="direction:ltr; border-spacing: 10px; border-collapse: separate;">
          <thead>
            <tr>
              <th>Pit Name</th>
              <th>Status</th>
              <th>Depth</th>
              <th>Diameter</th>
              <th>X</th>
              <th>Y</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="pit.p" v-for="pit in report?.pits">
              <td>{{pit.p}}</td>
              <td>{{pit.status}}</td>
              <td>{{pit.depth}}</td>
              <td>{{pit.diameter}}</td>
              <td>{{pit.itm.x}}</td>
              <td>{{pit.itm.y}}</td>
            </tr>
          </tbody>
        </table>

        <div>
          <p>חתימה:</p>
          <p v-if="signatureName" direction="rtl">{{signatureName.split(' ').reverse().join('  ')}}</p> 
        </div>
  </div>

</template>

<script lang="ts">
import { IonInput, IonLabel ,IonItem,IonButton } from '@ionic/vue';

import { defineComponent, onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import pdfMake from 'pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import hebrewFonts from './vfs_fonts.js';

import Vue3Signature from "vue3-signature"


//this component need to ne delete
/* eslint-disable */
export default defineComponent({
  name: 'CreatePDF',
  components: {Vue3Signature, IonInput, IonLabel, IonItem, IonButton},
  props:{report:Object, signatureImage:String, signatureName:String},
  setup(props){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout,getAllEmployees} = useAppState();

    const reportDiv = ref();

    const generatePDF = function ({save = true}) {
      const d = new Date(Date.parse(props.report?.date));
      const reportDateString = `${d.getDay()}_${d.getMonth()}_${d.getFullYear()} ${d.getHours()}_${d.getMinutes()}`;
      const signatureHtmlObject = props.signatureImage?("<img width='300px' height='200px' src=" + props.signatureImage + "/> "):""
      const html = htmlToPdfmake(reportDiv.value.innerHTML + signatureHtmlObject);
      const documentDefinition = { content: html, defaultStyle: {font: 'assistant'} };

      pdfMake.fonts = {
        assistant: {
          normal: 'Assistant-Regular.ttf',
          bold: 'Assistant-Regular.ttf',
        }
      }

      pdfMake.vfs = hebrewFonts; //pdfFonts.pdfMake.vfs;
      const pdfFile = pdfMake.createPdf(documentDefinition);
      if(save) pdfFile.download("Drillo Report " + reportDateString + ".pdf");
      //other methods: https://pdfmake.github.io/docs/0.1/getting-started/client-side/methods/
      return pdfFile;
    }

    onMounted(async()=>{
      //add code or delete
    });


    return {
      //methods
      generatePDF,
      //properties
      reportDiv,
    }
  }
});


</script>

<style scoped>

</style>
