<template>
  <ion-header :translucent="true">
    <ion-toolbar color="dark">
      <ion-buttons slot="start">
        <ion-back-button text="" default-href="/" @click="$router.back()"> </ion-back-button> 
      </ion-buttons> 
      <ion-buttons class="home" slot="start">
        <ion-back-button text="" :icon="home" default-href="/" @click="$router.replace('/')"> </ion-back-button> 
      </ion-buttons> 
      <p class="pageName">{{str}}</p>
      <ion-buttons slot="end">
        <ion-menu-button @click="userLogout" auto-hide="false"></ion-menu-button>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar>
      <div v-if="currentUser" class="header">
         
          <p class="headerText">בוקר טוב  {{currentUser.customData.first}} {{currentUser.customData.last}}</p>
        

          <PWAbutton/>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonToolbar, IonButton,IonIcon , IonButtons, IonMenuButton , IonBackButton, IonTitle } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { arrowRedo, home, exit } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useAppState } from '../realm-state';

import PWAbutton from './PWAbutton.vue';

export default defineComponent({
  name: 'AppHeader',
  components: {
    IonHeader,
    IonToolbar,
    IonButtons, 
    IonMenuButton, 
    IonBackButton,
    PWAbutton
  },
  props: {str:String },
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout} = useAppState();
    const userType = ref<any>();

    onMounted(async()=>{
      userType.value = user.value.customData.userType;
    });

    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
    }
    
    return {
      //methods
      userLogout,

      //properties
      currentUser : user,
      userType:userType,

      //icons
      arrowRedo,
      home,
      exit,
    }
  }
});
</script>

<style scoped>
.header{
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  font-size: 16px;
 
}
.headerText {
  padding-left: 2%;
}
.headerButtons{
  margin-top: 1%;
  margin-left: 2px;
  margin-right: 2px;
}
.home{
  margin-right: 5%;
  
}
.pageName{
  margin-right: 10%;
}
</style>