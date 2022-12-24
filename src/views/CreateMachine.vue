<template>
  <ion-page>
    <AppHeader :str="'יצירת מכונת קידוח'"/>
    <ion-content color="dark" :fullscreen="true">
    

      <div id="container">
     <ion-item color="dark">
          <ion-label position="floating">שם המכונה</ion-label>
       <ion-input v-model="machineName" type="text" autocomplete="off"></ion-input>
       </ion-item>
       <!-- <ion-item>
           <ion-label position="floating">סוג מכונה</ion-label>
       <ion-input v-model="machineType" type="text" autocomplete="new-last"></ion-input>
       </ion-item> -->
       <ion-item color="dark">
        <ion-label position="floating">מספר רישוי</ion-label>
       <ion-input v-model="licensNumber" type="text" autocomplete="off"></ion-input>
       </ion-item>
       <!--מספר רישוי-->

        

       
        <div style="padding-top: 6px">
            <ion-button shape="round" @click="createMachine" expand="full">צור מכונה</ion-button>
        </div>
           <div style="padding-top: 6px">
            <ion-button  shape="round" color="danger" @click="$router.back()" expand="full">ביטול </ion-button>
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
import AppHeader from '@/Components/AppHeader.vue';


  export default defineComponent({
    name: 'CreateMachine',
    components: {
    IonContent,
    IonPage,
    IonInput,
    IonLabel,
    IonItem,
    IonButton,
    AppHeader
},
    setup(){
      const currentUser = ref<any>();
      const organizationID = ref<any>();
      const machineName = ref("");
      const licensNumber = ref("");
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
         
          let machine_id = await createNewDrillingMachine(machineName.value,licensNumber.value)
          router.push('/machine/' + machine_id)
          
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
        licensNumber,
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

  ion-button {
    --background: #4DBA87;
    --background-hover: #9ce0be;
    --background-activated: #88f4be;
    --background-focused: #88f4be;
    
  
    --color: #fff;
  
  
    --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);
  
    --ripple-color: deeppink;
  
    --padding-top: 10px;
    --padding-bottom: 10px;
  
  }
  ion-spinner {
    --color: #54dc98;
  }
</style>