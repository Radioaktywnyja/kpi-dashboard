<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            src="img/avatars/6.jpg"
            class="c-avatar-img "
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>KPIs</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-bell"/> Notices
      <CBadge color="info" class="mfs-auto">{{ noticeCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CLink to="/users"><CIcon name="cil-user" /> Users</CLink>
    </CDropdownItem>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem @click.prevent="logout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      noticeCount: 42
    }
  },
  methods: {
    async logout (){
      await this.$store.dispatch('auth/LogOut').then(response => {
        this.$router.push({name: 'Login'})
      })
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>