<template>
  <q-page class="q-pa-lg flex flex-center bg-grey-2">
    <q-card style="width: 600px; max-width: 95vw" class="q-pa-md">
      <div class="text-h6 text-center q-mb-md">Tambah Anggota Keluarga</div>

      <q-form @submit.prevent="submitForm" class="q-gutter-md">
        <!-- Nama -->
        <q-input
          v-model="form.name"
          label="Nama Lengkap"
          outlined
          dense
          :rules="[(val) => !!val || 'Nama wajib diisi']"
        />

        <!-- Jenis Kelamin -->
        <q-select
          v-model="form.kelamin"
          :options="['Laki-laki', 'Perempuan']"
          label="Jenis Kelamin"
          outlined
          dense
          :rules="[(val) => !!val || 'Pilih jenis kelamin']"
        />

        <!-- Tanggal Lahir -->
        <q-input v-model="form.tgl_lahir" label="Tanggal Lahir" type="date" outlined dense />

        <!-- Status -->
        <q-input
          v-model="form.status"
          label="Status (Anak ke-, Kepala Keluarga, dll)"
          outlined
          dense
        />

        <!-- Pilih Parent -->
        <q-select
          v-model="form.parent_id"
          :options="parentOptions"
          label="Pilih Orang Tua"
          outlined
          dense
          emit-value
          map-options
        />

        <!-- Upload Foto -->
        <q-file v-model="form.photo" label="Upload Foto" outlined dense accept="image/*" />

        <!-- Tombol -->
        <div class="row justify-end q-gutter-sm">
          <q-btn label="Reset" type="reset" color="grey" flat @click="resetForm" />
          <q-btn label="Simpan" type="submit" color="primary" unelevated />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTreeStore } from 'src/stores/tree'
import { useRouter } from 'vue-router'

const store = useTreeStore()
const router = useRouter()

const form = ref({
  name: '',
  kelamin: '',
  tgl_lahir: '',
  status: '',
  parent_id: null,
  photo: null,
})

const parentOptions = computed(
  () =>
    store.allMembers?.map((member) => ({
      label: member.name,
      value: member.id,
    })) || [],
)

const submitForm = async () => {
  await store.addMember(form.value)
  router.push('/tree')
}

const resetForm = () => {
  form.value = {
    name: '',
    kelamin: '',
    tgl_lahir: '',
    status: '',
    parent_id: null,
    photo: null,
  }
}
</script>
