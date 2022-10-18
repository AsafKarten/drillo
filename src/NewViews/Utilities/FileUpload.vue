<template>
  <div>
    <ion-item>
      <ion-input type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" @change="fileChanged"/>
      {{ message }}
      <ion-button slot="end" @click="uploadFile" :disabled="uploading||!selectedFile">העלאה</ion-button>
    </ion-item>

    <ion-item>
      <img v-if="selectedFilePreview"
        :src="selectedFilePreview"
        width="300"
        height="300"
      />
    </ion-item>

    <ion-item>
      <embed v-if="uploadedFilePreview"
        :src="uploadedFilePreview"
        width="100%"
        height="500"
      />
    </ion-item>

  </div>
</template>
  
<script lang="ts">
  import { IonInput, IonButton, IonItem } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import {fileHosting} from '../../FileHosting';

  export default defineComponent({
    name: 'FileUpload',
    components: {IonInput, IonButton, IonItem},
    props: {originID:Object, projectID:Object },
    emits: ['fileUploaded'],
    setup(props, {emit} ){

      onMounted(async()=>{ return; });

      const uploading = ref<boolean>(false)
      const message = ref<string>()
      const selectedFile = ref<any>()
      const selectedFilePreview = ref<any>()
      const uploadedFilePreview = ref<any>()

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

          console.log("File uploaded. here it is from the server:")
          let file = await fileHosting().getFile(fileID.toString());
          uploadedFilePreview.value = file.content;
        }
      }

    
          
      return {
        fileChanged,
        uploadFile,
        selectedFile,
        selectedFilePreview,
        uploadedFilePreview,
        uploading,
        message
      }
    }
  });
  </script>
  
  <style scoped>

  </style>