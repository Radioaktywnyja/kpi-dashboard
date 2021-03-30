<template>
    <div class="overlay">
        <CSpinner color="white" />
    </div>
</template>

<script>
export default {
  name: 'LoadSpinner'
}
</script>

<style lang="scss" scoped>
.overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #00000080;
    display: flex;
    align-items: center;
    justify-content: center;
    .spinner-border {
        width: 8em;
        height: 8em;
        border-width: 10px;
    }
}
</style>