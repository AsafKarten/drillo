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
import proj4 from 'proj4'
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
              proj4.defs('EPSG:2039', '+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs');
        // WGS84
              proj4.defs('EPSG:4326', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');

        var pits= []
        for(i = 0 ; i < arraylist.length ; i++){
            let p = arraylist[i].p;
            let itm = {x : arraylist[i].x , y : arraylist[i].y }
            const [long, lat] = proj4(proj4('EPSG:2039'), proj4('EPSG:4326'), [itm.x, itm.y]);
            pits[i]= {p:p , itm:itm , coordinates: {long:long,lat:lat}}
        }
        console.log(pits);
      };
    },
  },
};
</script>

<style>
</style>