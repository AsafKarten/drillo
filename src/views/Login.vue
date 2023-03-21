<template>
  <ion-page>
    <!-- <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>התחברות</ion-title>
      </ion-toolbar>
    </ion-header> -->

    <ion-content :fullscreen="true">
     
      
      <div id="container">
        <h1 id="title" >Drillo</h1>
        <h3>{{'מערכת לניהול קידוחים'}}</h3>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input
            
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="Email"
          ></ion-input>
        </ion-item >
        <ion-item >
          <ion-label position="floating">Password</ion-label>
          <ion-input
            
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="Password"
          ></ion-input>
        </ion-item>

        <div style="padding-top: 6px">
          <ion-button shape="round"  @click="loginEmailPassword" expand="full"
            >{{'התחברות' }}
          </ion-button>
        </div>
        <!-- <div style="padding-top: 6px">
          <ion-button router-link="/create-account" expand="full"
            >Create Account
          </ion-button>
        </div> -->
      </div>
      <p v-if="error">{{ error.errorCode }}{{ error.error }}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonLabel,
  IonItem,
  IonButton,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import {useAppState} from '../realm-state';

export default defineComponent({
  name: "LoginPage",
  components: {
    IonContent,
    //IonHeader,
    IonPage,
    //IonTitle,
    //IonToolbar,
    IonInput,
    IonLabel,
    IonItem,
    IonButton,
  },
  setup() {
    const {login} = useAppState();
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const error = ref<any>({});

    const loginEmailPassword = async () => {
      try {
      email.value = email.value.toLowerCase()
      let resp = await login(email.value, password.value)
      if(resp === "driller")
          router.replace("/field-project-managment");

      else if( (resp === "deleted"))
        return

          
      else
        router.replace("/new-home");
      } catch (err) {
        console.error("Failed to login", err);
        error.value = err;
      }
    };

    return {
      //method
      loginEmailPassword,
      //properties
      email,
      password,
      error,
    };
  }
});
</script>

<style scoped>
#title{
  color: #4DBA87;
  font-size: 60px;
  font-weight: bolder;
}

#container {
  border: #4DBA87 2px solid;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  left: 4%;
  right: 4%;
  top: 50%;
  transform: translateY(-50%);
  padding: 2%;
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
ion-button {
  --background: #4DBA87;
  --background-hover: #9ce0be;
  --background-activated: #88f4be;
  --background-focused: #88f4be;
  

  --color: #fff;

  --border-radius: 10px;
  --border-color: #4DBA87;
  --border-style: solid;
  --border-width: 2px;

  --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);

  --ripple-color: deeppink;

  --padding-top: 10px;
  --padding-bottom: 10px;

}
</style>