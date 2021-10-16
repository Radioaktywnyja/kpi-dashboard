<template>
  <div class="mt-4">
    <CCard>
      <CCardHeader class="font-weight-bold">
        KPI's
      </CCardHeader>

      <CCardBody>
        <CDataTable
          striped
          :items="kpis"
          :fields="fields"
          :noItemsView="{ noResults: 'No filtering results available', noItems: 'No kpis for this team' }"
        >
        <template #actions="{item}">
          <ActionsTd type="kpis" :item="item" @editItem="editItem" />
        </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader class="font-weight-bold">
        <span v-if="!isEdit">Add new KPI</span>
        <span v-else>Edit KPI</span>
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
import ActionsTd from './ActionsTd.vue'
export default {
    components: { ActionsTd },
    name: 'KPIsForm',
    props: ['team_id'],
    data() {
      return {
        fields: [
          { key: 'name' },
          { key: 'ownerName', label: 'owner' },
          { key: 'frequency' },
          { key: 'unit' },
          { key: 'target' },
          { key: 'actions', label: '' }
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
        },
        isEdit: false
      }
    },
    computed: {
      ...mapGetters({
        getItemById: 'kpiData/getItemById',
        getKpiByTeam: 'kpiData/getKpiByTeam',
      }),
      ...mapState({owners: state => state.kpiData.owners}),
      kpis() {
        let that = this
        return this.getKpiByTeam(this.team_id).map(function(kpi) {
          if (that.getItemById({name: 'owners', id: kpi.owner})) {
            kpi.ownerName = that.getItemById({name: 'owners', id: kpi.owner}).name
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
        this.isEdit = false
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
        if (this.isEdit) {
          this.$store.dispatch('kpiData/updateApiState', this.storePayload)
        } else {
          this.$store.dispatch('kpiData/addApiState', this.storePayload)
        }
        this.reset()
      },
      editItem(id) {
        this.isEdit = true
        let targetKpi = this.getItemById({name: 'kpis', id: id})
        this.storeFormData = {
          name: targetKpi.name,
          frequency: targetKpi.frequency,
          owner: targetKpi.owner,
          team_id: targetKpi.team_id,
          target: targetKpi.target,
          unit: targetKpi.unit,
          id: targetKpi.id
        }
      }
    }
}
</script>