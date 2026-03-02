<template>
  <div class="album-container">
    <h5>Album Keluarga</h5>

    <div class="controls" v-if="!loading">
      <button @click="goHome">🏠 Home</button>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="!loading" class="page" :key="currentPage">
        <h5>{{ pages[currentPage]?.title }}</h5>
        <div class="couple" v-if="pages[currentPage]">
          <div class="person">
            <img :src="pages[currentPage].parent.photo" :alt="pages[currentPage].parent.name" />
            <p>{{ pages[currentPage].parent.name }}</p>
          </div>
          <div class="person" v-if="pages[currentPage].spouse">
            <img :src="pages[currentPage].spouse.photo" :alt="pages[currentPage].spouse.name" />
            <p>{{ pages[currentPage].spouse.name }}</p>
          </div>
        </div>

        <div v-if="pages[currentPage]?.children?.length" class="children">
          <h3>Anak-anak</h3>
          <ul>
            <li v-for="child in pages[currentPage].children" :key="child.id">
              {{ child.name }}
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <div v-if="!loading" class="controls">
      <button @click="prevPage" :disabled="currentPage === 0">Prev</button>
      <button @click="nextPage" :disabled="currentPage === pages.length - 1">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTreeStore } from 'src/stores/tree'
import { useRouter } from 'vue-router'
const store = useTreeStore()
const pages = ref([])
const router = useRouter()
const currentPage = ref(0)
const loading = ref(true) // state loading

function buildPages(person) {
  const pages = []

  const makePage = (p) => ({
    title: `Keluarga ${p.name}`,
    parent: p,
    spouse: p.spouse || null,
    children: p.children || [],
  })

  pages.push(makePage(person))

  if (person.children && person.children.length) {
    person.children.forEach((child) => {
      pages.push(...buildPages(child))
    })
  }

  return pages
}

const goHome = () => {
  router.push('/')
}

const prevPage = () => {
  if (currentPage.value > 0) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < pages.value.length - 1) currentPage.value++
}

onMounted(async () => {
  loading.value = true // mulai loading
  await store.getlist()

  if (!store.items) {
    loading.value = false
    return
  }

  pages.value = buildPages(store.items)
  loading.value = false // selesai loading
})
</script>

<style scoped>
.album-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f0f2f5;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative; /* untuk overlay loading */
  min-height: 550px;
}

.page {
  background: white;
  padding: 20px;
  user-select: none;
  width: 340px;
  min-height: 500px;
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: transform 0.3s ease;
}

.couple {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
}

.person {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.person:hover {
  transform: scale(1.1);
}

.person img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.children ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  max-width: 280px;
  font-weight: 600;
  font-size: 1.05rem;
  color: #444;
}

.children li {
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid #3b82f6;
}

.controls {
  margin-top: 15px;
}

.controls button {
  margin: 0 15px;
  padding: 10px 22px;
  cursor: pointer;
  font-weight: bold;
  border: none;
  background: #3b82f6;
  color: white;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.controls button:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.controls button:hover:not(:disabled) {
  background: #2563eb;
}

/* Animasi fade untuk halaman */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 12px;
}

/* Spinner animasi */
.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
