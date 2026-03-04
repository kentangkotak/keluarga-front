<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const isHome = computed(() => route.path === '/')

const handlePopState = () => {
  if (isHome.value) {
    // Cegah keluar dari app, push state lagi
    history.pushState(null, '', window.location.href)
    $q.dialog({
      title: 'Keluar Aplikasi',
      message: 'Yakin ingin keluar dari aplikasi?',
      cancel: { label: 'Batal', flat: true },
      ok: { label: 'Keluar', color: 'negative', unelevated: true },
      persistent: true,
    }).onOk(() => {
      window.close()
    })
  } else {
    router.back()
  }
}

onMounted(() => {
  history.pushState(null, '', window.location.href)
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>
