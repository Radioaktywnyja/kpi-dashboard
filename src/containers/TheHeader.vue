<template>
  <CHeader fixed with-subheader light>
    <CHeaderBrand class="ml-4 mr-auto mr-xl-4 order-1" to="/">
      <CIcon name="logo" height="40" alt="Logo"/>
    </CHeaderBrand>
    <CHeaderNav class="header-dropdowns mr-auto order-3 order-xl-2 flex-wrap">
      <CHeaderNavItem class="header-moderator-nav d-flex pl-3 mr-3">
        <CHeaderNavLink to="/dashboard">
          <CButton color="secondary" class="py-1 mt-2">Dashboard</CButton>
        </CHeaderNavLink>
        <CHeaderNavLink to="/forms">
          <CButton color="secondary" class="py-1 mt-2">Forms</CButton>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="pl-3">
        <CDropdown color="primary" :toggler-text="activeDepartamentName" class="type-select mt-2 mx-2">
          <CDropdownItem v-for="departament in departaments" :key="departament.id" @click="setDepartament(departament.id)">{{ departament.name }}</CDropdownItem>
        </CDropdown>
      </CHeaderNavItem>
      <CHeaderNavItem class="pl-3" v-if="sections.length > 0">
        <CDropdown color="info" :toggler-text="activeSectionName" class="type-select mt-2 mx-2">
          <CDropdownItem v-for="section in sections" :key="section.id" @click="setSection(section.id)">{{ section.name }}</CDropdownItem>
        </CDropdown>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-4 order-2 order-xl-3">
      <CButton color="secondary" class="py-1 mt-2" @click.prevent="logout">Logout <CIcon name="cil-x-circle" class="mb-1" /></CButton>
    </CHeaderNav>
    <CSubheader class="px-3 mt-2 order-4">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'TheHeader',
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
    async logout (){
      await this.$store.dispatch('auth/LogOut').then(response => {
        this.$router.push({name: 'Login'})
      })
    }
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
  @media (max-width: 750px) {
    .header-moderator-nav {
      width: 100%;
    }
  }
  @media (max-width: 1199px) {
    .header-dropdowns {
      width: 100%;
    }
  }
</style>