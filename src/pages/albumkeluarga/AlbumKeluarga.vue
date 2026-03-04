<template>
  <div class="album-wrapper">
    <!-- Header -->
    <div class="album-header">
      <button class="home-btn" @click="goHome">🏠</button>
      <h2 class="album-title">📖 Album Keluarga</h2>
      <div class="page-counter" v-if="!loading">{{ currentPage + 1 }} / {{ pages.length }}</div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>

    <transition name="slide-fade" mode="out-in">
      <div v-if="!loading" class="card-wrapper" :key="currentPage">
        <button class="side-btn left" @click="prevPage" :disabled="currentPage === 0">
          &#8249;
        </button>
        <div class="card">
          <!-- Breadcrumb -->
          <div class="breadcrumb" v-if="parentPages.length">
            <span
              class="breadcrumb-item"
              v-for="p in parentPages"
              :key="p.id"
              @click="currentPage = pages.findIndex((page) => page.id === p.id)"
            >
              {{ p.parent.name }}<span v-if="p.spouse"> & {{ p.spouse.name }}</span>
            </span>
            <span class="breadcrumb-arrow">›</span>
          </div>

          <!-- Title -->
          <h3 class="family-title">{{ pages[currentPage]?.title }}</h3>

          <!-- Couple -->
          <div class="couple" v-if="pages[currentPage]">
            <div class="person-card">
              <div class="avatar-wrap">
                <img :src="pages[currentPage].parent.photo" :alt="pages[currentPage].parent.name" />
              </div>
              <span class="person-name">{{ pages[currentPage].parent.name }}</span>
            </div>

            <div class="heart" v-if="pages[currentPage].spouse">❤️</div>

            <div class="person-card" v-if="pages[currentPage].spouse">
              <div class="avatar-wrap">
                <img :src="pages[currentPage].spouse.photo" :alt="pages[currentPage].spouse.name" />
              </div>
              <span class="person-name">{{ pages[currentPage].spouse.name }}</span>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-section" v-if="pages[currentPage]">
            <!-- Info Parent -->
            <div class="info-block">
              <div class="info-name">{{ pages[currentPage].parent.name }}</div>
              <div class="info-row" v-if="pages[currentPage].parent.tanggal_lahir">
                <span class="info-icon">🎂</span>
                <span class="info-text">{{
                  formatDate(pages[currentPage].parent.tanggal_lahir)
                }}</span>
              </div>
              <div class="info-row" v-if="pages[currentPage].parent.nohp">
                <span class="info-icon">📞</span>
                <span class="info-text">{{ pages[currentPage].parent.nohp }}</span>
              </div>
              <div class="info-row" v-if="pages[currentPage].parent.kota">
                <span class="info-icon">🏙️</span>
                <span class="info-text">{{ pages[currentPage].parent.kota }}</span>
              </div>
              <div class="info-row" v-if="pages[currentPage].parent.alamat">
                <span class="info-icon">📍</span>
                <span class="info-text">{{ pages[currentPage].parent.alamat }}</span>
              </div>
            </div>

            <!-- Info Spouse -->
            <div class="info-block" v-if="pages[currentPage].spouse">
              <div class="info-name">{{ pages[currentPage].spouse.name }}</div>
              <div class="info-row" v-if="pages[currentPage].spouse.tanggal_lahir">
                <span class="info-icon">🎂</span>
                <span class="info-text">{{
                  formatDate(pages[currentPage].spouse.tanggal_lahir)
                }}</span>
              </div>
              <div class="info-row" v-if="pages[currentPage].spouse.nohp">
                <span class="info-icon">📞</span>
                <span class="info-text">{{ pages[currentPage].spouse.nohp }}</span>
              </div>
              <div class="info-row" v-if="pages[currentPage].spouse.kota">
                <span class="info-icon">🏙️</span>
                <span class="info-text">{{ pages[currentPage].spouse.kota }}</span>
              </div>
              <div class="info-row" v-if="pages[currentPage].spouse.alamat">
                <span class="info-icon">📍</span>
                <span class="info-text">{{ pages[currentPage].spouse.alamat }}</span>
              </div>
            </div>
          </div>

          <!-- Children -->
          <div v-if="pages[currentPage]?.children?.length" class="children-section">
            <p class="children-label">👨‍👩‍👧‍👦 Anak-anak</p>
            <div class="children-grid">
              <div
                v-for="child in pages[currentPage].children"
                :key="child.id"
                class="child-chip"
                @click="goToChild(child.id)"
              >
                {{ child.name }}
              </div>
            </div>
          </div>
        </div>
        <button
          class="side-btn right"
          @click="nextPage"
          :disabled="currentPage === pages.length - 1"
        >
          &#8250;
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTreeStore } from 'src/stores/tree'
import { useRouter } from 'vue-router'
const store = useTreeStore()
const pages = ref([])
const router = useRouter()
const currentPage = ref(0)
const loading = ref(true) // state loading

