<template>
  <CContainer class="d-flex align-items-center mt-5">
    <CRow class="w-100 justify-content-center">
      <CCol md="6">
        <div class="w-100 text-center">
            <h1 class="display-1 font-weight-bold">404</h1>
            <h4 class="pt-3">Oops! You're lost.</h4>
            <p class="text-muted">The page you are looking for was not found.</p>
            <CLink to="/dashboard"><CButton color="secondary" class="mt-3">Dashboard</CButton></CLink>
        </div>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
export default {
  name: 'Page404'
}
</script>
