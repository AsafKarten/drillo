<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Create Account</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
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
       
        <div style="padding-top: 6px">
            <ion-button @click="createAccountEmailPassword" expand="full">Sign Up</ion-button>
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
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonInput, IonLabel ,IonItem,IonButton } from '@ionic/vue';
  import { defineComponent, ref } from 'vue';
  
  import { useRouter } from 'vue-router';

  import { useAppState } from '@/realm-state';
  export default defineComponent({
    name: 'CreateAccount',
    components: {
      IonContent,
      IonHeader,
      IonPage,
      IonTitle,
      IonToolbar,
      IonInput,
      IonLabel,
      IonItem,
      IonButton
    },
    setup(){
      const email = ref("");
      const password = ref("");
      const first = ref("");
      const last = ref("");
      const error = ref<any>({});

      const router = useRouter();

      const {createAccount} = useAppState();
     
      const createAccountEmailPassword = async()=>{
        try {
          //Create user
          await createAccount(email.value, password.value, first.value , last.value)
          router.replace("/home")
        } catch (err) {
          console.error("Failed to log in", err)
          error.value = err;
        }
      }
      
      
      return{ 
        //methods
        createAccountEmailPassword,
        //properties
        email,
        password,
        first,
        last,
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