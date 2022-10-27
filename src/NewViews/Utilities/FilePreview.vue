<template>
  <div>
    <ion-card>
      <ion-thumbnail v-if="filePreview">
        <img :src="filePreview"/>
      </ion-thumbnail>
      <ion-thumbnail v-else>
        <ion-skeleton-text :animated="loading"></ion-skeleton-text>
      </ion-thumbnail>
    </ion-card>
<!--
    <ion-item>
      <embed v-if="uploadedFilePreview"
        :src="uploadedFilePreview"
        width="100%"
        height="500"
      />
    </ion-item>
-->
  </div>
</template>
  
<script lang="ts">
  import { IonCard, IonSkeletonText, IonThumbnail } from '@ionic/vue';
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import {fileHosting} from '../../FileHosting';

  export default defineComponent({
    name: 'FilePreview',
    components: { IonCard, IonSkeletonText, IonThumbnail },
    props: { file:Blob, fileID:String },
    emits: ['fileLoaded'],
    setup(props, {emit} ){

      onMounted(async()=>{ 

        watch( [()=>props.fileID, ()=>props.file], async([newFileID, newFile])=> {
          if(newFileID)
          { //get file thumnail from mongo by fileID
            let thumbnail = await getFileThumbnail(newFileID);
            if(thumbnail) filePreview.value = thumbnail;
          }
          else if (newFile)
          { //create file thumbnail from the file itself
            const fileType = newFile.type;
            if(fileType=='application/pdf')
              filePreview.value = await fileHosting().makePDFthumbnail(URL.createObjectURL(newFile));
            else if(fileType?.startsWith('image'))
              filePreview.value = URL.createObjectURL(newFile);
          }
        })

      });

      const loading = ref<boolean>(false)
      const message = ref<string>()
      const loadedFile = ref<any>()
      const loadedThumbnail = ref<any>()
      const filePreview = ref<any>()
      const uploadedFilePreview = ref<any>()

      const getFileThumbnail = async (fileID:string) => {
        loading.value = true;
        loadedThumbnail.value = await fileHosting().getFileThumbnail(fileID);
        loading.value = false;
        return loadedThumbnail.value;
      }

      const getFilefromServer = async (fileID:string) => {
        loading.value = true;
        loadedFile.value = await fileHosting().getFile(fileID.toString());
        uploadedFilePreview.value = loadedFile.value.content;
        emit('fileLoaded', fileID);
        loading.value = false;
      }

    
          
      return {
        loadedFile,
       // loadedThumbnail,
        filePreview,
        uploadedFilePreview,
        loading,
        message
      }
    }
  });
  </script>
  
  <style scoped>
    ion-thumbnail {
      --size: auto;
      --border-radius: 6px;
      padding: 10px;
    }
  </style>