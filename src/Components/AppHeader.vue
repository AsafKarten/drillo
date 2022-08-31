<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <div v-if="currentUser" class="header">
          <ion-button v-if="showButtons" @click="$router.back()" size="small" color="tertiary">חזרה</ion-button>
          <ion-button v-if="showButtons" router-link="/" size="small" color="tertiary">מסך ראשי</ion-button>
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
  props: {showButtons: Boolean },
  setup(){
    const router = useRouter();
    const currentUser = ref<any>()
    const {user , logout} = useAppState();
    const userType = ref<any>()
    
    onMounted(async()=>{
      userType.value = user.value.customData.userType
    });

    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
    }
    
    return {
      userLogout,
      currentUser : user,
      userType:userType,
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