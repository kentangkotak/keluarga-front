<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="width: 600px; max-width: 95vw">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">
          {{ isEdit ? 'Edit Anggota' : 'Tambah Anggota Keluarga' }}
          <q-btn
            v-if="isEdit"
            label="Foto"
            color="black"
            icon="add"
            rounded
            @click="tambahfoto(form.value)"
          />
        </div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <!-- Nama -->
          <q-input v-model="form.nama" label="Nama Lengkap" outlined dense />
          <q-select
            v-model="form.anakke"
            :options="[
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ]"
            label="Anak Ke"
            outlined
            dense
          />
          <!-- Jenis Kelamin -->
          <q-select
            v-model="form.kelamin"
            :options="['Laki-laki', 'Perempuan']"
            label="Jenis Kelamin"
            outlined
            dense
          />

          <!-- Tanggal Lahir -->
          <q-input v-model="form.tanggal_lahir" label="Tanggal Lahir" type="date" outlined dense />

          <!-- Parent -->
          <q-select
            v-model="form.parent_id"
            :options="parentOptions"
            label="Pilih Orang Tua"
            outlined
            dense
            emit-value
            map-options
          />

          <q-input v-model="form.alamat" label="Alamat" outlined dense />
          <q-input v-model="form.kota" label="Kota" outlined dense />
          <q-input v-model="form.nohp" label="Nomor HP" outlined dense />

          <!-- Upload Foto -->
          <!-- <q-file
            v-model="form.photo"
            label="Upload Foto"
            outlined
            dense
            accept="image/*"
            @update:model-value="previewImage"
          /> -->

          <!-- Preview -->
          <!-- <div v-if="preview" class="text-center">
            <img
              :src="preview"
              style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover"
            />
          </div> -->

          <!-- Tambah Pasangan -->
          <q-toggle v-model="form.showSpouse" label="Tambah Pasangan" color="primary" />

          <div v-if="form.showSpouse" class="q-gutter-sm">
            <q-input v-model="form.spouse.nama" label="Nama Pasangan" outlined dense />
            <q-select
              v-model="form.spouse.kelamin"
              :options="['Laki-laki', 'Perempuan']"
              label="Jenis Kelamin Pasangan"
              outlined
              dense
            />
            <q-input
              v-model="form.spouse.tanggal_lahir"
              label="Tanggal Lahir"
              type="date"
              outlined
              dense
            />
            <q-input v-model="form.spouse.nohp" label="Nomor HP" outlined dense />

            <!-- Upload Foto -->
            <!-- <q-file
              v-model="form.spouse.photo"
              label="Upload Foto"
              outlined
              dense
              accept="image/*"
              @update:model-value="previewImage"
            /> -->
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn flat label="Batal" v-close-popup />
            <q-btn
              color="primary"
              :label="isEdit ? 'Update' : 'Simpan'"
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

const props = defineProps({
  modelValue: Boolean,
  member: Object,
  editData: Object,
})
const isEdit = computed(() => !!props.member)
const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const emit = defineEmits(['update:modelValue'])
// dialogModel.value = false

const store = useTreeStore()

// const isEdit = computed(() => !!props.editData)

const form = ref({
  id: '',
  nama: '',
  anakke: '',
  kelamin: '',
  tanggal_lahir: '',
  showSpouse: false,
  alamat: '',
  kota: '',
  nohp: '',
  pernikahan_id: null,
  parent_id: null,
  // photo: null,
  spouse: {
    id: '',
    nama: '',
    kelamin: '',
    tanggal_lahir: '',
    nohp: '',
    // photo: null,
  },
})

// const preview = ref(null)

// function flattenTree(node, result = []) {
//   if (!node) return result

//   result.push({
//     id: node.id,
//     name: node.name,
//   })

//   if (node.children && node.children.length) {
//     node.children.forEach((child) => flattenTree(child, result))
//   }

//   return result
// }

const parentOptions = computed(() => {
  if (!Array.isArray(store.dataOrtu)) return []

  return store.dataOrtu.map((item) => ({
    label: `Bpk. ${item.nama_suami} & Ibu. ${item.nama_istri}`,
    value: item.suami_id,
  }))
})

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = JSON.parse(JSON.stringify(val))
      form.value.showSpouse = !!val.spouse
    }
  },
)

// const previewImage = (file) => {
//   if (file) {
//     preview.value = URL.createObjectURL(file)
//   }
// }

const submitForm = async () => {
  if (isEdit.value) {
    await store.addMember(form.value)
  } else {
    await store.addMember(form.value)
  }

  emit('update:modelValue', false)
}
// watchEffect(() => {
//   console.log('pernikahan:', store.dataOrtu)
//   console.log('OPTIONS:', parentOptions.value)
// })
watch(
  () => props.member,
  (val) => {
    console.log('member:', val)
    if (val) {
      form.value.id = val.id
      form.value.nama = val.name
      form.value.anakke = val.anakke
      form.value.kelamin = val.kelamin
      form.value.tanggal_lahir = val.tanggal_lahir
      form.value.alamat = val.alamat
      form.value.kota = val.kota
      form.value.pernikahan_id = val.pernikahan_id
      form.value.nohp = val.nohp
      form.value.parent_id = val.parent_id
      form.value.showSpouse = val.spouse === null ? false : true
      form.value.spouse.id = val.spouse?.id || ''
      form.value.spouse.nama = val.spouse?.name || ''
      form.value.spouse.kelamin = val.spouse?.kelamin || ''
      form.value.spouse.tanggal_lahir = val.spouse?.tanggal_lahir || ''
      form.value.spouse.nohp = val.spouse?.nohp || ''
      // form.value.photo = val.photo
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (val) => {
    if (val && !props.member) {
      resetForm()
    }
  },
)

const resetForm = () => {
  form.value = {
    id: '',
    nama: '',
    anakke: '',
    kelamin: '',
    tanggal_lahir: '',
    showSpouse: false,
    alamat: '',
    pernikahan_id: null,
    kota: '',
    nohp: '',
    parent_id: null,
    spouse: {
      id: '',
      nama: '',
      kelamin: '',
      tanggal_lahir: '',
      nohp: '',
    },
  }
}

function tambahfoto(val) {
  console.log('tambah foto', val)
}
</script>
