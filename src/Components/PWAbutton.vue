<template>
  <ion-button v-if="canInstallPWA"  @click="installPWA" color="dark">{{"התקנה"}}
    <IonIcon slot="end" :icon="download"/>
  </ion-button>
</template>

<script>
import { IonButton,IonIcon } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { download } from 'ionicons/icons';


export default defineComponent({
  name: 'PWAbutton',
  components: {
    IonButton,
    IonIcon
  },
  props: { },
  setup() {

    let deferredPWAPrompt;
    const canInstallPWA = ref();

    const beforeInstallMountCalled = function(e) {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      deferredPWAPrompt.value = e
      // Update UI to notify the user they can add to home screen
      canInstallPWA.value = true

      window.addEventListener('appinstalled', () => { canInstallPWA.value = false })
    }

    const listenToPWA = function() {
      //listen to chrome PWA prompt before it appears
      window.addEventListener('beforeinstallprompt', beforeInstallMountCalled)
    }

    const installPWA = function() {
      // hide the PWA button
      canInstallPWA.value = false
      // Show the prompt
      deferredPWAPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPWAPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            window.location.reload()
          } else {
            this.canInstallPWA = true
          }
          this.deferredPWAPrompt = null;
        });
    }

    onMounted(async()=>{
      listenToPWA();
    });
    
    return {
      //methods
      installPWA,

       //properties
      canInstallPWA,

      //icons
      download,
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