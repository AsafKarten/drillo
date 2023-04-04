<template>
  <ion-page>

    <ion-toolbar>
      <ion-button class="btn" @click="goTo('/login')">התחברות</ion-button>
    </ion-toolbar>
    <ion-content :fullscreen="true">



      <div class="TopContainer">
        <h1 id="title">Drillo</h1>
        <h3>קודחים חכם</h3>
      </div>

      <div class="MiddleContainer">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Wsg_P1UiMmw" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>

      <div class="ThierdContainer">
        <ion-grid>
          <ion-row>
            <ion-col size="1" >
              <div class="columnBox">
              <ion-button color="clear" size="large">
                <ion-icon size="large" slot="start" :icon="statsChartOutline" />
               </ion-button>
              <p>ניהול מידע</p>
            </div>
            </ion-col>
            <ion-col size="1" >
              <div class="columnBox">
              <ion-button color="clear" size="large">
                <ion-icon size="large" slot="start" :icon="peopleOutline" />
              </ion-button>
              <p>ניהול עובדים</p>
            </div>
            </ion-col>
            <ion-col size="1" >
              <div class="columnBox">
              <ion-button color="clear" size="large">
                <ion-icon size="large" slot="start" :icon="peopleOutline" />
              </ion-button>
              <p>יצירת דוח"ות באופן אוטומטי</p>
            </div>
            </ion-col>
            <ion-col size="1">
              <div class="columnBox">
              <ion-button color="clear" size="large">
                <ion-icon size="large" slot="start" :icon="pieChartOutline" />
              </ion-button>
              <p>מעקב אחרי פרוייקטים</p>
            </div>
            </ion-col>
            <ion-col size="1">
              <div class="columnBox">
              <ion-button color="clear" size="large">
                <ion-icon size="large" slot="start" :icon="cloudOutline" />
              </ion-button>
              <p>כל המידע מאובטח בענן</p>
            </div>
            </ion-col>
            <ion-col size="1">
              <div class="columnBox">
              <ion-button color="clear" size="large">
                <ion-icon  size="large" slot="start" :icon="callOutline" />
              </ion-button>
              <p>תמיכה בעברית</p>
            </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      
      <div class="caruselContainer">
        <img class="carusel" alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
      </div>

      <div class="bottomContainer">
      <p>&copy; כל הזכויות שמורות דרילו בע"מ</p>
      </div>
    </ion-content>
  </ion-page>
</template>
  
<script lang="ts">

import { onIonViewDidEnter, IonContent, IonPage, IonToolbar, IonCol, IonGrid, IonRow, IonFooter, IonButton, IonIcon } from '@ionic/vue';
import { add, listOutline, peopleOutline, statsChartOutline, cloudOutline, callOutline, pieChartOutline } from 'ionicons/icons';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter } from 'vue-router';




export default defineComponent({
  name: 'DrilloPage',
  components: {
    IonContent,
    IonPage,
    IonToolbar,
    IonButton,
    IonCol,
    IonGrid,
    IonRow,
    IonIcon,
  },
  setup() {
    const router = useRouter();
   

    const goTo = (value: string) => {
      router.replace(value)
    }
    return {
      //methoods
      goTo,
      //properties

      //icons
      add,
      listOutline,
      peopleOutline,
      statsChartOutline,
      cloudOutline,
      callOutline,
      pieChartOutline,


    }
  },

});
</script>
  
<style scoped>
#title {
  color: white;
  font-size: 60px;
  font-weight: bolder;
}

.TopContainer {
  display: block;
  padding-top: 2%;
  padding-bottom: 2%;
  text-align: center;
  background-color: #4DBA87;
  color: #fff;
}

.MiddleContainer {
  background-color: rgb(4, 80, 4);
  padding-top: 2%;
  padding-bottom: 2%;
  text-align: center;
}

.ThierdContainer {
  background-color: #b3ebcf;
  padding-top: 2%;
  padding-bottom: 2%;
}
.columnBox{
  border: #4DBA87 2px solid;
  border-radius: 16px;
  margin: 2%;

}
.caruselContainer{
  width: 100%;
  height: 600px;
  
}
.carusel{
  
  height:500px;
  width: 100%;

}
.bottomContainer{
  
  text-align: center;
}

.btn {
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

ion-grid {
  --ion-grid-columns: 2;
  text-align: center;
}
</style>
  