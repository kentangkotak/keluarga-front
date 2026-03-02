<template>
  <q-page class="home-page flex flex-center">
    <div class="container">
      <!-- HEADER -->
      <div class="header text-center">
        <div class="logo-wrapper">
          <q-icon name="account_tree" size="60px" class="logo-icon" />
        </div>

        <h1 class="title">Aplikasi Pohon Keluarga Bani Moen</h1>
        <p class="subtitle">Kelola dan lihat silsilah keluarga Anda dengan mudah</p>
      </div>

      <!-- MENU CARDS -->
      <div class="menu-grid">
        <q-card class="menu-card" clickable @click="$router.push('/profil')">
          <q-card-section class="text-center">
            <q-icon name="person" size="42px" class="menu-icon" />
            <div class="menu-title">Profil</div>
            <div class="menu-desc">Lihat dan edit data profil Anda</div>
          </q-card-section>
        </q-card>
        <q-card class="menu-card" clickable @click="$router.push('/albumkeluarga')">
          <q-card-section class="text-center">
            <q-icon name="person" size="42px" class="menu-icon" />
            <div class="menu-title">Album Keluarga</div>
            <div class="menu-desc">Lihat Album Anggota Keluarga Anda</div>
          </q-card-section>
        </q-card>

        <q-card class="menu-card" clickable @click="$router.push('/pohon')">
          <q-card-section class="text-center">
            <q-icon name="account_tree" size="42px" class="menu-icon" />
            <div class="menu-title">Pohon Keluarga</div>
            <div class="menu-desc">Lihat struktur silsilah keluarga</div>
          </q-card-section>
        </q-card>

        <q-card class="menu-card logout-card" clickable @click="logout">
          <q-card-section class="text-center">
            <q-icon name="logout" size="42px" class="menu-icon logout-icon" />
            <div class="menu-title">Logout</div>
            <div class="menu-desc">Keluar dari aplikasi</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const logout = () => {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Yakin ingin logout?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    localStorage.removeItem('token')
    router.push('/login')
  })
}
</script>

<style scoped>
.home-page {
  background: linear-gradient(135deg, #4e73df, #1cc88a);
  min-height: 100vh;
  padding: 40px 20px;
}

.container {
  width: 100%;
  max-width: 1000px;
}

.header {
  margin-bottom: 50px;
  color: white;
}

.logo-wrapper {
  width: 90px;
  height: 90px;
  margin: auto;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logo-icon {
  color: white;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin-top: 20px;
}

.subtitle {
  opacity: 0.9;
  margin-top: 8px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.menu-card {
  border-radius: 20px;
  padding: 30px 10px;
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  cursor: pointer;
}

.menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.menu-icon {
  color: #4e73df;
  margin-bottom: 15px;
}

.menu-title {
  font-size: 18px;
  font-weight: 600;
}

.menu-desc {
  font-size: 13px;
  opacity: 0.6;
  margin-top: 6px;
}

.logout-card {
  background: rgba(255, 255, 255, 0.95);
}

.logout-icon {
  color: #e74a3b;
}
</style>
