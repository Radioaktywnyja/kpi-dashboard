<template>
  <div class="mt-4">
    <CCard>
      <CCardHeader class="font-weight-bold">
        Owners
      </CCardHeader>

      <CCardBody>
        <CDataTable v-if="owners.length"
          striped
          :items="owners"
          :fields="fields"
        >
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader class="font-weight-bold">
        Add new Owner
      </CCardHeader>

      <CCardBody>
          <CInput label="Name" v-model="storeFormData.name" horizontal class="m-0" />
      </CCardBody>
      
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" class="mr-2" @click.prevent="storeOwner"><CIcon name="cil-check-circle"/> Submit</CButton>
        <CButton type="reset" size="sm" color="danger" @click.prevent="reset"><CIcon name="cil-ban"/> Reset</CButton>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'OwnersForm',
    data() {
      return {
        fields: [
          { key: 'name' },
        ],
        storeFormData: {
          name: ""
        }
      }
    },
    computed: {
      ...mapState({owners: state => state.kpiData.owners}),
      storePayload() {
        return { name: 'owners', data: this.storeFormData }
      }
    },
    methods: {
      reset() {
        this.storeFormData = {
          name: ""
        }
      },
      storeOwner() {
        this.$store.dispatch('kpiData/addState', this.storePayload)
        this.reset()
      }
    }
}
</script>