<template>
  <ion-page v-show="showComponent">
    <ion-content :fullscreen="true" >
    <AppHeader :str="'מסך בית'"/>
    <DescriptionCard :header="organization?.name" :subtitle="'ח.פ' + ' '+organization?.businessID"/>
    
  
    <div class="homeContainer">

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{'יצירת פרוייקט חדש'}}</ion-card-subtitle>
          <ion-card-title>{{'יצירת פרוייקט חדש'}}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button  router-link="/create-project" >{{'למעבר למסך יצירת פרוייקט חדש'}}</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{'רשימת פרוייקטים פתוחים'}}</ion-card-subtitle>
          <ion-card-title>{{'הפרוייקטים שלי'}}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button router-link="/projects">{{'למעבר למסך ניהול פרוייקטים'}}</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{'ניהול עובדים והוספת עובד חדש'}}</ion-card-subtitle>
          <ion-card-title>{{'העובדים שלי'}}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button router-link="/employees">{{'למעבר למסך ניהול עובדים'}}
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{'ניהול מכונות קידוח והוספת מכונה חדשה'}}</ion-card-subtitle>
          <ion-card-title>מכונות קידוח</ion-card-title>
        </ion-card-header>
       
        <ion-card-content>
          
          <ion-button router-link="/machines">{{'למעבר למסך ניהול מכונות קידוח'}}
          </ion-button>
        </ion-card-content>
      </ion-card>

    </div>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonIcon, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';

import AppHeader from '../Components/AppHeader.vue'
import DescriptionCard from '@/NewViews/Utilities/DescriptionCard.vue';




export default defineComponent({
  name: 'HomePage',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    AppHeader,
    DescriptionCard
},
  setup(){
    const router = useRouter();
   
    const {user , getOrganizationData} = useAppState(); 
    const currentUser = ref<any>(user)
    const showComponent = ref(false)
    const organization = ref<any>()
    
    onMounted(async()=>{
      
      if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
              
      else {
        organization.value = await getOrganizationData()
        console.log(organization.value);
        
        showComponent.value = true
      }
    });

     return {
       //properties
        currentUser,
        showComponent,
        organization,
        
  }
  },
 
});
</script>

<style scoped>
.homeContainer{
  display: block;
}
</style>
