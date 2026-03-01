<template>
  <div />
</template>

<script setup>
import { onMounted } from 'vue'
import { Notify } from 'quasar'
import emitter from 'src/utils/notify'

onMounted(() => {
  console.log('AppNotify mounted ✅')

  emitter.on('notify', (payload) => {
    console.log('NOTIFY TRIGGERED 🔥', payload)

    Notify.create({
      type: payload.type || 'info',
      message: payload.message,
      position: 'top-right',
      timeout: 2500,
    })
  })
})
</script>
