<template>
    <td class="py-2 text-center" :style="actionTdStyles">
        <CButton color="warning" class="mr-2" size="sm" @click="emitEdit" title="Edit"><CIcon name="cil-pencil"/></CButton>
        <CButton color="danger" size="sm" @click="deleteModal = true"  title="Delete"><CIcon name="cil-trash"/></CButton>
        <CButton v-if="showDetailsButton" color="info" class="ml-2" size="sm" @click="emitToggleDetails" title="Details"><CIcon name="cil-plus"/></CButton>
        <CModal title="Delete item" color="danger" :show.sync="deleteModal" @update:show="removeItem">
          Are you sure you want to delete '{{identifier}}' from '{{type}}'
        </CModal>
    </td>
</template>

<script>
export default {
    name: 'ActionsTD',
    props: ['type', 'item', 'itemIndex'],
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
      },
      showDetailsButton() {
        return this.type == 'kpis' ? true : false
      },
      actionTdStyles() {
        return {
          'min-width': this.showDetailsButton ? '145px' : '100px'
        }
      }
    },
    methods: {
      removeItem(status, evt, accept) {
        if (accept) {
          this.$store.dispatch('kpiData/removeApiState', {name: this.type, id: this.item.id})
        }
      },
      emitEdit() {
        this.$emit('editItem', this.item.id)
      },
      emitToggleDetails() {
        this.$emit('toggleDetails', this.itemIndex)
      }
    }
}
</script>