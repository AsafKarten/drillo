<template>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div v-if="currentUser" class="header">
            <ion-button  v-if="showButtons" @click="$router.back()" color="dark">חזרה
              <IonIcon slot="start" :icon="arrowRedo" />
            </ion-button>
            <ion-button  v-if="showButtons" router-link="/" color="dark">מסך ראשי
              <IonIcon slot="start" :icon="home"/>
            </ion-button>
            <p class="headerText">מחובר: {{currentUser.customData.first}} {{currentUser.customData.last}}</p>
            <p class="headerText">מכונת קידוח: {{machine?.name}}</p>
            <!-- <p class="headerText">{{currentUser?.profile.email}} </p> -->
  
            <PWAbutton/>
            
            <ion-button  @click="userLogout" color="dark">{{"יציאה"}}
              <IonIcon slot="end" :icon="exit"/>
            </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>
  </template>
  
  <script lang="ts">
  import { IonHeader, IonToolbar, IonButton,IonIcon } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { arrowRedo, home, exit } from 'ionicons/icons';
  import { useRouter } from 'vue-router';
  import { useAppState } from '../realm-state';
  
  import PWAbutton from './PWAbutton.vue';
  
  export default defineComponent({
    name: 'DrillerAppHeader',
    components: {
      IonHeader,
      IonToolbar,
      IonButton,
      IonIcon,
      PWAbutton
    },
    props: {showButtons: Boolean, machine: Object },
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
  </style>