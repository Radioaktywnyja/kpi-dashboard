<template>
  <div>
    <CTabs variant="pills">
      <CTab title="Values">
        <CTabs class="mt-4">
          <CTab v-for="team in teams" :key="team.id" :title="team.name">
            <CRow class="mt-4">
              <CCol lg="6" v-for="kpi in kpis(team.id)" :key="kpi.id">
                <ValuesForm :kpi_id="kpi.id" />
              </CCol>
            </CRow>
          </CTab>
        </CTabs>
      </CTab>
      <CTab title="KPIs">
        <CTabs class="mt-4">
          <CTab v-for="team in teams" :key="team.id" :title="team.name">
            <KPIsForm :team_id="team.id" />
          </CTab>
        </CTabs>
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
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Forms',
  components: {
    ValuesForm,
    KPIsForm,
    TeamsForm,
    OwnersForm
  },
  computed: {
    // ...mapState({kpis: state => state.kpiData.kpis}),
    ...mapState({teams: state => state.kpiData.teams}),
    ...mapGetters({
      getKpiByTeam: 'kpiData/getKpiByTeam',
    })
  },
  methods: {
    kpis(id) {
      return this.getKpiByTeam(id)
    }
  },
}
</script>
