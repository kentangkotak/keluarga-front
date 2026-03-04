<template>
  <q-dialog v-model="dialogModelphotos" persistent>
    <q-card class="glass-card">
      <!-- HEADER -->
      <q-card-section class="row items-center justify-between header">
        <div class="text-h6 text-weight-bold">Upload / Ganti Foto</div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-xl">
          <!-- MEMBER -->
          <div class="upload-wrapper">
            <div class="section-title">
              {{ props.member.nama }}
            </div>

            <div class="upload-box">
              <!-- PREVIEW -->
              <div class="avatar">
                <img v-if="preview" :src="preview" />
                <div v-else class="avatar-fallback">
                  {{ props.member.nama?.charAt(0).toUpperCase() }}
                </div>
              </div>

              <q-uploader
                class="uploader"
                flat
                bordered
                accept="image/*"
                :color="props.member.kelamin === 'Laki-laki' ? 'primary' : 'pink'"
                @added="onFileAdded"
              />
            </div>
          </div>

          <!-- SPOUSE -->
          <div v-if="props.member?.spouse?.id" class="upload-wrapper">
            <q-separator spaced />

            <div class="section-title">
              {{ props.member.spouse.nama }}
            </div>

            <div class="upload-box">
              <div class="avatar">
                <img v-if="previewspouse" :src="previewspouse" />
                <div v-else class="avatar-fallback">
                  {{ props.member.spouse.nama?.charAt(0).toUpperCase() }}
                </div>
              </div>

              <q-uploader
                class="uploader"
                flat
                bordered
                accept="image/*"
                :color="props.member.spouse.kelamin === 'Laki-laki' ? 'primary' : 'pink'"
                @added="onFileAddedspouse"
              />
            </div>
          </div>

          <!-- BUTTON -->
          <div class="row justify-end">
            <q-btn
              class="btn-save"
              label="Simpan Perubahan"
              type="submit"
              unelevated
              :loading="store.loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTreeStore } from 'src/stores/tree'

const store = useTreeStore()

const props = defineProps({
  modelValue: Boolean,
  member: Object,
})

const emit = defineEmits(['update:modelValue'])

const dialogModelphotos = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// --- PREVIEW REACTIVE --- //
const previewLocal = ref(null) // untuk member
const previewLocalSpouse = ref(null) // untuk spouse

// --- COMPUTED PREVIEW --- //
const preview = computed(() => {
  // prioritas: preview local → server/store → props
  if (previewLocal.value) return previewLocal.value
  if (store.items && Array.isArray(store.items)) {
    const updatedMember = store.items.find((m) => m.id === props.member.id)
    if (updatedMember?.photo) return updatedMember.photo + '?t=' + Date.now()
  }
  return props.member?.photo || null
})

const previewspouse = computed(() => {
  if (previewLocalSpouse.value) return previewLocalSpouse.value
  if (store.items && Array.isArray(store.items)) {
    const updatedMember = store.items.find((m) => m.id === props.member.id)
    if (updatedMember?.spouse?.photo) return updatedMember.spouse.photo + '?t=' + Date.now()
  }
  return props.member?.spouse?.photo || null
})

// --- FILE ADDED HANDLER --- //
const onFileAdded = (files) => {
  if (!files?.length) return
  store.formphotos.photo = files
  previewLocal.value = URL.createObjectURL(files[0])
}

const onFileAddedspouse = (files) => {
  if (!files?.length) return
  store.formphotos.photospouse = files
  previewLocalSpouse.value = URL.createObjectURL(files[0])
}

// --- SUBMIT FORM --- //
const submitForm = async () => {
  const formData = new FormData()
  formData.append('id_anggota', props.member.id)
  if (props.member?.spouse?.id) formData.append('spouse_id', props.member.spouse.id)
  if (store.formphotos.photo?.length) formData.append('photo', store.formphotos.photo[0])
  if (store.formphotos.photospouse?.length)
    formData.append('photospouse', store.formphotos.photospouse[0])

  try {
    const res = await store.uploadFoto(formData)
    console.log('Upload response:', res)

    // --- set preview langsung dari response ---
    if (res?.data?.data?.original?.photo) {
      previewLocal.value = res.data.data.original.photo + '?t=' + Date.now()
    }
    if (res?.data?.data?.original?.spouse?.photo) {
      previewLocalSpouse.value = res.data.data.original.spouse.photo + '?t=' + Date.now()
    }

    // bersihkan file uploader
    store.formphotos.photo = null
    store.formphotos.photospouse = null
  } catch (err) {
    console.error('Upload error:', err)
  }
}

// --- WATCH PROPS MEMBER --- //
watch(
  () => props.member,
  (newVal) => {
    // reset previewLocal saat member berubah
    previewLocal.value = null
    previewLocalSpouse.value = null
    console.log('Member changed:', newVal)
  },
  { immediate: true }, // jangan ada koma di sini
)
</script>

<style scoped>
.glass-card {
  width: 650px;
  max-width: 95vw;
  border-radius: 22px;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.header {
  padding: 20px 24px;
}
.upload-wrapper {
  padding: 5px 0;
}
.section-title {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 12px;
  color: #444;
}
.upload-box {
  display: flex;
  align-items: center;
  gap: 20px;
}
.avatar {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;
}
.avatar:hover {
  transform: scale(1.05);
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}
.uploader {
  flex: 1;
  border-radius: 14px;
  transition: 0.3s ease;
}
.uploader:hover {
  transform: translateY(-2px);
}
.btn-save {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border-radius: 14px;
  padding: 10px 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: 0.3s ease;
}
.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
}
</style>
