<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card class="form-card">
      <!-- Header -->
      <div class="form-header">
        <div class="header-left">
          <q-icon name="people" size="22px" color="white" />
          <span class="header-title">{{
            isEdit ? 'Edit Anggota' : 'Tambah Anggota Keluarga'
          }}</span>
        </div>
        <div class="header-right">
          <q-btn
            v-if="isEdit"
            label="Foto"
            icon="add_a_photo"
            flat
            rounded
            dense
            class="foto-btn"
            @click="tambahfoto()"
          />
          <q-btn icon="close" flat round dense color="white" v-close-popup />
        </div>
      </div>

      <q-card-section class="form-body">
        <q-form @submit.prevent="submitForm">
          <!-- Section: Data Anggota -->
          <div class="section-label">👤 Data Anggota</div>
          <div class="form-fields">
            <q-input v-model="form.nama" label="Nama Lengkap" outlined dense />
            <q-select
              v-model="form.kelamin"
              :options="['Laki-laki', 'Perempuan']"
              label="Jenis Kelamin"
              outlined
              dense
            />
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
            <q-input
              v-model="form.tanggal_lahir"
              label="Tanggal Lahir"
              type="date"
              outlined
              dense
            />
            <q-select
              v-model="form.parent_id"
              :options="parentOptions"
              label="Pilih Orang Tua"
              outlined
              dense
              emit-value
              map-options
            />
          </div>

          <!-- Section: Kontak & Alamat -->
          <div class="section-label">📍 Kontak & Alamat</div>
          <div class="form-fields">
            <q-input v-model="form.nohp" label="Nomor HP" outlined dense />
            <q-input v-model="form.kota" label="Kota" outlined dense />
            <q-input v-model="form.alamat" label="Alamat" outlined dense />
          </div>

          <!-- Toggle Pasangan -->
          <div class="spouse-toggle">
            <q-toggle v-model="form.showSpouse" label="Tambah Pasangan" color="primary" />
          </div>

          <!-- Section: Data Pasangan -->
          <div v-if="form.showSpouse" class="spouse-section">
            <div class="section-label">💍 Data Pasangan</div>
            <div class="form-fields">
              <q-input v-model="form.spouse.nama" label="Nama Pasangan" outlined dense />
              <q-select
                v-model="form.spouse.kelamin"
                :options="['Laki-laki', 'Perempuan']"
                label="Jenis Kelamin"
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
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <q-btn flat label="Batal" class="btn-cancel" v-close-popup />
            <q-btn
              :label="isEdit ? 'Update' : 'Simpan'"
              type="submit"
              unelevated
              class="btn-submit"
              :loading="store.loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
  <FormdialogFoto v-model="showDialogphotos" :member="form" />
</template>

<style scoped>
.form-card {
  width: 580px;
  max-width: 95vw;
  max-height: 90vh;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.form-header {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title {
  color: white;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.foto-btn {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 0.8rem;
  padding: 4px 12px;
}

.form-body {
  padding: 20px 24px 16px;
  overflow-y: auto;
  flex: 1;
}

.section-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 16px 0 10px;
  padding-bottom: 6px;
  border-bottom: 2px solid #eff6ff;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spouse-toggle {
  margin: 16px 0 4px;
}

.spouse-section {
  background: #f8faff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 4px 14px 14px;
  margin-bottom: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel {
  color: #64748b;
  font-weight: 600;
}

.btn-submit {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-weight: 700;
  border-radius: 10px;
  padding: 6px 24px;
}
</style>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTreeStore } from 'src/stores/tree'
import FormdialogFoto from './DialogFoto.vue'

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

const showDialogphotos = ref(false)

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
      form.value.photo = val.photo
      form.value.parent_id = val.parent_id
      form.value.showSpouse = val.spouse === null ? false : true
      form.value.spouse.id = val.spouse?.id || ''
      form.value.spouse.nama = val.spouse?.name || ''
      form.value.spouse.kelamin = val.spouse?.kelamin || ''
      form.value.spouse.tanggal_lahir = val.spouse?.tanggal_lahir || ''
      form.value.spouse.nohp = val.spouse?.nohp || ''
      form.value.spouse.photo = val.spouse?.photo || ''
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

function tambahfoto() {
  showDialogphotos.value = true
}
</script>
