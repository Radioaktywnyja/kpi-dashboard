<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center mb-5">
        <CIcon name="logo" height="48" alt="Logo"/>
      </CRow>
      <CRow class="justify-content-center">
        <CCol md="8">
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="submit">
                  <h1>KPI Dashboard Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    placeholder="Email"
                    autocomplete="username email"
                    v-model="form.email"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    v-model="form.password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CAlert color="danger" v-if="showError">
                    Email or Password is incorrect
                  </CAlert>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" type="submit" class="px-4">Login</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      showError: false
    };
  },
  methods: {
    ...mapActions({
      LogIn: "auth/LogIn"
    }),
    async submit() {
      const User = {
        email: this.form.email,
        password: this.form.password
      }
      await this.LogIn(User).then(result => {
        this.$router.push({name: 'Dashboard'});
        this.showError = false
      }).catch(error => {
        this.showError = true
      })
    },
  },
}
</script>
