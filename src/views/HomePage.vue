<template>
  <ion-page class="back" v-show="showComponent">
    <ion-content  :fullscreen="true" >
    <AppHeader :str="'מסך בית'"/>
    <!-- <DescriptionCard :header="organization?.name" :subtitle="'ח.פ' + ' '+organization?.businessID"/> -->
    
  
    <div class="homeContainer">

      <ion-card >
        <ion-card-header>
          <ion-card-title>{{'יצירת פרוייקט חדש'}}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button shape="round"  router-link="/create-project" >{{'ליצירת פקרוייט חדש לחץ כאן'}}</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card >
        <ion-card-header>
         
          <ion-card-title>{{'רשימת פרוייקטים פתוחים'}}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button shape="round" router-link="/projects">{{' ניהול פרוייקטים לחץ כאן'}}</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card >
        <ion-card-header>
          <ion-card-title>{{'ניהול עובדים והוספת עובד חדש'}}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-button shape="round" router-link="/employees">{{'ניהול עובדים לחץ כאן'}}
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card >
        <ion-card-header>
          <ion-card-title>{{'ניהול מכונות קידוח והוספת מכונה חדשה'}}</ion-card-title>
        </ion-card-header>
       
        <ion-card-content>
          
          <ion-button shape="round" router-link="/machines">{{' ניהול מכונות קידוח לחץ כאן'}}
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
    //IonCardSubtitle,
    IonCardTitle,
    AppHeader,
   // DescriptionCard
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
  padding-top: 2%;
  padding-bottom: 2%;
}

ion-button {
  --background: #4DBA87;
  --background-hover: #9ce0be;
  --background-activated: #88f4be;
  --background-focused: #88f4be;
  

  --color: #fff;

  --border-radius: 10px;
  --border-color: #4DBA87;
  --border-style: solid;
  --border-width: 2px;

  --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);

  --ripple-color: deeppink;

  --padding-top: 10px;
  --padding-bottom: 10px;

}
</style>
