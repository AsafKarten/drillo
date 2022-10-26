<template>
  <div>
    <ion-item>
      <ion-input type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" @change="fileChanged"/>
      {{ message }}
      <ion-button slot="end" @click="uploadFile" :disabled="uploading||!selectedFile">העלאה</ion-button>
    </ion-item>

    <FilePreview v-if="withPreview" :fileID="uploadedFileID" :file="selectedFile"/>
<!--
    <ion-item>
      <img v-if="uploadedFilePreview"
        :src="uploadedFilePreview"
        width="300" height="300"
      />
    </ion-item>

    <ion-item>
      <embed v-if="uploadedFilePreview"
        :src="uploadedFilePreview"
        width="100%" height="500"
      />
    </ion-item>
-->

  </div>
</template>
  
<script lang="ts">
  import { IonInput, IonButton, IonItem } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import {fileHosting} from '../../FileHosting';
  import FilePreview from './FilePreview.vue';

  export default defineComponent({
    name: 'FileUpload',
    components: {IonInput, IonButton, IonItem, FilePreview},
    props: {originID:Object, projectID:Object, withPreview:Boolean },
    emits: ['fileUploaded'],
    setup(props, {emit} ){

      onMounted(async()=>{ return; });

      const uploading = ref<boolean>(false)
      const message = ref<string>()
      const selectedFile = ref<any>()
      const selectedFilePreview = ref<any>()
      const uploadedFilePreview = ref<any>()

const uploadedFileID = ref<any>()

      const fileChanged = async (event:any) => {
        selectedFile.value = event.target.files[0];
        selectedFilePreview.value = undefined;
         message.value = "";
        if(event.target.files[0])
        {
          const fileSize = selectedFile.value?.size;
          const fileType = selectedFile.value?.type;
          if(fileSize > 15*1024*1024)
            message.value = "לא ניתן להעלות קבצים גדולים מ-15MB";
          else if(fileType=='application/pdf')
            selectedFilePreview.value = await fileHosting().makePDFthumbnail(URL.createObjectURL(selectedFile.value));
          else if(fileType?.startsWith('image'))
            selectedFilePreview.value = URL.createObjectURL(selectedFile.value);
        }
      }

      const uploadFile = async () => {
        if(selectedFile.value)
        {
          uploading.value = true;
          let fileID = await fileHosting().uploadFile(selectedFile.value, props.originID||{}, props.projectID||{} )
          emit('fileUploaded', fileID);
          uploading.value = false;

          uploadedFileID.value = fileID.toString();
          /* let file = await fileHosting().getFile(fileID.toString());
          uploadedFilePreview.value = file.content; */
        }
      }

    
          
      return {
        fileChanged,
        uploadFile,
        selectedFile,
        selectedFilePreview,
        uploadedFilePreview,
        uploading,
        message,

        uploadedFileID
      }
    }
  });
  </script>
  
  <style scoped>

  </style>