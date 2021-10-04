<template>
  <div>
    <CCard>
      <CCardHeader class="font-weight-bold">
        {{kpiData.name}} ({{kpiData.unit}})
      </CCardHeader>

      <CCardBody>
        <CDataTable v-if="kpiValues.length"
          striped
          :items="kpiValues"
          :fields="fields"
          :items-per-page="5"
          :active-page="1"
          :pagination="{ doubleArrows: false, align: 'center'}"
        >
        </CDataTable>

        <span class="font-weight-bold mb-2 d-block">Add new Values</span>
        <CRow class="form-group align-items-center mx-0 mb-1" v-for="(n,index) in rowsCount" :key="n">
          <CCol sm="5" class="px-2">
            <CInput v-if="index == 0" label="Date" type="date" :horizontal="horizontalInput" v-model="storeFormData[0].date" class="m-0" />
            <CInput v-else label="Date" type="date" :horizontal="horizontalInput" v-model="storeFormData[index].date" class="m-0" />
          </CCol>
          <CCol sm="5" class="px-2">
            <CInput label="Value" :horizontal="horizontalInput" v-model="storeFormData[index].value" class="m-0" />
          </CCol>
          <CCol sm="1" class="p-2 d-flex">
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

export default {
  name: 'ValuesForm',
  props: ['kpi_id'],
  data () {
    return {
      fields: [
        { key: 'date' },
        { key: 'value' }
      ],
      rowsCount: 1,
      horizontalInput: { label: 'col-sm-3 px-0', input: 'col-sm-9 px-0'},
      storeFormData: [
        {
          date: new Date().toISOString().split('T')[0],
          value: 0,
          kpi_id: this.kpi_id
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getKpiById: 'kpiData/getKpiById',
      getValuesByKpi: 'kpiData/getValuesByKpi'
    }),
    kpiData() {
      return this.getKpiById(this.kpi_id);
    },
    kpiValues() {
      return this.getValuesByKpi(this.kpi_id).sort((a, b) => b.date > a.date ? 1 : -1);
    },
    storePayload() {
      return { name: 'values', data: this.storeFormData }
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
      this.$store.dispatch('kpiData/addState', this.storePayload)
        .then(() => {
          this.reset()
        });
    }
  },
  created() {
    if (this.kpiValues.length) {
      this.storeFormData[0].date = this.setNextDate(this.kpiValues[0].date)
    } 
  }
}
</script>
