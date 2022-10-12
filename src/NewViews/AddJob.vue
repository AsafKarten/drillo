<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating">שם עסק הקבל"ן</ion-label>
        <ion-input v-model="contractorName" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">מקצוע</ion-label>
        <ion-input v-model="contractorType" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">ח.פ</ion-label>
        <ion-input v-model="businessID" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">ישוב/עיר</ion-label>
        <ion-input v-model="businessCity" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">רחוב</ion-label>
        <ion-input v-model="businessStreet" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">מספר</ion-label>
        <ion-input v-model="streetNumber" type="text"></ion-input>
      </ion-item>

      
      <ion-item>
        <ion-label position="floating">מספר טלפון</ion-label>
        <ion-input v-model="businessPhone" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating"> כתובת מייל</ion-label>
        <ion-input v-model="businessMail" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">סוג השירות</ion-label>
        <ion-input v-model="serviceType" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">מחיר</ion-label>
        <ion-input v-model="servicePrice" type="number"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">תאריך</ion-label> 
      </ion-item>
      <Datepicker v-model="serviceDate" multiDates></Datepicker>

      <ion-button @click="saveExJob">שמור</ion-button>
    </ion-content>
  </ion-page>
</template>
  
  <script lang="ts">
import {
  IonContent,
  IonPage,
  IonLabel,
  IonInput,
  IonButton,
  IonItem,
} from "@ionic/vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppState } from "../realm-state";

import Datepicker from "@vuepic/vue-datepicker";

import "@vuepic/vue-datepicker/dist/main.css";

export default defineComponent({
  name: "AddJob",
  components: {
    IonContent,
    IonPage,
    IonLabel,
    IonItem,
    IonInput,
    IonButton,
    Datepicker,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { user, getProjectByID } = useAppState();
    const currentUser = ref<any>(user);
    const project_id = ref<any>(route.params);
    const project = ref<any>();

    const businessID = ref("");
    const businessCity = ref("");
    const businessStreet = ref("");
    const streetNumber = ref(0);
    const businessPhone = ref("");
    const businessMail= ref("");
    const contractorType = ref("");
    const contractorName = ref("");
    const serviceType = ref("");
    const servicePrice = ref("");
    const serviceDate = ref();

    onMounted(async () => {
      if (currentUser?.value.customData.organizationID === undefined)
        router.push("Login");

      project.value = await getProjectByID(project_id.value);
      console.log(project.value);
    });

    const saveExJob = () => {
      const job = {
        businessID: businessID.value,
        businessCity: businessCity.value,
        businessStreet: businessStreet.value,
        streetNumber: streetNumber.value,
        businessPhone: businessPhone.value,
        businessMail : businessMail.value,
        contractorType: contractorType.value,
        contractorName: contractorName.value,
        serviceType: serviceType.value,
        servicePrice: servicePrice.value,
        serviceDate: serviceDate.value,
      };

      console.log(job);
    };

    return {
      //methods
      saveExJob,

      //properties
      currentUser,
      project,
      project_id,

      businessID,
      businessCity,
      businessStreet,
      streetNumber,
      businessPhone,
      businessMail,
      contractorType,
      contractorName,
      serviceType,
      servicePrice,
      serviceDate,
    };
  },
});
</script>
  
  <style scoped>
</style>