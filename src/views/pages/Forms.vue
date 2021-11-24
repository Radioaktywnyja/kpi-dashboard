<template>
  <div>
    <CTabs :key="activeTabKey" variant="pills">
      <CTab title="Values">
        <CTabs class="mt-4">
          <CTab v-for="team in teams" :key="team.id" :title="team.name">
            <CRow class="mt-3">
              <CCol sm="12" class="d-flex flex-wrap">
                <div class="d-flex align-items-center ml-3 mb-3">Hide computed KPIs: <CSwitch class="ml-2" color="primary" variant = '3d' :checked.sync="hideAutomatic" /></div>
                <CInput label="Filter KPIs:" :horizontal="{ label: 'px-0 mr-2', input: 'px-0'}" v-model="filterKpis" placeholder="Enter KPI name" class="ml-3 text-nowrap" />
                <CInput type="number" label="Items per page:" :horizontal="{ label: 'px-0 mr-2', input: 'px-0'}" v-model.number="itemsPerPage" class="ml-3 text-nowrap" />
              </CCol>
              <CCol lg="12" v-for="kpi in kpis(team.id)" :key="kpi.id">
                <ValuesForm :kpi_id="kpi.id" :items_per_page="itemsPerPage" />
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
  data() {
    return {
      hideAutomatic: true,
      filterKpis: '',
      itemsPerPage: 5,
    }
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
      let kpis = this.getKpiByTeam(id);
      if (this.hideAutomatic) {
        kpis = kpis.filter((item) => {
          return item.type != 'computed'
        })
      }
      if (this.filterKpis) {
        kpis = kpis.filter((item) => {
          return item.name.toLowerCase().includes(this.filterKpis)
        })
      }
      return kpis
    }
  },
}
</script>
