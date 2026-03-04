import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifyError, notifySuccess } from 'src/utils/notify'

export const useTreeStore = defineStore('tree-store', {
  state: () => ({
    items: [],
    dataOrtu: [],
    loading: false,
    isError: false,
    params: {
      id: 1,
    },
    formphotos: {
      id_anggota: null,
      photo: null,
      spouse_id: null,
      photospouse: null,
    },
  }),
  actions: {
    getlist() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .get('/family-tree', { params: this.params })
          .then((response) => {
            this.items = response.data
            this.loading = false
            resolve(response.data)
          })
          .catch((error) => {
            this.loading = false
            reject(error)
          })
      })
    },
    addMember(data) {
      this.loading = true

      return new Promise((resolve, reject) => {
        api
          .post('/family-tree-simpan', data)
          .then((response) => {
            if (response.data.success === true) {
              this.items = response.data?.data?.original
              this.dataOrtu = response.data?.ortu?.original
              notifySuccess('Data Berhasil Disimpan')
            } else {
              notifyError('Data Gagal Disimpan')
            }
            this.loading = false
            resolve(response.data)
          })
          .catch((error) => {
            this.loading = false
            reject(error)
          })
      })
    },
    async cariortu() {
      this.loading = true
      try {
        const response = await api.get('/cari-ortu')

        // if (response.data.success) {
        this.dataOrtu = response.data
        // }
      } catch (error) {
        if (error.response) {
          // Validasi 422
          if (error.response.status === 422) {
            this.errors = error.response.data.errors
          }

          // Error Server 500
          if (error.response.status === 500) {
            this.$q.notify({
              type: 'negative',
              message: error.response.data.message,
            })
          }
        } else {
          console.error(error)
        }
      } finally {
        this.loading = false
      }
    },
    uploadFoto(formData) {
      this.loading = true

      return new Promise((resolve, reject) => {
        api
          .post('/upload-foto', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            if (response.data.success === true) {
              this.items = response.data?.data?.original
              this.dataOrtu = response.data?.ortu?.original
              this
              notifySuccess('Data Berhasil Disimpan')
            } else {
              notifyError('Data Gagal Disimpan')
            }
            this.loading = false
            resolve(response.data)
          })
          .catch((error) => {
            this.loading = false

            if (error.response) {
              // Error dari server
              if (error.response.status === 413) {
                notifyError('Ukuran file terlalu besar. Maksimal 5MB.')
              } else {
                notifyError('Terjadi kesalahan pada server.')
              }
            } else if (error.request) {
              // Request terkirim tapi tidak ada response
              notifyError('Server tidak merespons.')
            } else {
              notifyError('Terjadi kesalahan.')
            }
            reject(error)
          })
      })
    },
  },
})
