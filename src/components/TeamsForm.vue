<template>
  <div class="mt-4">
    <CCard>
      <CCardHeader class="font-weight-bold">
        Teams
      </CCardHeader>

      <CCardBody>
        <CDataTable
          striped
          :items="teams"
          :fields="fields"
          :noItemsView="{ noResults: 'No filtering results available', noItems: 'There are no teams' }"
        >
        <template #actions="{item}">
          <ActionsTd type="teams" :item="item" @editItem="editItem" />
        </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader class="font-weight-bold">
        <span v-if="!isEdit">Add new Team</span>
        <span v-else>Edit Team</span>
      </CCardHeader>

      <CCardBody>
          <CInput label="Name" v-model="storeFormData.name" horizontal class="m-0" />
      </CCardBody>
      
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" class="mr-2" @click.prevent="storeTeam"><CIcon name="cil-check-circle"/> Submit</CButton>
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
    name: 'TeamsForm',
    data() {
      return {
        fields: [
          { key: 'name' },
          { key: 'actions', label: '' }
        ],
        storeFormData: {
          name: "",
          section_id: null
        },
        isEdit: false
      }
    },
    computed: {
      ...mapState({activeSectionId: state => state.kpiData.activeSectionId}),
      ...mapGetters({
        getItemById: 'kpiData/getItemById',
        getTeamBySection: 'kpiData/getTeamBySection',
      }),
      teams() {
        return this.getTeamBySection(this.activeSectionId)
      },
      storePayload() {
        return { name: 'teams', data: this.storeFormData }
      }
    },
    methods: {
      reset() {
        this.isEdit = false
        this.storeFormData = {
          name: "",
          section_id: this.activeSectionId,
        }
      },
      storeTeam() {
        if (this.isEdit) {
          this.$store.dispatch('kpiData/updateApiState', this.storePayload)
        } else {
          this.$store.dispatch('kpiData/addApiState', this.storePayload)
        }
        this.reset()
      },
      editItem(id) {
        this.isEdit = true
        let targetTeam = this.getItemById({name: 'teams', id: id})
        this.storeFormData = {
          name: targetTeam.name,
          section_id: this.activeSectionId,
          id: targetTeam.id
        }
      }
    },
    mounted() {
      this.storeFormData.section_id = this.activeSectionId
    }
}
</script>