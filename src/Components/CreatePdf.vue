<template>
  <button @click="generatePDF">צור דוח</button>
  <button @click="getReportDiv">דבג דוח</button>

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

  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import pdfMake from 'pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


/* eslint-disable */
export default defineComponent({
  name: 'UploadFile',
  components: {},
  props:{report:Object},
  setup(props){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout,getAllEmployees, uploadFile} = useAppState();

    const reportDiv = ref();

    const generatePDF = function () {
      const d = new Date(Date.parse(props.report?.date));
      const reportDateString = `${d.getDay()}_${d.getMonth()}_${d.getFullYear()} ${d.getHours()}_${d.getMinutes()}`;
      const html = htmlToPdfmake(reportDiv.value.innerHTML);
      const documentDefinition = { content: html };
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      pdfMake.createPdf(documentDefinition).download("Drillo Report " + reportDateString + ".pdf");
    }

    const getReportDiv = function() {
      console.log("reportDiv.value")
      console.log(reportDiv.value.innerHTML)
    }

    onMounted(async()=>{
      //add code or delete
    });

    return {
      //methods
      generatePDF,
      getReportDiv,

      //properties
      reportDiv
    }
  }
});


</script>

<style scoped>
.mainContainer{
display: block;
direction: rtl;
}
</style>
