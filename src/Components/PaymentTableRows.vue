<template>


          <!--payment report row-->
     <table>
            <tr :key="row?.listName" v-for="row in day">
              <td colspan="2">{{workDay}}</td>
              <td colspan="2">{{row.columnsNumbers}}</td>
              <td colspan="2">{{row.diameter}}</td>
              
            </tr>
    </table>
 
  </template>
    
  <script lang="ts">
  import { onIonViewWillEnter,onIonViewDidLeave, IonContent, IonHeader, IonPage, IonToolbar, IonButton, IonButtons, IonModal, IonTitle, IonInput, IonLabel, IonItem, IonLoading} from '@ionic/vue';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';

  
  //imports 

  
  
  
  
  
  
  export default defineComponent({
    name: 'GenerateExcel',
    components: {
      //IonPage,
      //IonContent,
      //IonItem,
      //IonLabel,
      //IonInput,
      //IonButton,
  
 
  
    },
    props:{row:Object, currentDay:String},
    setup(props) {
      const router = useRouter();
      const route = useRoute()
      const { user,getProjectPits, getProjectByID} = useAppState(); 
      const currentUser = ref<any>(user);
      const day = ref<any>(props.row)
      const workDay = ref<any>(props.currentDay)
     
      onMounted(async()=>{
     console.log(day.value);
     
        
        
      });
  
  

  
      return {
        day,
        workDay
      }
    },
  
  });
  </script>
    
  <style scoped>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  
  td, th {
    border: 1px solid #000000;
    text-align: left;
    padding: 8px;
    text-align: center;
  }
  
  tr:nth-child(even) {
    background-color: #dddddd;
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