function buildPages(person, parentPerson = null) {
  const pages = []

  const makePage = (p) => ({
    id: p.id || p.name, // pastikan ada id unik
    title: `Keluarga ${p.name}`,
    parent: p,
    spouse: p.spouse || null,
    children: p.children || [],
    parentId: parentPerson?.id || null, // catat parentId
  })

  pages.push(makePage(person))

  if (person.children?.length) {
    person.children.forEach((child) => {
      pages.push(...buildPages(child, person))
    })
  }

  return pages
}

const parentPages = computed(() => {
  const current = pages.value[currentPage.value]
  if (!current?.parentId) return []

  const parents = []
  let parentId = current.parentId

  while (parentId) {
    const parentPage = pages.value.find((p) => p.id === parentId)
    if (!parentPage) break
    parents.unshift(parentPage) // taruh di awal biar dari generasi pertama
    parentId = parentPage.parentId
  }

  return parents
})

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

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const goToChild = (childId) => {
  const index = pages.value.findIndex((p) => p.parent.id === childId)
  if (index !== -1) {
    currentPage.value = index
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.album-wrapper {
  min-height: 100vh;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px 40px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.album-header {
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  padding: 14px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.album-title {
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.home-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.3rem;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}
.home-btn:hover {
  background: rgba(255, 255, 255, 0.35);
}

.page-counter {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
}

/* Loading */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 80px;
  color: #64748b;
  font-size: 1rem;
}

.spinner {
  border: 5px solid #e2e8f0;
  border-top: 5px solid #2563eb;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Card */
.card {
  background: white;
  border-radius: 28px;
  padding: 28px 24px 24px;
  width: 100%;
  max-width: 420px;
  border: 2px solid #bfdbfe;
  box-shadow:
    0 8px 30px rgba(37, 99, 235, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  position: relative;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  justify-content: center;
  width: 100%;
}

.breadcrumb-item {
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid #bfdbfe;
  transition: background 0.2s;
}
.breadcrumb-item:hover {
  background: #dbeafe;
}

.breadcrumb-arrow {
  color: #94a3b8;
  font-size: 1.1rem;
}

/* Title */
.family-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
}

/* Couple */
.couple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.person-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-wrap {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e2e8f0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s;
}
.avatar-wrap:hover {
  transform: scale(1.06);
}

.avatar-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.person-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;
  text-align: center;
}

.heart {
  font-size: 1.6rem;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Info Section */
.info-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-block {
  background: #f8faff;
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.info-text {
  font-size: 0.82rem;
  color: #334155;
  font-weight: 500;
}

/* Children */
.children-section {
  width: 100%;
}

.children-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-align: center;
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.children-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.child-chip {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 7px 16px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid #bfdbfe;
  transition: all 0.2s ease;
}
.child-chip:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  border-color: transparent;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Card wrapper with side buttons */
.card-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
}

.side-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  background: white;
  color: #111827;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.side-btn:hover:not(:disabled) {
  background: #f1f5f9;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}
.side-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.side-btn.left {
  left: 0;
}
.side-btn.right {
  right: 0;
}

/* Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.35s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
