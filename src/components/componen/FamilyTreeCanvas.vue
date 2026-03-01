<template>
  <div class="tree-wrapper">
    <!-- TOP BAR -->
    <!-- <div class="top-bar">
      <q-btn icon="arrow_back" label="Home" color="primary" unelevated rounded @click="goHome" />
    </div> -->

    <!-- HEADER -->
    <div class="tree-header">
      <div class="title">🌳 Pohon Keluarga</div>
      <div class="subtitle">Struktur Keturunan Keluarga</div>
    </div>

    <div class="row q-pl-md q-pr-md">
      <div class="col-6 q-pr-md">
        <q-btn
          icon="arrow_back"
          label="Home"
          color="primary"
          unelevated
          rounded
          @click="goHome"
          class="q-mb-md full-width"
        />
      </div>
      <div class="col-6">
        <q-btn
          label="Tambah Anggota"
          color="positive"
          icon="add"
          rounded
          class="q-mb-md full-width"
          @click="openTambah"
        />
      </div>
    </div>

    <!-- TREE CANVAS -->
    <div ref="canvas" class="tree-container"></div>

    <!-- LOADING -->
    <transition name="fade">
      <div v-if="store.loading" class="loading-overlay">
        <div class="loading-card">
          <div class="spinner"></div>
          <div class="loading-text">Memuat Data...</div>
        </div>
      </div>
    </transition>
  </div>
  <FormMemberDialog v-model="showDialog" :member="selectedMember" />
</template>

<script setup>
import * as d3 from 'd3'
import { useTreeStore } from 'src/stores/tree'
import { onMounted, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import FormMemberDialog from './FormMemberDialog.vue'

const canvas = ref(null)
const store = useTreeStore()
const router = useRouter()
const showDialog = ref(false)
const selectedMember = ref(null)

const goHome = () => {
  router.push('/')
}

const openTambah = () => {
  selectedMember.value = null // WAJIB RESET
  showDialog.value = true
}

/* =========================
   RENDER FUNCTION
========================= */
const renderTree = async (data) => {
  if (!data) return

  await nextTick()

  d3.select(canvas.value).selectAll('*').remove()

  const width = canvas.value.scrollWidth || canvas.value.clientWidth
  const height = 1200

  const svg = d3.select(canvas.value).append('svg').attr('width', width).attr('height', height)

  const g = svg.append('g')

  svg.call(
    d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      }),
  )

  const root = d3.hierarchy(data)

  // 🔥 SPACING BESAR BIAR GAK KETUMPUK
  const treeLayout = d3.tree().nodeSize([420, 180])
  treeLayout(root)

  // 🔥 AUTO CENTER
  const minX = d3.min(root.descendants(), (d) => d.x)
  const maxX = d3.max(root.descendants(), (d) => d.x)

  const centerOffset = width / 2 - (minX + maxX) / 2

  g.attr('transform', `translate(${centerOffset},100)`)

  /* =========================
     GARIS PARENT → CHILD
  ========================= */
  g.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', '#90caf9') // biru lembut tapi terang
    .attr('stroke-width', 3)
    .attr('stroke-linecap', 'round')
    .attr('opacity', 0.9)
    .attr('d', (d) => {
      const cardWidth = 100
      const cardHeight = 100

      const startX = d.source.x + cardWidth / 2
      const startY = d.source.y + cardHeight
      const endX = d.target.x + cardWidth / 2
      const endY = d.target.y

      return `
    M ${startX},${startY}
    V ${(startY + endY) / 2}
    H ${endX}
    V ${endY}
  `
    })

  const node = g
    .selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  /* =========================
   CARD UTAMA (ULTRA COMPACT)
========================= */
  node.each(function (d) {
    const card = d3.select(this)

    const cardWidth = 100
    const cardHeight = 100

    const bgColor = d.data.kelamin === 'Laki-laki' ? '#1976d2' : '#e91e63'

    card.style('cursor', 'pointer').on('click', () => {
      selectedMember.value = d.data
      showDialog.value = true
    })

    // Background
    card
      .append('rect')
      .attr('width', cardWidth)
      .attr('height', cardHeight)
      .attr('rx', 12)
      .attr('fill', bgColor)
      .attr('filter', 'drop-shadow(0px 3px 8px rgba(0,0,0,0.12))')

    // Foto
    card
      .append('image')
      .attr('href', d.data.photo || 'https://via.placeholder.com/40')
      .attr('x', cardWidth / 2 - 20)
      .attr('y', 10)
      .attr('width', 40)
      .attr('height', 40)
      .attr('clip-path', 'circle(20px at 20px 20px)')

    // Nama
    card
      .append('text')
      .attr('x', cardWidth / 2)
      .attr('y', 70)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('font-weight', 600)
      .attr('fill', '#fff')
      .text(d.data.kelamin === 'Laki-laki' ? 'Bpk. ' + d.data.name : 'Ibu. ' + d.data.name)
  })
  /* =========================
   PASANGAN (ULTRA COMPACT)
========================= */
  node
    .filter((d) => d.data.spouse)
    .each(function (d) {
      const card = d3.select(this)

      const cardWidth = 100
      const cardHeight = 100
      const offsetX = 130

      const spouseColor = d.data.spouse.kelamin === 'Laki-laki' ? '#1976d2' : '#e91e63'

      card
        .append('rect')
        .attr('width', cardWidth)
        .attr('height', cardHeight)
        .attr('x', offsetX)
        .attr('rx', 12)
        .attr('fill', spouseColor)
        .attr('filter', 'drop-shadow(0px 3px 8px rgba(0,0,0,0.12))')

      card
        .append('image')
        .attr('href', d.data.spouse.photo || 'https://via.placeholder.com/40')
        .attr('x', offsetX + cardWidth / 2 - 20)
        .attr('y', 10)
        .attr('width', 40)
        .attr('height', 40)
        .attr('clip-path', 'circle(20px at 20px 20px)')

      card
        .append('text')
        .attr('x', offsetX + cardWidth / 2)
        .attr('y', 70)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('font-weight', 600)
        .attr('fill', '#fff')
        .text(
          d.data.spouse.kelamin === 'Laki-laki'
            ? 'Bpk. ' + d.data.spouse.name
            : 'Ibu. ' + d.data.spouse.name,
        )

      // Garis suami istri
      card
        .append('line')
        .attr('x1', cardWidth)
        .attr('y1', cardHeight / 2)
        .attr('x2', offsetX)
        .attr('y2', cardHeight / 2)
        .attr('stroke', '#4CAF50')
        .attr('stroke-width', 2)
    })
}

/* =========================
   LOAD DATA
========================= */
onMounted(async () => {
  await store.cariortu()
  await store.getlist()
})

/* =========================
   WATCH DATA
========================= */
watch(
  () => store.items,
  (val) => {
    if (val) renderTree(val)
  },
  { immediate: true },
)
</script>

<style>
.tree-wrapper {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f6f9;
  overflow: hidden;
}

/* ===== TOP BAR ===== */
.top-bar {
  padding: 16px 24px 0 24px;
}

/* ===== HEADER ===== */
.tree-header {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #2c3e50;
}

.subtitle {
  font-size: 14px;
  color: #7f8c8d;
}

/* ===== TREE ===== */
.tree-container {
  flex: 1;
  width: 100%;
  overflow: hidden;
  background: #f4f6f9;
  border-radius: 12px;
}

/* ===== LOADING ===== */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loading-card {
  padding: 20px 35px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  color: #333;
}

.loading-text {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
}

.spinner {
  width: 35px;
  height: 35px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
