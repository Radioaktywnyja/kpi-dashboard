<template>
    <td class="py-2 text-center actions-td">
        <CButton color="warning" class="mr-2" size="sm" @click="emitEdit" title="Edit"><CIcon name="cil-pencil"/></CButton>
        <CButton color="danger" size="sm" @click="deleteModal = true"  title="Delete"><CIcon name="cil-trash"/></CButton>
        <CModal title="Delete item" color="danger" :show.sync="deleteModal" @update:show="removeItem">
          Are you sure you want to delete '{{identifier}}' from '{{type}}'
        </CModal>
    </td>
</template>

<script>
export default {
    name: 'ValuesForm',
    props: ['type', 'item'],
    data() {
      return {
        deleteModal: false,
        namedTypes: ['kpis', 'teams', 'owners'],
      }
    },
    computed: {
      identifier() {
        if (this.namedTypes.includes(this.type)) {
          return this.item.name
        } else if (this.type == 'values') {
          return this.item.date + ' - ' + this.item.value
        } else {
          return null
        }
      }
    },
    methods: {
      removeItem(status, evt, accept) {
        if (accept) {
          this.$store.dispatch('kpiData/removeState', {name: this.type, id: this.item.id})
        }
      },
      emitEdit(event) {
        this.$emit('editItem', this.item.id)
      }
    }
}
</script>

<style lang="scss" scoped>
.actions-td {
  min-width: 100px;
}
</style>