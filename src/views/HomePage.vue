<template>
  <ion-page v-show="showComponent">
    <ion-header :translucent="true">
      <ion-toolbar>
        <div v-if="currentUser" class="header">
      <p class="headerText">{{currentUser.customData.first}} {{currentUser.customData.last}}</p>
       <p class="headerText">{{currentUser?.profile.email}} </p>
      <ion-button class="headerButton" @click="userLogout">יציאה</ion-button>
    </div>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true" >
  
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
      <ion-button router-link="/employees">העובדים שלי</ion-button>
    </ion-card-content>
  </ion-card>

    <ion-card>
    <ion-card-header>
      <ion-card-subtitle>מכונות קידוח</ion-card-subtitle>
      <ion-card-title>מכונות קידוח</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-button router-link="/machines">מכונות קידוח</ion-button>
    </ion-card-content>
  </ion-card>
    </div>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import {useAppState} from '../realm-state';






export default defineComponent({
  name: 'HomePage',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonCard,
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
   
},
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout} = useAppState();
    const showComponent = ref(false)
    
  onMounted(async()=>{
    if(user.value.customData.userType === 'driller')
        router.replace('/driller-view')
    else if(user.value.customData.userType === 'site manager')
        router.replace('/daily-report')
    else
      showComponent.value = true
    
  });

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }
     return {
        userLogout,
        currentUser : user,
        showComponent:showComponent,
        
  }
  },
 
});
</script>

<style scoped>
.homeContainer{
  display: block;
  direction: rtl;
  
}

.header{
  display: flex;
  flex-direction: row;
  width: 100%;
  align-content: space-between;
  font-size: 20px;
 
}
.headerText {
  padding-left: 2%;
}
.headerButton{
  padding-left: 2%;
}

</style>
