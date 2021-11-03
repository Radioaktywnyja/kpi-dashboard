<template>
  <div class="m-0 form-group">
    <label>Related KPIs</label>
    <!-- <CInput v-model="relatedKPIs[0].kpi_name" readonly class="m-0" /> -->
    <CRow class="form-group align-items-center mx-0 mb-1" v-for="(n,index) in rowsCount" :key="n">
      <CCol col="8" sm="9" class="p-0">
        <CInput v-model="relatedKPIs[index].kpi_name" readonly class="m-0" @click="showSelectModal(index)" />
      </CCol>
      <CCol col="3" sm="2" class="px-2 d-flex">
        <CButton color="secondary" size="sm" class="ml-2 mr-2" @click.prevent="addKPI">+</CButton>
        <CButton v-if="index != 0" color="secondary" size="sm" class="ml-1" @click.prevent="reduceKPI(index)"><CIcon name="cil-trash" size="sm"/></CButton>
      </CCol>
    </CRow>
    <CModal title="Select KPI" color="secondary" :show.sync="isModalActive" @update:show="setKpi">
      <CSelect :value.sync="relatedKPIs[activeModalIndex].departament" label="Departament" :options="departamentOptions" @change="resetDown('departament')" class="my-2" />
      <CSelect v-if="relatedKPIs[activeModalIndex].departament" :value.sync="relatedKPIs[activeModalIndex].section" label="Section" :options="sectionOptions" placeholder="Select section..." @change="resetDown('section')" class="my-2" />
      <CSelect v-if="relatedKPIs[activeModalIndex].section" :value.sync="relatedKPIs[activeModalIndex].team" label="Team" :options="teamOptions" placeholder="Select team..." @change="resetDown('team')" class="my-2" />
      <CSelect v-if="relatedKPIs[activeModalIndex].team" :value.sync="relatedKPIs[activeModalIndex].kpi_id" label="KPI" :options="kpiOptions" placeholder="Select kpi..." class="mt-3 font-weight-bold" />
    </CModal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'KPISelect',
  props: { 
    computed_kpis: Array 
  },
  data() {
    return {
      relatedKPIs: [
        {
          departament: null,
          section: null,
          team: null,
          kpi_id: null,
          kpi_name: 'Select KPI',
        }
      ],
      rowsCount: 1,
      isModalActive: false,
      activeModalIndex: 0
    }
  },
  computed: {
    ...mapState({ 
      activeDepartamentId: state => state.kpiData.activeDepartamentId,
      departaments: state => state.kpiData.departaments,
    }),
    ...mapGetters({
      getItemById: 'kpiData/getItemById',
      getKpiByTeam: 'kpiData/getKpiByTeam',
      getTeamBySection: 'kpiData/getTeamBySection',
      getSectionByDepartament: 'kpiData/getSectionByDepartament'
    }),
    departamentOptions() {
      return this.departaments.map((departament) => {
        return {
          value: departament.id,
          label: departament.name
        }
      })
    },
    sectionOptions() {
      let activeDepartament = this.relatedKPIs[this.activeModalIndex].departament
      return this.getSectionByDepartament(activeDepartament).map((section) => {
        return {
          value: section.id,
          label: section.name
        }
      })
    },
    teamOptions() {
      let activeSection = this.relatedKPIs[this.activeModalIndex].section
      return this.getTeamBySection(activeSection).map((team) => {
        return {
          value: team.id,
          label: team.name
        }
      })
    },
    kpiOptions() {
      let activeTeam = this.relatedKPIs[this.activeModalIndex].team
      return this.getKpiByTeam(activeTeam).map((kpi) => {
        return {
          value: kpi.id,
          label: kpi.name
        }
      })
    },
    selectedKPIs() {
      let selectedKPIs = []
      this.relatedKPIs.map((kpi) => {
        if (kpi.kpi_id) {
          selectedKPIs.push({ kpi_id: kpi.kpi_id })
        } 
      })
      return selectedKPIs
    }
  },
  methods: {
    addKPI() {
      this.rowsCount++
      this.relatedKPIs.push({
        departament: null,
        section: null,
        team: null,
        kpi_id: null,
        kpi_name: 'Select KPI',
      })
    },
    reduceKPI(index) {
      this.rowsCount--
      this.relatedKPIs.splice(index, 1)
      if (this.activeModalIndex == this.rowsCount) {
        this.activeModalIndex--
      }
      this.$emit('syncSelectedKpi', this.selectedKPIs)
    },
    showSelectModal(index) {
      this.isModalActive = true
      this.activeModalIndex = index
      if (this.relatedKPIs[index].departament == null) {
        this.relatedKPIs[index].departament = this.activeDepartamentId
      }
    },
    setKpi() {
      let relatedKpi = this.relatedKPIs[this.activeModalIndex]
      if (relatedKpi) {
        let relatedKpiData = this.getItemById({name: 'kpis', id: relatedKpi.kpi_id})
        if (relatedKpiData) {
          relatedKpi.kpi_name = relatedKpiData.name
        } else {
          relatedKpi.kpi_name = 'Select KPI'
        }
      } else {
        relatedKpi.kpi_id = null
        relatedKpi.kpi_name = 'Select KPI'
      }
      this.$emit('syncSelectedKpi', this.selectedKPIs)
    },
    resetDown(range) {
      if (range == 'departament') {
        this.relatedKPIs[this.activeModalIndex].section = null
      }
      if (['departament', 'section'].includes(range)) {
        this.relatedKPIs[this.activeModalIndex].team = null
      }
      if (['departament', 'section', 'team'].includes(range)) {
        this.relatedKPIs[this.activeModalIndex].kpi_id = null
      }
    }
  },
  created() {
    if (this.computed_kpis.length > 0) {
      this.rowsCount = this.computed_kpis.length
      this.computed_kpis.map((kpi, i) => {
        let kpiData = this.getItemById({name: 'kpis', id: kpi.kpi_id})
        let teamData = this.getItemById({name: 'teams', id: kpiData.team_id})
        let sectionData = this.getItemById({name: 'sections', id: teamData.section_id})
        this.relatedKPIs[i] = {
          departament: sectionData.departament_id,
          section: teamData.section_id,
          team: kpiData.team_id,
          kpi_id: kpi.kpi_id,
          kpi_name: kpiData.name,
        }
      })
    }
  },
  watch: {
    computed_kpis(newProp) {
      if (newProp.length > 0) {
        this.rowsCount = newProp.length
        this.relatedKPIs = []
        this.activeModalIndex = 0
        newProp.map((kpi, i) => {
          let kpiData = this.getItemById({name: 'kpis', id: kpi.kpi_id})
          let teamData = this.getItemById({name: 'teams', id: kpiData.team_id})
          let sectionData = this.getItemById({name: 'sections', id: teamData.section_id})
          this.relatedKPIs[i] = {
            departament: sectionData.departament_id,
            section: teamData.section_id,
            team: kpiData.team_id,
            kpi_id: kpi.kpi_id,
            kpi_name: kpiData.name,
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.form-group >>> .form-control[readonly] {
  background-color: #fff;
  cursor: pointer;
}
.font-weight-bold >>> select {
  border: 1px solid #3c4b64;
  color: #3c4b64;
}
.form-group >>> .modal-footer button:first-of-type {
  display: none;
}
</style>