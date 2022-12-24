<template>
  <ion-page>
    <AppHeader :str="'יצירת עובד חדש'"/>
    <ion-content color="dark" :fullscreen="true">
    
      <div id="container"> 
       
       
     <ion-item  color="dark" >
          <ion-label position="floating">שם פרטי</ion-label>
       <ion-input v-model="first" type="text" autocomplete="new-first"></ion-input>
       </ion-item>
       <ion-item  color="dark" >
           <ion-label position="floating">שם משפחה</ion-label>
       <ion-input v-model="last" type="text" autocomplete="new-last"></ion-input>
       </ion-item>
       <ion-item  color="dark" >
        <ion-label position="floating">כתובת מייל</ion-label>
       <ion-input v-model="email" type="text" autocomplete="new-email"></ion-input>
       </ion-item>
        <ion-item color="dark" >
        <ion-label position="floating">סיסמה</ion-label>
       <ion-input v-model="password" type="text" autocomplete="new-password"></ion-input>
       </ion-item>
       <ion-item color="dark" >
             <ion-select  color="dark"  :compareWith="employeeTypes"
        @ionChange="employeeType = $event.detail.value" placeholder="סוג עובד">
        <ion-select-option value="driller">קודח</ion-select-option>
        <ion-select-option value="manager">מנהל מערכת</ion-select-option>
      </ion-select>

       </ion-item>
       
        <div style="padding-top: 6px">
            <ion-button shape="round" @click="createEmployeeAccountEmailPassword" expand="full">צור עובד</ion-button>
        </div>
           <div style="padding-top: 6px">
            <ion-button shape="round" color="danger" @click="$router.back()" expand="full">ביטול </ion-button>
        </div>
       
      </div>
      <p v-if="error">{{error.errorCode}}{{error.error}}</p>


      <ion-modal :is-open="isOpen">
        <ion-header>
          <ion-toolbar color="dark">
            <ion-title>{{'יוצר עובד חדש אנא המתן'}}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content color="dark" class="ion-padding">
          <div class="center">
          <p>
          {{'יוצר עובד חדש אנא המתן'}}
          </p>
          <ion-spinner name="circular"></ion-spinner>
        </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonContent, IonPage,IonInput, IonLabel ,IonItem,IonButton, IonSelect, IonSelectOption,IonModal,IonHeader,IonToolbar,IonTitle, IonSpinner } from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  
  import { useRouter } from 'vue-router';

  import { useAppState } from '@/realm-state';

  import AppHeader from '../Components/AppHeader.vue'
  export default defineComponent({
    name: 'CreateEmployee',
    components: {
      IonContent,
      IonPage,
      IonInput,
      IonLabel,
      IonItem,
      IonButton, 
      IonSelect, 
      IonSelectOption,
      IonModal,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonSpinner,
      AppHeader,
     
     
    },
    setup(){
      const {user, createEmployeeAccount} = useAppState();
      const router = useRouter();
      const currentUser = ref<any>(user);
      const organizationID = ref<any>();
      const email = ref("");
      const password = ref("");
      const first = ref("");
      const last = ref("");
      const employeeType = ref("")
      const error = ref<any>({});
      const employeeTypes = ref([{value:'driller'}, {value:'manager'}]);
      const isOpen = ref(false)

      

      

       onMounted(async()=>{
        organizationID.value = user.value.customData.organizationID
       });
     
      const createEmployeeAccountEmailPassword = async()=>{
        try {
          isOpen.value = true
          //Create user
          console.log(employeeType.value , organizationID.value);
          
          let empID = await createEmployeeAccount(email.value, password.value, first.value , last.value, employeeType.value)
          
          isOpen.value = false 
          router.push('/employee/'+empID)

        } catch (err) {
          console.error("Failed to log in", err)
          error.value = err;
        }
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
        isOpen,
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
  .center{
    text-align: center;
  }

  ion-button {
    --background: #4DBA87;
    --background-hover: #9ce0be;
    --background-activated: #88f4be;
    --background-focused: #88f4be;
    
  
    --color: #fff;
  
  
    --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);
  
    --ripple-color: deeppink;
  
    --padding-top: 10px;
    --padding-bottom: 10px;
  
  }
  ion-spinner {
    --color: #54dc98;
  }
</style>