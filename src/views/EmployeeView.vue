<template>
  <ion-page>
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
  
   
      <h1>Employee View</h1>
      <p>This page is under constructions</p>
      <div>
        <p>{{employee?.name}}</p>
        <p>{{employee_id}}</p>
        
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar,IonButton } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';






export default defineComponent({
  name: 'EmployeeView',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
   
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout,getProjectByID} = useAppState();
    const employee_id = ref<any>(route.params);
    const employee = ref<any>();
    const {id} = route.params
    
  onMounted(async()=>{
   console.log(employee_id.value);
   console.log(route.params);
   console.log(id);
   
  });

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }

   
     return {
        userLogout,
        currentUser : user,
        employee:employee,
        employee_id:employee_id,
        id:id
        
  }
  },
 
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