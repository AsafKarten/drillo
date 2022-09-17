<template>
  <button @click="generatePDF">צור דוח</button>
  <button @click="getReportDiv">דבג דוח</button>


<div>
  <Vue3Signature  ref="signature1" :sigOption="state.option" :w="'1280px'" :h="'400px'"
                 :disabled="state.disabled" class="example"></Vue3Signature>
  <button @click="save('image/jpeg')">Save</button>
  <button @click="clear">Clear</button>
  <button @click="undo">Undo</button>
  <button @click="addWaterMark">addWaterMark</button>
  <button @click="handleDisabled">disabled</button>
</div>

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
import { defineComponent, onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import pdfMake from 'pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import Vue3Signature from "vue3-signature"

/* eslint-disable */
export default defineComponent({
  name: 'UploadFile',
  components: {Vue3Signature},
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







    //SIGNATURE PAD

    const state = reactive({
      count: 0,
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)"
      },
      disabled: false
    })

    const signature1 = ref(Vue3Signature)
    const save = (t:String) => { console.log(signature1.value.save(t)) }
    const clear = () => { signature1.value.clear() }
    const undo = () => { signature1.value.undo(); }
    const handleDisabled = () => { state.disabled = !state.disabled }
    const addWaterMark = () => { signature1.value.addWaterMark({
        text: "mark text",          // watermark text, > default ''
        font: "20px Arial",         // mark font, > default '20px sans-serif'
        style: 'all',               // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill
        fillStyle: "red",           // fillcolor, > default '#333'
        strokeStyle: "blue",	       // strokecolor, > default '#333'
        x: 100,                     // fill positionX, > default 20
        y: 200,                     // fill positionY, > default 20
        sx: 100,                    // stroke positionX, > default 40
        sy: 200                     // stroke positionY, > default 40
    }); }



    return {
      //methods
      generatePDF,
      getReportDiv,

      //properties
      reportDiv,


      //SIGNATURE PAD
      signature1, state,
      save, clear, undo, handleDisabled, addWaterMark
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
