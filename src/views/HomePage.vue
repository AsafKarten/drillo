<template>
  <ion-page v-show="showComponent">
    <ion-content :fullscreen="true" >
    <AppHeader :str="'מסך בית'"/>
    <DescriptionCard :header="organization?.name" :subtitle="'ח.פ' + ' '+organization?.businessID"/>
    
  
    <div class="homeContainer">

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>יצירת פרויקט חדש</ion-card-subtitle>
          <ion-card-title>פרויקט חדש</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button  router-link="/create-project" >פרויקט חדש</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>הפרוייקטים שלי</ion-card-subtitle>
          <ion-card-title>הפרוייקטים שלי</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button router-link="/projects">הפרוייקטים שלי</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>העובדים שלי</ion-card-subtitle>
          <ion-card-title>העובדים שלי</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button router-link="/employees">העובדים שלי
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>מכונות קידוח</ion-card-subtitle>
          <ion-card-title>מכונות קידוח</ion-card-title>
        </ion-card-header>
       
        <ion-card-content>
          
          <ion-button router-link="/machines">מכונות קידוח
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
      console.log(user);
      
      if(currentUser.value.customData.userType === 'driller')
          router.replace('/field-project-managment')
  
      else 
        organization.value = await getOrganizationData()
        console.log(organization.value);
        
        showComponent.value = true
      
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
