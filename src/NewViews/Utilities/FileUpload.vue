<template>
  <div>
    <input ref="selectFile" type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" @change="fileChanged">
    <input type="submit" @click="uploadFile">

    <img v-show="selectedFile"
      ref="filePreview" 
      src=""
      width="300"
      height="300"
    />


    <img
      ref="uploadedFilePreview" 
      src=""
      width="100"
      height="100"
    />

  </div>
</template>
  
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import {fileHosting} from '../../FileHosting';

  export default defineComponent({
    name: 'FileUpload',
    props: {originID:Object, projectID:Object },
    setup(props){

      onMounted(async()=>{ return; });

      const selectFile = ref<any>()
      const filePreview = ref<any>()
      const selectedFile = ref<any>()
      const uploadedFilePreview = ref<any>()

      const fileChanged = (event:any) => {
        let file = event.target.files[0];
        if(file)
        {
          filePreview.value.src = URL.createObjectURL(file);
          selectedFile.value = file;
          //console.log( { file: file, object: URL.createObjectURL(file), type: file.type })
        }
      }

      const uploadFile = async () => {
        if(selectedFile.value)
        {
          let fileID = await fileHosting().uploadFile(selectedFile.value, props.originID||{}, props.projectID||{})
          let file = await fileHosting().getFile(fileID.toString());
          //console.log("File uploaded. here it is from the server:")
          //console.log(file)
          //console.log(file.content)
          uploadedFilePreview.value.src = file.content;
        }
      }

    
          
      return {
         selectFile,
         filePreview,
         fileChanged,
         uploadFile,
         selectedFile,
         uploadedFilePreview
      }
    }
  });
  </script>
  
  <style scoped>

  </style>