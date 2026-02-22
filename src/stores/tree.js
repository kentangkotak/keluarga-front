import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useTreeStore = defineStore('tree-store', {
  state: () => ({
    items: [],
    loading: false,
    isError: false,
    params: {
      id: 1,
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
            console.log('sasasasa', this.items)
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
            this.loading = false
            resolve(response.data)
          })
          .catch((error) => {
            this.loading = false
            reject(error)
          })
      })
    },
  },
})
