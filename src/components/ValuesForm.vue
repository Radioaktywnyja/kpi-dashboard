<template>
  <div>
    <CCard>
      <CCardHeader class="font-weight-bold">
        {{kpiData.name}} ({{kpiData.unit}})
      </CCardHeader>

      <CCardBody>
        <CDataTable
          striped
          :items="kpiValues"
          :fields="fields"
          :items-per-page="5"
          :active-page="1"
          :pagination="{ doubleArrows: false, align: 'center'}"
          :noItemsView="{ noResults: 'No filtering results available', noItems: 'No values for this KPI' }"
        >
        <template #actions="{item}">
          <ActionsTd type="values" :item="item" @editItem="editItem" />
        </template>
        </CDataTable>

        <span v-if="!isEdit" class="font-weight-bold mb-2 d-block">Add new Values</span>
        <span v-if="isEdit" class="font-weight-bold mb-2 d-block">Edit Value</span>
        <CRow class="form-group align-items-center mx-0 mb-1" v-for="(n,index) in rowsCount" :key="n">
          <CCol sm="5" class="px-2">
            <CInput v-if="index == 0" label="Date" type="date" :horizontal="horizontalInput" v-model="storeFormData[0].date" class="m-0" />
            <CInput v-else label="Date" type="date" :horizontal="horizontalInput" v-model="storeFormData[index].date" class="m-0" />
          </CCol>
          <CCol sm="5" class="px-2">
            <CInput label="Value" :horizontal="horizontalInput" v-model="storeFormData[index].value" class="m-0" />
          </CCol>
          <CCol v-if="!isEdit" sm="1" class="p-2 d-flex">
            <CButton color="secondary" size="sm" class="mr-2" @click.prevent="addValue">+</CButton>
            <CButton v-if="index != 0" color="secondary" size="sm" @click.prevent="reduceValue">-</CButton>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" class="mr-2" @click.prevent="storeValues"><CIcon name="cil-check-circle"/> Submit</CButton>
        <CButton type="reset" size="sm" color="danger" @click.prevent="reset"><CIcon name="cil-ban"/> Reset</CButton>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ActionsTd from './ActionsTd.vue'

export default {
  components: { ActionsTd },
  name: 'ValuesForm',
  props: ['kpi_id'],
  data () {
    return {
      fields: [
        { key: 'date' },
        { key: 'value' },
        { key: 'actions', label: '' }
      ],
      rowsCount: 1,
      horizontalInput: { label: 'col-sm-3 px-0', input: 'col-sm-9 px-0'},
      storeFormData: [
        {
          date: new Date().toISOString().split('T')[0],
          value: 0,
          kpi_id: this.kpi_id
        }
      ],
      isEdit: false
    }
  },
  computed: {
    ...mapGetters({
      getKpiById: 'kpiData/getKpiById',
      getValuesByKpi: 'kpiData/getValuesByKpi',
      getValueById: 'kpiData/getValueById'
    }),
    kpiData() {
      return this.getKpiById(this.kpi_id);
    },
    kpiValues() {
      return this.getValuesByKpi(this.kpi_id).sort((a, b) => b.date > a.date ? 1 : -1);
    },
    storePayload() {
      if (this.isEdit) {
        return { name: 'values', data: this.storeFormData[0] }
      } else {
        return { name: 'values', data: this.storeFormData }
      }
    },
    lastDate() {
      return this.storeFormData[0].date;
    },
  },
  methods: {
    addValue() {
      this.rowsCount++
      this.storeFormData.push({
        date: this.setNextDate(this.lastDate, this.rowsCount - 1),
        value: 0,
        kpi_id: this.kpi_id
      })
    },
    reduceValue() {
      this.rowsCount--
      this.storeFormData.pop()
    },
    reset() {
      this.isEdit = false
      this.rowsCount = 1
      this.storeFormData = [
        {
          date: this.kpiValues.length ? this.setNextDate(this.kpiValues[0].date) : new Date().toISOString().split('T')[0],
          value: 0,
          kpi_id: this.kpi_id
        }
      ]
    },
    setNextDate(date, counter = 1) {
      let lastDate = new Date(date)
      switch (this.kpiData.frequency) {
        case 'monthly':  
          lastDate.setMonth(lastDate.getMonth() + (1*counter))
          break
        case 'weekly': 
          lastDate.setDate(lastDate.getDate() + (7*counter))
          break
        default: lastDate.setDate(lastDate.getDate() + (1*counter))
      }
      return lastDate.toISOString().split('T')[0]
    },
    storeValues() {
      if (this.isEdit) {
        this.$store.dispatch('kpiData/updateState', this.storePayload)
          .then(() => {
            this.reset()
          });
      } else {
        this.$store.dispatch('kpiData/addState', this.storePayload)
          .then(() => {
            this.reset()
          });
      }
    },
    editItem(id) {
      this.isEdit = true
      let targetValue = this.getValueById(id)
      this.storeFormData = [
        {
          date: targetValue.date,
          value: targetValue.value,
          kpi_id: targetValue.kpi_id,
          id: targetValue.id
        }
      ]
    }
  },
  created() {
    if (this.kpiValues.length) {
      this.storeFormData[0].date = this.setNextDate(this.kpiValues[0].date)
    } 
  }
}
</script>