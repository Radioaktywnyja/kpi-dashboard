<template>
  <div class="mt-4">
    <CCard>
      <CCardHeader class="font-weight-bold">
        Teams
      </CCardHeader>

      <CCardBody>
        <CDataTable v-if="teams.length"
          striped
          :items="teams"
          :fields="fields"
        >
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader class="font-weight-bold">
        Add new Team
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
import { mapState } from 'vuex'
export default {
    name: 'TeamsForm',
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
      ...mapState({teams: state => state.kpiData.teams}),
      storePayload() {
        return { name: 'teams', data: this.storeFormData }
      }
    },
    methods: {
      reset() {
        this.storeFormData = {
          name: ""
        }
      },
      storeTeam() {
        this.$store.dispatch('kpiData/addState', this.storePayload)
        this.reset()
      }
    }
}
</script>