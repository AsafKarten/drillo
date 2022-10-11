<template>
  <div class="button-grid-container ion-margin">

    <ion-button v-for="(button,index) in buttons" :key="index" fill="outline" @click="button.click">
      <div>
        <ion-icon :icon="button.icon" size="large" class="ion-margin"></ion-icon>
        <ion-label>{{button.text}}</ion-label>
      </div>
    </ion-button>

  </div>
</template>
  
<script lang="ts">
  import { IonButton, IonLabel, IonIcon } from '@ionic/vue';
  import { defineComponent, onMounted } from 'vue';

  export default defineComponent({
    name: 'GridButtons.vue',
    components: {
       IonButton, 
       IonLabel,
       IonIcon 
    },
    props: {
      buttons: Array
    },
    setup() {
      onMounted(()=>{return;});
      return {};
    }
  });
</script>
  
<style scoped>
  .button-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 0.5fr));
    grid-auto-rows: 150px;
    align-items: stretch;
    justify-content: stretch;
  }

  .button-grid-container>.button {
    height: auto;
  }

  .button>div{
    display: flex;
    flex-direction: column;
    align-items: center;

    --ion-margin: 6px;
    font-weight: bold;
  }
</style>