<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">יצירת עובד חדש</ion-title>
        </ion-toolbar>
      </ion-header>
     
      <div id="container"> 
        <h1>יצירת עובד חדש</h1>
        <h3>לאחר סיום יצירת עובד חדש המערכת תתנתק ויהיה צורך להתחבר מחדש!</h3>
     <ion-item>
          <ion-label position="floating">First Name</ion-label>
       <ion-input v-model="first" type="text" autocomplete="new-first"></ion-input>
       </ion-item>
       <ion-item>
           <ion-label position="floating">Last Name</ion-label>
       <ion-input v-model="last" type="text" autocomplete="new-last"></ion-input>
       </ion-item>
       <ion-item>
        <ion-label position="floating">Email</ion-label>
       <ion-input v-model="email" type="text" autocomplete="new-email"></ion-input>
       </ion-item>
        <ion-item>
        <ion-label position="floating">Password</ion-label>
       <ion-input v-model="password" type="text" autocomplete="new-password"></ion-input>
       </ion-item>
       <ion-item>
             <ion-select :compareWith="employeeTypes"
        @ionChange="employeeType = JSON.stringify($event.detail.value)" placeholder="סוג עובד">
        <ion-select-option value="driller">קודח</ion-select-option>
        <ion-select-option value="manager">מנהל מערכת</ion-select-option>
        <ion-select-option value="site manager">מנהל עבודה חיצוני</ion-select-option>
      </ion-select>

       </ion-item>
       
        <div style="padding-top: 6px">
            <ion-button @click="createEmployeeAccountEmailPassword" expand="full">צור עובד</ion-button>
        </div>
           <div style="padding-top: 6px">
            <ion-button @click="$router.back()" expand="full">Cancel </ion-button>
        </div>
       
      </div>
      <p v-if="error">{{error.errorCode}}{{error.error}}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonInput, IonLabel ,IonItem,IonButton, IonSelect, IonSelectOption } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  
  import { useRouter } from 'vue-router';

  import { useAppState } from '@/realm-state';
  export default defineComponent({
    name: 'CreateEmployee',
    components: {
      IonContent,
      IonHeader,
      IonPage,
      IonTitle,
      IonToolbar,
      IonInput,
      IonLabel,
      IonItem,
      IonButton, 
      IonSelect, 
      IonSelectOption
    },
    setup(){
      const currentUser = ref<any>();
      const organizationID = ref<any>();
      const email = ref("");
      const password = ref("");
      const first = ref("");
      const last = ref("");
      const employeeType = ref("")
      const error = ref<any>({});
      const employeeTypes = ref(["driller", "manager", "site manager"]);

      const router = useRouter();

      const {user,logout, createEmployeeAccount} = useAppState();

       onMounted(async()=>{
        organizationID.value = user.value.customData.organizationID
       });
     
      const createEmployeeAccountEmailPassword = async()=>{
        try {
          //Create user
          console.log(employeeType.value , organizationID.value);
          
          await createEmployeeAccount(email.value, password.value, first.value , last.value, employeeType.value , organizationID.value)
          await userLogout()
        } catch (err) {
          console.error("Failed to log in", err)
          error.value = err;
        }
      }

       const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
    }
      
      
      return{ 
        //methods
        createEmployeeAccountEmailPassword,
        //properties
        currentUser:user,
        organizationID,
        email,
        password,
        first,
        last,
        employeeType,
        employeeTypes,
        error
      }
    }
  });
</script>

<style scoped>
  #container {
    text-align: center;

    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  #container strong {
    font-size: 20px;
    line-height: 26px;
  }

  #container p {
    font-size: 16px;
    line-height: 22px;

    color: #8c8c8c;

    margin: 0;
  }

  #container a {
    text-decoration: none;
  }
</style>