<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">הוספת מכונת קידוח חדשה</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
     <ion-item>
          <ion-label position="floating">שם המכונה</ion-label>
       <ion-input v-model="machineName" type="text" autocomplete="new-first"></ion-input>
       </ion-item>
       <ion-item>
           <ion-label position="floating">סוג מכונה</ion-label>
       <ion-input v-model="machineType" type="text" autocomplete="new-last"></ion-input>
       </ion-item>
       <ion-item>
        <ion-label position="floating">דגם</ion-label>
       <ion-input v-model="machineModel" type="text" autocomplete="new-email"></ion-input>
       </ion-item>
       <UploadFileVue/>

        
     
       <!-- <ion-item>
             <ion-select :compareWith="employeeTypes"
        @ionChange="employeeType = JSON.stringify($event.detail.value)" placeholder="סוג עובד">
        <ion-select-option value="driller">קודח</ion-select-option>
        <ion-select-option value="manager">מנהל מערכת</ion-select-option>
        <ion-select-option value="site manager">מנהל עבודה חיצוני</ion-select-option>
      </ion-select>

       </ion-item> -->
       
        <div style="padding-top: 6px">
            <ion-button @click="createMachine" expand="full">צור מכונה</ion-button>
        </div>
           <div style="padding-top: 6px">
            <ion-button @click="$router.back()" expand="full">Cancel </ion-button>
        </div>
       
      </div>
      <p v-if="error">{{error.errorCode}}{{error.error}}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonInput, IonLabel ,IonItem,IonButton, IonSelect, IonSelectOption } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  
  import { useRouter } from 'vue-router';

  import { useAppState } from '@/realm-state';

  import UploadFileVue from '@/Components/UploadFile.vue';

  export default defineComponent({
    name: 'CreateMachine',
    components: {
      IonContent,
      IonHeader,
      IonPage,
      IonTitle,
      IonToolbar,
      IonInput,
      IonLabel,
      IonItem,
      IonButton, 
      UploadFileVue,
 
    },
    setup(){
      const currentUser = ref<any>();
      const organizationID = ref<any>();
      const machineName = ref("");
      const machineType = ref("");
      const machineModel = ref("");
      
      //const employeeType = ref("")
      const error = ref<any>({});
      //const employeeTypes = ref(["driller", "manager", "site manager"]);

      const router = useRouter();

      const {user,logout, createNewDrillingMachine} = useAppState();

       onMounted(async()=>{
        if(user?.value.customData.organizationID === undefined)
          router.push('Login')
          
        organizationID.value = user.value.customData.organizationID
       });
     
      const createMachine = async()=>{
        try {
         
          await createNewDrillingMachine(machineName.value,machineType.value,machineModel.value , organizationID.value)
          router.replace('/machines')
        } catch (err) {
          console.error("Failed to add new drilling machine", err)
          error.value = err;
        }
      }
      
      
      return{ 
        //methods
        createMachine,
        //properties
        currentUser:user,
        organizationID,
        machineModel,
        machineName,
        machineType,
        //employeeType,
        //employeeTypes,
        error
      }
    }
  });
</script>

<style scoped>
  #container {
    text-align: center;

    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  #container strong {
    font-size: 20px;
    line-height: 26px;
  }

  #container p {
    font-size: 16px;
    line-height: 22px;

    color: #8c8c8c;

    margin: 0;
  }

  #container a {
    text-decoration: none;
  }
</style>