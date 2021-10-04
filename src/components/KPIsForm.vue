<template>
  <div class="mt-4">
    <CCard>
      <CCardHeader class="font-weight-bold">
        KPI's
      </CCardHeader>

      <CCardBody>
        <CDataTable v-if="kpis.length"
          striped
          :items="kpis"
          :fields="fields"
        >
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader class="font-weight-bold">
        Add new KPI
      </CCardHeader>

      <CCardBody>
        <CRow class="form-group align-items-center mx-0 mb-1">
          <CCol sm="6" md="4" xl="4" class="px-2 mb-2">
            <CInput v-model="storeFormData.name" label="Name" :horizontal="horizontalInput" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CSelect :value.sync="storeFormData.owner" label="Owner" :horizontal="horizontalInput" :options="ownersOptions" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CSelect :value.sync="storeFormData.frequency" label="Freq" :horizontal="horizontalInput" :options="frequencyOptions" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CInput v-model="storeFormData.unit" label="Unit" :horizontal="horizontalInput" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CInput v-model="storeFormData.target" label="Target" :horizontal="horizontalInput" class="m-0" />
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" class="mr-2" @click.prevent="storeKpi"><CIcon name="cil-check-circle"/> Submit</CButton>
        <CButton type="reset" size="sm" color="danger" @click.prevent="reset"><CIcon name="cil-ban"/> Reset</CButton>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
    name: 'KPIsForm',
    props: ['team_id'],
    data() {
      return {
        fields: [
          { key: 'name' },
          { key: 'owner' },
          { key: 'frequency' },
          { key: 'unit' },
          { key: 'target' }
        ],
        horizontalInput: { label: 'col-sm-3 px-0', input: 'col-sm-9 px-0'},
        frequencyOptions: ['daily', 'weekly', 'monthly'],
        storeFormData: {
          name: "",
          frequency: "",
          owner: 1,
          team_id: this.team_id,
          target: "",
          unit: ""
        }
      }
    },
    computed: {
      ...mapGetters({
        getKpiByTeam: 'kpiData/getKpiByTeam',
        getOwnerById: 'kpiData/getOwnerById'
      }),
      ...mapState({owners: state => state.kpiData.owners}),
      kpis() {
        let that = this
        return this.getKpiByTeam(this.team_id).map(function(kpi) {
          if (that.getOwnerById(kpi.owner)) {
            kpi.owner = that.getOwnerById(kpi.owner).name
          }
          return kpi
        })
      },
      ownersOptions() {
        return this.owners.map(function(owner) {
          return {
            value: owner.id,
            label: owner.name
          }
        })
      },
      storePayload() {
        return { name: 'kpis', data: this.storeFormData }
      }
    },
    methods: {
      reset() {
        this.storeFormData = {
          name: "",
          frequency: "",
          owner: 1,
          team_id: this.team_id,
          target: "",
          unit: ""
        }
      },
      storeKpi() {
        this.$store.dispatch('kpiData/addState', this.storePayload)
        this.reset()
      }
    }
}
</script>