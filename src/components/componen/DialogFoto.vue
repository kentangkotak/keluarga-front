<template>
  <q-dialog v-model="dialogModelphotos" persistent>
    <q-card style="width: 600px; max-width: 95vw">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Upload Foto</div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <!-- Upload Foto -->
          <div>Upload Foto {{ props.member.nama }}</div>
          <q-uploader
            label="Upload Foto"
            outlined
            :color="props.member.kelamin === 'Laki-laki' ? 'primary' : 'pink'"
            dense
            accept="image/*"
            @added="onFileAdded"
          />

          <!-- Preview -->
          <!-- <div v-if="preview" class="text-center">
            <img
              :src="preview"
              style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover"
            />
          </div> -->
          <q-separator />
          <div>
            Upload Foto {{ props.member?.spouse?.nama }}
            <!-- <pre>{{ props.member }}</pre> -->
          </div>
          <q-uploader
            label="Upload Foto"
            outlined
            :color="props.member?.spouse?.kelamin === 'Laki-laki' ? 'primary' : 'pink'"
            dense
            accept="image/*"
            @added="onFileAddedspouse"
          />

          <!-- <div v-if="previewspouse" class="text-center">
            <img
              :src="previewspouse"
              style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover"
            />
          </div> -->
          <div class="row justify-end q-gutter-sm q-mt-md">
            <!-- <q-btn flat label="Batal" v-close-popup /> -->
            <q-btn
              color="primary"
              label="Simpan"
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
import { useTreeStore } from 'src/stores/tree'
import { computed } from 'vue'

const store = useTreeStore()
const props = defineProps({
  modelValue: Boolean,
  member: Object,
})

// const preview = ref(null)
// const previewspouse = ref(null)

// const previewImage = (file) => {
//   if (file) {
//     preview.value = URL.createObjectURL(file)
//   }
// }

// const previewImagespouse = (file) => {
//   if (file) {
//     previewspouse.value = URL.createObjectURL(file)
//   }
// }

const submitForm = async () => {
  const formData = new FormData()

  formData.append('id_anggota', props.member.id)

  if (props.member?.spouse?.id) {
    formData.append('spouse_id', props.member.spouse.id)
  }

  // langsung ambil file (tanpa __file)
  if (store.formphotos.photo?.length) {
    formData.append('photo', store.formphotos.photo[0])
  }

  if (store.formphotos.photospouse?.length) {
    formData.append('photospouse', store.formphotos.photospouse[0])
  }

  await store.uploadFoto(formData)
  // emit('update:modelValue', false)
}

const dialogModelphotos = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
const emit = defineEmits(['update:modelValue'])
const onFileAdded = (files) => {
  store.formphotos.photo = files
}
const onFileAddedspouse = (files) => {
  store.formphotos.photospouse = files
}
</script>
