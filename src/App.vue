<template>
  <router-view></router-view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState({
      activeSectionId: state => state.kpiData.activeSectionId,
    }),
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
    }),
    shouldInit() {
      return this.isAuthenticated && !this.activeSectionId
    }
  },
  created() {
    if (this.shouldInit) {
      this.$store.dispatch('kpiData/initState');
    }
  },
  watch: {
    shouldInit(newValue) {
      if (newValue) {
        this.$store.dispatch('kpiData/initState');
      }
    }
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
