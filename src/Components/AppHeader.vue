<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <div v-if="currentUser" class="header">
          <ion-button @click="$router.back()" size="small" color="tertiary">חזרה</ion-button>
          <p class="headerText">{{currentUser.customData.first}} {{currentUser.customData.last}}</p>
          <p class="headerText">{{currentUser?.profile.email}} </p>
          <ion-button @click="userLogout" color="Secondary">יציאה</ion-button>
          
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonToolbar, IonButton } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';
import { useAppState } from '../realm-state';

export default defineComponent({
  name: 'AppHeader',
  components: {
    IonHeader,
    IonToolbar,
    IonButton
  },
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout} = useAppState();
    
    /*onMounted(async()=>{
    });*/

    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
    }
    
    return {
      userLogout,
      currentUser : user,
    }
  }
});
</script>

<style scoped>
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