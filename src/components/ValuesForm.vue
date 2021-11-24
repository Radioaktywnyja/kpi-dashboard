<template>
  <div>
    <CCard>
      <CCardHeader class="font-weight-bold h5">
        {{kpiData.name}} ({{kpiData.unit}}) - {{kpiData.frequency}}
      </CCardHeader>

      <CCardBody>
        <CDataTable
          striped
          columnFilter
          sorter
          :items="kpiValues"
          :fields="fields"
          :items-per-page="items_per_page > 0 ? items_per_page : 5"
          :active-page="1"
          :pagination="{ doubleArrows: false, align: 'center'}"
          :noItemsView="{ noResults: 'No filtering results available', noItems: 'No values for this KPI' }"
        >
        <template #actions="{item}">
          <ActionsTd type="values" :item="item" @editItem="editItem" />
        </template>
        <template #comment="{item}">
          <td>
            <span v-if="item.comment">{{ item.comment }}</span>
            <i v-else>empty</i>
          </td>
        </template>
        </CDataTable>

        <div v-if="showActions">
          <span v-if="!isEdit" class="font-weight-bold mb-2 d-block">Add new Values</span>
          <span v-if="isEdit" class="font-weight-bold mb-2 d-block">Edit Value</span>
          <CRow class="form-group align-items-center mx-0 mb-1" v-for="(n,index) in rowsCount" :key="n">
            <CCol sm="10" md="11" class="p-2 mb-2 d-flex flex-wrap justify-content-between bg-light rounded">
              <CInput label="Date" type="date" :horizontal="horizontalInput" v-model="storeFormData[index].date" class="my-1 mx-0 pr-3 flex-grow-1 flex-lg-grow-0" />
              <CInput v-if="!isStacked" label="Value" :horizontal="horizontalInput" v-model="storeFormData[index].value" class="my-1 mx-0 pr-3 flex-grow-1 flex-lg-grow-0" />
              <CTextarea label="Comment" :horizontal="horizontalInput" v-model="storeFormData[index].comment" class="my-1 mx-0 pr-3 flex-grow-1" />
              <div class="d-inline-flex flex-wrap flex-md-nowrap flex-grow-1" v-if="isStacked">
                <CInput v-for="(item,i) in kpiData.stacked_values" :key="item.label" :label="item.label" :horizontal="horizontalInput" v-model="storeFormData[index].value[i]" class="my-1 mx-0 pr-3 flex-grow-1" />
              </div>
            </CCol>
            <CCol v-if="!isEdit" sm="2" md="1" class="p-2 d-flex">
              <CButton color="secondary" size="sm" class="mr-2" @click.prevent="addValue">+</CButton>
              <CButton v-if="index != 0" color="secondary" size="sm" @click.prevent="reduceValue">-</CButton>
            </CCol>
          </CRow>
        </div>
      </CCardBody>
      <CCardFooter v-if="showActions">
        <CButton type="submit" size="sm" color="primary" class="mr-2" @click.prevent="storeValues"><CIcon name="cil-check-circle"/> Submit</CButton>
        <CButton type="reset" size="sm" color="danger" @click.prevent="reset"><CIcon name="cil-ban"/> Reset</CButton>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ActionsTd from './ActionsTd.vue'

export default {
  components: { ActionsTd },
  name: 'ValuesForm',
  props: {
    'kpi_id': Number,
    'items_per_page': Number
  },
  data () {
    return {
      rowsCount: 1,
      horizontalInput: { label: 'pl-0', input: 'pr-0 flex-grow-1'},
      storeFormData: [
        {
          status: "published",
          date: new Date().toISOString().split('T')[0],
          value: 0,
          comment: '',
          kpi_id: this.kpi_id
        }
      ],
      isEdit: false
    }
  },
  computed: {
    ...mapGetters({
      getItemById: 'kpiData/getItemById',
      getValuesByKpi: 'kpiData/getValuesByKpi',
    }),
    ...mapState({
      userEmail: state => state.auth.user.email,
    }),
    kpiData() {
      return this.getItemById({name: 'kpis', id: this.kpi_id});
    },
    kpiValues() {
      let that = this
      return this.getValuesByKpi(this.kpi_id).sort((a, b) => b.date > a.date ? 1 : -1).map((item) => {
        if (that.isStacked) {
          if (typeof item.value === 'string') {
            item.value = JSON.parse(item.value)
          }
          that.kpiData.stacked_values.forEach((stack, i) => {
            item[stack.label] = item.value[i]
          })
        }
        return item
      });
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
    showActions() {
      let showActions = false
      if (this.kpiData.editors_emails && this.kpiData.editors_emails.some(item => item.editors_email == this.userEmail )) {
        showActions = true
      }
      return showActions
    },
    fields() {
      let fields = [
        { key: 'date' },
        { key: 'comment' },
      ]
      if (this.isStacked) {
        this.kpiData.stacked_values.forEach((stack,i) => {
          fields.splice(1+i, 0, { key: stack.label })
        })
      } else {
        fields.splice(1, 0, { key: 'value' })
      }
      if (this.showActions) {
        fields.push({ key: 'actions', label: '', filter: false, sorter: false })
      }
      return fields
    },
    isStacked() {
      return this.kpiData.type == "stacked"
    }
  },
  methods: {
    addValue() {
      this.rowsCount++
      this.storeFormData.push({
        status: "published",
        date: this.setNextDate(this.lastDate, this.rowsCount - 1),
        value: 0,
        comment: '',
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
          status: "published",
          date: this.kpiValues.length ? this.setNextDate(this.kpiValues[0].date) : new Date().toISOString().split('T')[0],
          value: this.isStacked ? Array(this.kpiData.stacked_values.length).fill(0) : 0,
          comment: '',
          kpi_id: this.kpi_id
        }
      ]
    },
    setNextDate(date, counter = 1) {
      let lastDate = new Date(date)
      switch (this.kpiData.frequency) {
        case 'yearly':  
          lastDate.setMonth(lastDate.getMonth() + (12*counter))
          break
        case 'quarterly':  
          lastDate.setMonth(lastDate.getMonth() + (3*counter))
          break
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
      this.stringifyValues()
      if (this.isEdit) {
        this.$store.dispatch('kpiData/updateApiState', this.storePayload)
          .then(() => {
            this.reset()
          });
      } else {
        this.$store.dispatch('kpiData/addApiState', this.storePayload)
          .then(() => {
            this.reset()
          });
      }
    },
    editItem(id) {
      this.isEdit = true
      let targetValue = this.getItemById({name: 'values', id: id})
      this.storeFormData = [
        {
          date: targetValue.date,
          value: (typeof targetValue.value === 'string') ? JSON.parse(targetValue.value) : targetValue.value,
          comment: targetValue.comment,
          kpi_id: targetValue.kpi_id,
          id: targetValue.id
        }
      ]
    },
    stringifyValues() {
      if (this.isStacked) {
        this.storeFormData.map((item) => {
          item.value = JSON.stringify(item.value)
        })
      } else {
        this.storeFormData.value = JSON.stringify(this.storeFormData.value)
      }
    }
  },
  created() {
    if (this.kpiValues.length) {
      this.storeFormData[0].date = this.setNextDate(this.kpiValues[0].date)
    } 
    if (this.isStacked) {
      this.storeFormData[0].value = Array(this.kpiData.stacked_values.length).fill(0)
    }
  }
}
</script>

<style scoped>
.card-body >>> textarea {
  height: 35px;
}
</style>