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
        <template #actions="{item, index}">
          <ActionsTd type="kpis" :item="item" :itemIndex="index" @editItem="editItem" @toggleDetails="toggleDetails" />
        </template>
        <template #is_computed="{item}">
          <td>{{ item.is_computed ? 'auto' : 'manual' }}</td>
        </template>
        <template #details="{item, index}">
          <CCollapse :show="openedDetails == index" :duration="300">
            <CCardBody>
              <CRow>
                <CCol sm="12" :class="item.is_computed ? 'col-md-6 col-lg-8 mb-3 mb-md-0' : ''">
                  <h6 class="font-weight-bold">Definition:</h6>
                  <div class="small text-muted">
                    <span v-if="item.definition">{{ item.definition }}</span>
                    <i v-else>empty</i>
                  </div>
                </CCol>
                <CCol v-if="item.is_computed" sm="12" md="6" lg="4">
                  <h6 class="font-weight-bold">Related KPIs:</h6>
                  <div class="small text-muted">
                    <ul class="mb-0">
                      <li v-for="kpi in item.computed_kpis" :key="kpi.kpi_id">{{ getKpiName(kpi.kpi_id) }}</li>
                    </ul>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCollapse>
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
        <CRow class="form-group align-items-start mx-0 mb-1">
          <CCol sm="6" md="4" xl="4" class="px-2 mb-2">
            <CInput v-model="storeFormData.name" label="Name" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CSelect :value.sync="storeFormData.owner" label="Owner" :options="ownersOptions" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CSelect :value.sync="storeFormData.frequency" label="Freq" :options="frequencyOptions" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CInput v-model="storeFormData.unit" label="Unit" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CInput v-model="storeFormData.target" label="Target" class="m-0" />
          </CCol>
          <CCol sm="6" md="4" xl="2" class="px-2 mb-2">
            <CSelect :value.sync="storeFormData.is_computed" label="Type" :options="typeOptions" class="m-0" />
          </CCol>
          <CCol v-if="storeFormData.is_computed" sm="12" xl="4" class="px-2 mb-2">
            <KPISelect :computed_kpis="storeFormData.computed_kpis" @syncSelectedKpi="syncSelectedKpi" />
          </CCol>
          <CCol sm="12" md="6" class="px-2 mb-2">
            <CTextarea v-model="storeFormData.definition" label="Definition" class="m-0" />
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
import { mapState, mapGetters } from 'vuex'
import ActionsTd from './ActionsTd.vue'
import KPISelect from './KPISelect.vue'
export default {
    components: { ActionsTd, KPISelect },
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
          { key: 'is_computed', label: 'type' },
          { key: 'actions', label: '' },
        ],
        horizontalInput: { label: 'col-sm-3 px-0', input: 'col-sm-9 px-0'},
        frequencyOptions: ['daily', 'weekly', 'monthly'],
        typeOptions: [
          {value: false, label: 'manual'},
          {value: true, label: 'auto'}
        ],
        storeFormData: {
          name: "",
          frequency: "",
          owner: 1,
          team_id: this.team_id,
          target: "",
          unit: "",
          definition: "",
          is_computed: false,
          computed_kpis: []
        },
        isEdit: false,
        openedDetails: null
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
          unit: "",
          definition: "",
          is_computed: false,
          computed_kpis: []
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
          definition: targetKpi.definition,
          is_computed: targetKpi.is_computed,
          computed_kpis: targetKpi.computed_kpis,
          id: targetKpi.id
        }
      },
      toggleDetails(itemIndex) {
        if (this.openedDetails == itemIndex) {
          this.openedDetails = null
        } else {
          this.openedDetails = itemIndex
        }
      },
      getKpiName(id) {
        if (this.getItemById({name: 'kpis', id: id})) {
          return this.getItemById({name: 'kpis', id: id}).name
        }
      },
      syncSelectedKpi(selectedKPIs) {
        this.storeFormData.computed_kpis = selectedKPIs
      }
    }
}
</script>