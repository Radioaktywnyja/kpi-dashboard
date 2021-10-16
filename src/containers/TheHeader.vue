<template>
  <CHeader fixed with-subheader light>
    <CHeaderBrand class="ml-4 mr-auto mr-lg-4" to="/">
      <CIcon name="logo" height="48" alt="Logo"/>
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/forms">
          Forms
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="pl-3">
        <CDropdown color="primary" :toggler-text="activeDepartamentName" class="type-select m-2">
          <CDropdownItem v-for="departament in departaments" :key="departament.id" @click="setDepartament(departament.id)">{{ departament.name }}</CDropdownItem>
        </CDropdown>
      </CHeaderNavItem>
      <CHeaderNavItem v-if="sections.length > 0">
        <CDropdown color="info" :toggler-text="activeSectionName" class="type-select m-2">
          <CDropdownItem v-for="section in sections" :key="section.id" @click="setSection(section.id)">{{ section.name }}</CDropdownItem>
        </CDropdown>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  computed: {
    ...mapState({
      departaments: state => state.kpiData.departaments,
      activeDepartamentId: state => state.kpiData.activeDepartamentId,
      activeSectionId: state => state.kpiData.activeSectionId,
      activeTabKey: state => state.kpiData.activeTabKey,
    }),
    ...mapGetters({
      getItemById: 'kpiData/getItemById',
      getSectionByDepartament: 'kpiData/getSectionByDepartament'
    }),
    sections() {
      return this.getSectionByDepartament(this.activeDepartamentId);
    },
    activeDepartamentName() {
      return this.getItemById({name: 'departaments', id: this.activeDepartamentId}) ? this.getItemById({name: 'departaments', id: this.activeDepartamentId}).name : ''
    },
    activeSectionName() {
      return this.getItemById({name: 'sections', id: this.activeSectionId}) ? this.getItemById({name: 'sections', id: this.activeSectionId}).name : ''
    }
  },
  methods: {
    setDepartament(id) {
      this.$store.dispatch('kpiData/updateSimpleState', { name: 'activeDepartamentId', data: id })
      this.$store.dispatch('kpiData/updateSimpleState', { name: 'activeSectionId', data: this.getSectionByDepartament(id)[0].id })
    },
    setSection(id) {
      this.$store.dispatch('kpiData/updateSimpleState', { name: 'activeSectionId', data: id })
      this.$store.dispatch('kpiData/updateSimpleState', { name: 'activeTabKey', data: this.activeTabKey+1 })
    },
  }
}
</script>

<style scoped>
  .type-select >>> .dropdown-toggle {
    width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>