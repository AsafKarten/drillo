<template>
  <div class="hello">
    <div>
      <input
        type="file"
        v-on:change="addfile($event)"
        placeholder="Upload file"
        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
export default {
  name: "ExcelComponent",
  data: function () {
    return {
      file: File,
      arrayBuffer: null,
      filelist: null,
    };
  },
  methods: {
    addfile(event) {
      this.file = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.file);
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = [];
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        //console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.filelist = [];
        //console.log(this.filelist);

        var pits= []
        for(i = 0 ; i < arraylist.length ; i++){
            let p = arraylist[i].p;
            let itm = {x : arraylist[i].x , y : arraylist[i].y }
            pits[i]= {p:p , itm:itm , coordinates: {}}
        }
        console.log(pits);
      };
    },
  },
};
</script>

<style>
</style>