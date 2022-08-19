<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input
            v-model="email"
            type="text"
            autocomplete="new-email"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input
            v-model="password"
            type="text"
            autocomplete="new-password"
          ></ion-input>
        </ion-item>

        <div style="padding-top: 6px">
          <ion-button @click="loginEmailPassword" expand="full"
            >Login
          </ion-button>
        </div>
        <div style="padding-top: 6px">
          <ion-button router-link="/create-account" expand="full"
            >Create Account
          </ion-button>
        </div>
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
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
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
      let resp = await login(email.value, password.value)
      if(resp === "driller")
          router.replace("/driller-view");
      else
        router.replace("/home");
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