<template>
  <div class="mt-4">
    <CCard>
      <CCardHeader class="font-weight-bold">
        Owners
      </CCardHeader>

      <CCardBody>
        <CDataTable
          striped
          :items="owners"
          :fields="fields"
          :noItemsView="{ noResults: 'No filtering results available', noItems: 'There are no owners' }"
        >
        <template #actions="{item}">
          <ActionsTd type="owners" :item="item" @editItem="editItem" />
        </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader class="font-weight-bold">
        <span v-if="!isEdit">Add new Owner</span>
        <span v-else>Edit Owner</span>
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
import { mapState, mapGetters } from 'vuex'
import ActionsTd from './ActionsTd.vue'
export default {
    components: { ActionsTd },
    name: 'OwnersForm',
    data() {
      return {
        fields: [
          { key: 'name' },
          { key: 'actions', label: '' }
        ],
        storeFormData: {
          name: ""
        },
        isEdit: false
      }
    },
    computed: {
      ...mapState({owners: state => state.kpiData.owners}),
      ...mapGetters({
        getOwnerById: 'kpiData/getOwnerById'
      }),
      storePayload() {
        return { name: 'owners', data: this.storeFormData }
      }
    },
    methods: {
      reset() {
        this.isEdit = false
        this.storeFormData = {
          name: ""
        }
      },
      storeOwner() {
         if (this.isEdit) {
          this.$store.dispatch('kpiData/updateState', this.storePayload)
        } else {
          this.$store.dispatch('kpiData/addState', this.storePayload)
        }
        this.reset()
      },
      editItem(id) {
        this.isEdit = true
        let targetOwner = this.getOwnerById(id)
        this.storeFormData = {
          name: targetOwner.name,
          id: targetOwner.id
        }
      }
    }
}
</script>