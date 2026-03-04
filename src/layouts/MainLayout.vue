<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Page Loading Overlay -->
    <transition name="fade-loading">
      <div v-if="isPageLoading" class="page-loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring spinner-ring--2"></div>
            <div class="spinner-ring spinner-ring--3"></div>
          </div>
          <p class="loading-text">Memuat...</p>
        </div>
      </div>
    </transition>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const isPageLoading = ref(false)

const isHome = computed(() => route.path === '/')

// Router navigation loading — hanya saat ke halaman /
router.beforeEach((to) => {
  if (to.path === '/') isPageLoading.value = true
})
router.afterEach((to) => {
  if (to.path === '/') {
    setTimeout(() => {
      isPageLoading.value = false
    }, 300)
  }
})

// Hardware back button
const handlePopState = () => {
  if (isHome.value) {
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

<style scoped>
/* Loading Overlay */
.page-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  position: relative;
  width: 64px;
  height: 64px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.9);
  animation: spin 1s linear infinite;
}

.spinner-ring--2 {
  inset: 8px;
  border-top-color: rgba(255, 255, 255, 0.6);
  animation-duration: 1.4s;
  animation-direction: reverse;
}

.spinner-ring--3 {
  inset: 16px;
  border-top-color: rgba(255, 255, 255, 0.3);
  animation-duration: 1.8s;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 0;
}

/* Transition */
.fade-loading-enter-active {
  transition: opacity 0.15s ease;
}
.fade-loading-leave-active {
  transition: opacity 0.35s ease;
}
.fade-loading-enter-from,
.fade-loading-leave-to {
  opacity: 0;
}
</style>
