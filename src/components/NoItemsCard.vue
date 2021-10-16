<template>
    <CCard class="mt-4">
      <CCardBody>
        <h4 class="card-title mb-1">{{ text }}</h4>
      </CCardBody>
    </CCard>
</template>

<script>
export default {
  name: 'LoadSpinner',
  props: ['text']
}
</script>