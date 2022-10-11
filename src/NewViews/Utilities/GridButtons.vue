<template>
  <div class="button-grid-container ion-margin" :style="'--button-height:'+(options.buttonHeight||150)+'px'">

    <ion-button
      v-for="(button,index) in buttons"
      :key="button.index||index"
      :fill="button.fill||'outline'"
      :color="button.color"
      @click="button.click"
    >

      <ion-badge
        class="floating-corner-badge"
        v-if="button.badge"
        :color="button.badge.color"
      >
        {{button.badge.count}}
      </ion-badge>

      <div class="button-content">
        
        <ion-icon
          :icon="button.icon"
          size="large"
          class="ion-margin"
        >
        </ion-icon>
      
        <ion-label
          class="ion-text-wrap"
        >
          {{button.text}}
        </ion-label>

      </div>

    </ion-button>

  </div>
</template>
  
<script lang="ts">
  import { IonButton, IonLabel, IonIcon, IonBadge } from '@ionic/vue';
  import { defineComponent, onMounted } from 'vue';

  export default defineComponent({
    name: 'GridButtons.vue',
    components: {
       IonButton, 
       IonLabel,
       IonIcon,
       IonBadge
    },
    props: {
      buttons: Array,
      options: Object
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
    grid-template-columns: repeat(auto-fit, minmax( var(--button-height), 1fr));
    grid-auto-rows: var(--button-height);
    align-items: stretch;
    justify-content: stretch;
  }

  .button-grid-container>.button {
    height: auto;
  }

  .button>.button-content{
    display: flex;
    flex-direction: column;
    align-items: center;

    --ion-margin: 6px;
    font-weight: bold;
  }

  .floating-corner-badge {
    position: absolute;
    display: block;
    right: -10px;
    top: 5px;
  }
</style>