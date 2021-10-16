<template>
  <div>
    <CTabs :key="activeTabKey" variant="pills">
      <CTab title="Values">
        <CTabs class="mt-4">
          <CTab v-for="team in teams" :key="team.id" :title="team.name">
            <CRow class="mt-4">
              <CCol lg="6" v-for="kpi in kpis(team.id)" :key="kpi.id">
                <ValuesForm :kpi_id="kpi.id" />
              </CCol>
            </CRow>
            <NoItemsCard v-if="kpis(team.id).length == 0" text="No KPI's assigned" />
          </CTab>
        </CTabs>
        <NoItemsCard v-if="teams.length == 0" text="No Teams assigned" />
      </CTab>
      <CTab title="KPIs">
        <CTabs class="mt-4">
          <CTab v-for="team in teams" :key="team.id" :title="team.name">
            <KPIsForm :team_id="team.id" />
          </CTab>
        </CTabs>
        <NoItemsCard v-if="teams.length == 0" text="No Teams assigned" />
      </CTab>
      <CTab title="Teams">
        <TeamsForm />
      </CTab>
      <CTab title="Owners">
        <OwnersForm />
      </CTab>
    </CTabs>
  </div>
</template>

<script>
import ValuesForm from '../../components/ValuesForm'
import KPIsForm from '../../components/KPIsForm'
import TeamsForm from '../../components/TeamsForm'
import OwnersForm from '../../components/OwnersForm'
import NoItemsCard from '../../components/NoItemsCard'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Forms',
  components: {
    ValuesForm,
    KPIsForm,
    TeamsForm,
    OwnersForm,
    NoItemsCard
  },
  computed: {
    // ...mapState({kpis: state => state.kpiData.kpis}),
    ...mapState({
      activeSectionId: state => state.kpiData.activeSectionId,
      activeTabKey: state => state.kpiData.activeTabKey,
    }),
    ...mapGetters({
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
    }
  },
}
</script>
