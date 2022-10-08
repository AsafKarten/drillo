<template>
  <div>
    <Vue3Signature
      ref="signature1"
      :sigOption="state.option"
      :w="'300px'"
      :h="'200px'"
      :disabled="state.disabled"
      class="example"
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
display: block;
direction: rtl;
}
</style>
