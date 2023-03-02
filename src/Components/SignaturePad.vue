<template>
  <div >
    <Vue3Signature class="mainContainer"
      ref="signature1"
      :sigOption="state.option"
      
      :h="'200px'"
      :disabled="state.disabled"
      
    >
    </Vue3Signature>
  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, defineExpose } from 'vue';
import Vue3Signature from "vue3-signature";

/* eslint-disable */
export default defineComponent({
  name: 'SignaturePad',
  components: {Vue3Signature},
  props:{report:Object, signature:Boolean},
  setup(){
    onMounted(async()=>{
      //add code or delete
    });

    //SIGNATURE PAD
    const state = reactive({
      count: 0,
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)"
      },
      disabled: false
    })

    const signature1 = ref(Vue3Signature)
    const save = (t:String) => { return signature1.value.save(t); }  // signature1.value.save('image/jpeg')
    const clear = () => { signature1.value.clear(); }

    //defineExpose({signature1})

    return {
      signature1, state,
      save, clear
    }
  }
});


</script>

<style scoped>
.mainContainer{
width: 100%;
margin: 2%;
display: block;
direction: rtl;
border: 2px lightgray solid;
border-radius: 12px;
}
</style>
