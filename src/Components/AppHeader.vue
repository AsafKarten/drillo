<template>
  <ion-header :translucent="true">
    <ion-toolbar color="dark">
      <ion-buttons slot="start">
        <ion-back-button text="" default-href="/" @click="$router.back()"> </ion-back-button> 
      </ion-buttons> 
      <ion-buttons class="home" slot="start">
        <ion-back-button text="" :icon="home" default-href="/" @click="goToHome"> </ion-back-button> 
      </ion-buttons> 
      <p class="pageName">{{str}}</p>
      <ion-buttons slot="end">
        <ion-back-button text="יציאה" :icon="exit" default-href="/" @click="userLogout">{{'יציאה'}} </ion-back-button> 
        <!-- <ion-menu-button @click="userLogout" auto-hide="false"></ion-menu-button> -->
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar>
      <div v-if="currentUser" class="header">
         
          <p class="headerText">{{greeting}} {{currentUser.customData.first}} {{currentUser.customData.last}}</p>
        

          
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

//import PWAbutton from './PWAbutton.vue';

export default defineComponent({
  name: 'AppHeader',
  components: {
    IonHeader,
    IonToolbar,
    IonButtons, 
    //IonMenuButton, 
    IonBackButton,
    //PWAbutton
  },
  props: {str:String },
  setup(){
    const router = useRouter();
    
    const {user , logout} = useAppState();
    const currentUser = ref<any>(user)
    const greeting = ref('')


    onMounted(async()=>{
      getGreeting()
    });

    const getGreeting = ()=>{
        let now = new Date()
        if(now.getHours() >= 4 && now.getHours() <= 10 ){
          greeting.value = 'בוקר טוב'
          return
        }
        if(now.getHours() >= 11 && now.getHours() <= 14 ){
          greeting.value = 'צהריים טובים'
          return
        }
        if(now.getHours() >= 15 && now.getHours() <= 17 ){
          greeting.value = 'אחר צהריים טובים'
          return
        }
        if(now.getHours() >= 18 && now.getHours() <= 20 ){
          greeting.value = 'ערב טוב'
          return
        }
        if(now.getHours() >= 21 && now.getHours() <= 23 || now.getHours() >= 0 && now.getHours() <= 3 ){
          greeting.value = 'לילה טוב'
          return
        }
    }

    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
    }

    const goToHome = ()=>{
      if(currentUser?.value.customData.userType === 'driller'){
              router.push("/field-project-managment");
              return
      }
      if(currentUser?.value.customData.userType === 'manager'){
             router.push("/home");
             return
            }
    }
    
    return {
      //methods
      userLogout,
      goToHome,
      getGreeting,

      //properties
      currentUser,
      greeting,

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