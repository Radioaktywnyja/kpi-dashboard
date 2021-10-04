<template>
  <div>
    <CTabs>
      <CTab v-for="team in teams" :key="team.id" :title="team.name">
        <CCard v-for="kpi in kpis(team.id)" :key="kpi.id" class="mt-4">
          <CCardBody>
            <CRow>
              <CCol>
                <h4 class="card-title mb-1">{{ kpi.name }}</h4>
                <div class="small text-muted"><span class="text-nowrap mr-3"><span class="text-info">Owner: </span>{{ getOwner(kpi.owner) }}</span><span class="text-nowrap"><span class="text-info">Frequency: </span>{{ kpi.frequency }}</span></div>
              </CCol>
            </CRow>
            <KpiChart :kpi_id="kpi.id" />
          </CCardBody>
        </CCard>
      </CTab>
    </CTabs>
  </div>
</template>

<script>
import KpiChart from './charts/KpiChart'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    KpiChart
  },
  computed: {
    ...mapState({teams: state => state.kpiData.teams}),
    ...mapGetters({
      getKpiByTeam: 'kpiData/getKpiByTeam',
      getOwnerById: 'kpiData/getOwnerById'
    })
  },
  methods: {
    kpis(id) {
      return this.getKpiByTeam(id)
    },
    getOwner(id) {
      if (this.getOwnerById(id)) {
        return this.getOwnerById(id).name
      }
    }
  },
  metaInfo() {
    return { title: this.$t("home") };
  },
  created() {
    this.$store.dispatch('kpiData/loadState', 'teams');
    this.$store.dispatch('kpiData/loadState', 'owners');
    this.$store.dispatch('kpiData/loadState', 'kpis');
    this.$store.dispatch('kpiData/loadState', 'values');
  },
}
</script>
