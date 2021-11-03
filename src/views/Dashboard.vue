<template>
  <div>
    <CTabs :key="activeTabKey">
      <CTab v-for="team in teams" :key="team.id" :title="team.name">
        <CCard v-for="kpi in kpis(team.id)" :key="kpi.id" class="mt-4">
          <CCardBody>
            <CRow>
              <CCol>
                <h4 class="card-title mb-1">
                  {{ kpi.name }}
                  <CIcon class="ml-2 text-info cursor-pointer" v-if="kpi.definition" name="cil-magnifying-glass" v-c-tooltip="{content: kpi.definition, placement: 'bottom', boundaries: 'viewport' }" />
                </h4>
                <div class="small text-muted"><span class="text-nowrap mr-3"><span class="text-info">Owner: </span>{{ getOwner(kpi.owner) }}</span><span class="text-nowrap"><span class="text-info">Frequency: </span>{{ kpi.frequency }}</span></div>
              </CCol>
            </CRow>
            <KpiChart :kpi_id="kpi.id" />
          </CCardBody>
        </CCard>
        <NoItemsCard v-if="kpis(team.id).length == 0" text="No KPI's assigned" />
      </CTab>
    </CTabs>
    <NoItemsCard v-if="teams.length == 0" text="No Teams assigned" />
  </div>
</template>

<script>
import KpiChart from './charts/KpiChart'
import NoItemsCard from '../components/NoItemsCard'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    KpiChart,
    NoItemsCard
  },
  computed: {
    ...mapState({
      activeSectionId: state => state.kpiData.activeSectionId,
      activeTabKey: state => state.kpiData.activeTabKey,
    }),
    ...mapGetters({
      getItemById: 'kpiData/getItemById',
      getKpiByTeam: 'kpiData/getKpiByTeam',
      getTeamBySection: 'kpiData/getTeamBySection',
    }),
    teams() {
      return this.getTeamBySection(this.activeSectionId)
    },
  },
  methods: {
    kpis(id) {
      return this.getKpiByTeam(id)
    },
    getOwner(id) {
      if (this.getItemById({name: 'owners', id: id})) {
        return this.getItemById({name: 'owners', id: id}).name
      }
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.card-title >>> .arrow:before {
  border-bottom-color: #39f;
  border-top-color: #39f;
}
.card-title >>> .tooltip-old-inner {
  background-color: #fff;
  color: inherit;
  border: 1px solid #39f;
}
</style>