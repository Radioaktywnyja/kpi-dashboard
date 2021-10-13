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
          name: ""
        },
        isEdit: false
      }
    },
    computed: {
      ...mapState({teams: state => state.kpiData.teams}),
      ...mapGetters({
        getTeamById: 'kpiData/getTeamById'
      }),
      storePayload() {
        return { name: 'teams', data: this.storeFormData }
      }
    },
    methods: {
      reset() {
        this.isEdit = false
        this.storeFormData = {
          name: ""
        }
      },
      storeTeam() {
        if (this.isEdit) {
          this.$store.dispatch('kpiData/updateState', this.storePayload)
        } else {
          this.$store.dispatch('kpiData/addState', this.storePayload)
        }
        this.reset()
      },
      editItem(id) {
        this.isEdit = true
        let targetTeam = this.getTeamById(id)
        this.storeFormData = {
          name: targetTeam.name,
          id: targetTeam.id
        }
      }
    }
}
</script>