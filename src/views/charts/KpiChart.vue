<template>
  <div class="chart-box">
    <div class="filter-box ">
      <div class="d-sm-inline-block mr-2 mt-2 position-relative"><CButton class="chart-button" block color="secondary" size="sm" @click.prevent="toggleChartType">{{otherChartType}} Chart</CButton></div>
      <div class="d-sm-inline-block mr-2 mt-2 text-nowrap"><span class="d-block d-sm-inline mr-2">Period:</span><date-picker class="range-select" v-model="dateRange" type="date" range placeholder="Select date range"></date-picker></div>
    </div>
    <component :is="chartType" style="height: 300px; margin-top: 40px"
      :datasets="dataset"
      :options="defaultOptions"
      :labels="dates"
    />
  </div>
</template>

<script>
import { CChartBar, CChartLine } from '@coreui/vue-chartjs'
import { customTooltips } from '../../assets/js/coreui-chartjs.js'
import { getStyle, hexToRgba } from '@coreui/utils/src'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { mapGetters } from 'vuex'

export default {
  name: 'KpiChart',
  components: {
    CChartBar,
    CChartLine,
    DatePicker
  },
  props: ['kpi_id'],
  data() {
    return {
      dateRange: [null, null],
      chartType: 'CChartBar'
    }
  },
  computed: {
    ...mapGetters({
      getItemById: 'kpiData/getItemById',
      getValuesByKpi: 'kpiData/getValuesByKpi',
      getValuesByMultipleKpis: 'kpiData/getValuesByMultipleKpis',
    }),
    kpiData() {
      return this.getItemById({name: 'kpis', id: this.kpi_id});
    },
    kpiValues() {
      switch (this.kpiData.type) {
        case 'computed': return this.setComputedValues();
        case 'stacked': return this.setStackedValues();
        default: return this.getValuesByKpi(this.kpi_id).sort((a, b) => b.date < a.date ? 1 : -1);
      }
    },
    startDate: {
      get(){
        return this.dateRange[0] ? this.dateRange[0].toISOString().split('T')[0] : null;
      },
      set(newDate) {
        return newDate
      }
    },
    endDate: {
      get(){
        return this.dateRange[1] ? this.dateRange[1].toISOString().split('T')[0] : null;
      },
      set(newDate) {
        return newDate
      }
    },
    rangedData() {
      return (!this.startDate && !this.endDate) ? this.kpiValues : this.kpiValues.filter((item) => {
        let startCheck = this.startDate ? item.date >= this.startDate : true;
        let endCheck = this.endDate ? item.date <= this.endDate : true;
        return startCheck && endCheck;
      });
    },
    isStacked() {
      return this.kpiData.type == 'stacked'
    },
    values() {
      if (this.isStacked) {
        return this.rangedData.map(item => item.value)
      } else {
        return this.rangedData.map(item => parseFloat(item.value))
      }
    },
    comments() {
      return this.rangedData.map(item => item.comment);
    },
    maxVal() {
      if (this.isStacked) {
        let valuesArr = this.values
        let summedArr = valuesArr.map(item => {
          return item.reduce((a,b) => parseFloat(a) + parseFloat(b) ,0)
        })
        return Math.max(...summedArr);
      } else {
        return Math.max(...this.values, this.kpiData.target);
      }
    },
    minVal() {
      if (this.isStacked) {
        return 0
      } else {
        return Math.min(...this.values, this.kpiData.target);
      }
    },
    avgVal() {
      if (this.isStacked) {
        return null
      } else {
        let valuesArr = this.values
        return Math.round((valuesArr.reduce((a,b) => a + b ,0) / valuesArr.length) * 100) / 100
      }
    },
    dates() {
      return this.rangedData.map(item => item.date);
    },
    showPeriod() {
      switch (this.kpiData.frequency) {
        case 'yearly': return 1080;
        case 'quarterly': return 360;
        case 'monthly': return 180;
        case 'weekly': return 90;
        default: return 30;
      }
    },
    chartUnit() {
      return this.kpiData.unit == 'percentage' ? '%' : this.kpiData.unit;
    },
    otherChartType () {
      return this.chartType == 'CChartBar' ? 'Bar' : 'Line';
    },
    dataset () {
      if (this.isStacked) {
        let chartsArr = []
        let stackedValues = this.kpiData.stacked_values
        for (let i = 0; i < stackedValues.length; i++) {
          let values = this.values.map(item => { return (item && item[i]) ? parseFloat(item[i]) : null })
          chartsArr.push(this.setBarChartDataset(stackedValues[i].label, stackedValues[i].color, values, 'mainAxis'))
        }
        return chartsArr
      } else {
        const brandInfo = getStyle('info') || '#20a8d8'
        const brandDanger = getStyle('danger') || '#f72b29'
        const brandSuccess = getStyle('success') || '#28825b'

        const target = []
        const average = []

        for (let i = 0; i <= this.values.length; i++) {
          target.push(this.kpiData.target)
          average.push(this.avgVal)
        }

        return [
          this.setLineChartDataset('KPI target', brandDanger, target, 'targetAxis'),
          this.setLineChartDataset('KPI average', brandSuccess, average, 'targetAxis'),
          this.setBarChartDataset('KPI value', brandInfo, this.values, 'mainAxis'),
        ]
      }

    },
    defaultOptions () {
      let that = this
      return {

        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            id: 'mainAxis',
            gridLines: {
              drawOnChartArea: false
            },
            stacked: this.isStacked,
          }, {
            id: 'targetAxis',
            type: 'category',
            position: 'bottom',
            display: false,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.chartUnit
            },
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 10,
              stepSize: Math.ceil(this.maxVal / 5),
              max: Math.ceil(this.maxVal + this.maxVal * 1/10),
              min: Math.floor(this.minVal - this.minVal * 1/10)
            },
            gridLines: {
              display: true
            },
            stacked: this.isStacked,
          }]
        },
        elements: {
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        },
        tooltips: {
          enabled: false,
          custom: customTooltips,
          intersect: true,
          mode: 'index',
          position: 'nearest',
          callbacks: {
            title(tooltipItem) {
              let title = tooltipItem[0].xLabel
              if (that.comments[tooltipItem[0].index]) {
                title += '<div>Comment: ' + that.comments[tooltipItem[0].index] + '</div>'
              }
              return title 
            },
            labelColor(tooltipItem, chart) {
              function getValue(prop) {
                return typeof prop === 'object' ? prop[tooltipItem.index] : prop
              }
              const dataset = chart.data.datasets[tooltipItem.datasetIndex]
              //tooltipLabelColor is coreUI custom prop used only here
              const backgroundColor = getValue(
                dataset.tooltipLabelColor ||
                dataset.pointHoverBackgroundColor ||
                dataset.borderColor ||
                dataset.backgroundColor
              )
              return {
                backgroundColor
              }
            },
            afterLabel(tooltipItem) {
              if (that.isStacked && that.kpiData.stacked_values[tooltipItem.datasetIndex].target) {
                return 'Target: ' + that.kpiData.stacked_values[tooltipItem.datasetIndex].target
              } else {
                return null
              }
            }
          }
        }
      }
    }
  },
  methods: {
    toggleChartType() {
      this.chartType = this.chartType == 'CChartBar' ? 'CChartLine' : 'CChartBar'
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
    setComputedValues() {
      let that = this
      let kpiIds = that.kpiData.computed_kpis.map(item => item.kpi_id)
      let rawValues = that.getValuesByMultipleKpis(kpiIds).sort((a, b) => b.date < a.date ? 1 : -1)
      let lastDate = ''
      let nextDate = ''
      let computedValues = rawValues.reduce(function (acc, obj) {
        if (acc.length == 0 ) {
          acc.push(obj)
          acc[0].total = 1
          acc[0].sum = parseFloat(obj.value)
          lastDate = obj.date
          nextDate = that.setNextDate(lastDate)
        } else if (obj.date <= lastDate) {
          acc[acc.length - 1].total += 1
          acc[acc.length - 1].sum += parseFloat(obj.value)
          acc[acc.length - 1].date = obj.date
          acc[acc.length - 1].value = Math.round((acc[acc.length - 1].sum / acc[acc.length - 1].total) * 100) / 100
        } else {
          if (obj.date > nextDate) {
            while (obj.date > nextDate) {
              lastDate = nextDate
              nextDate = that.setNextDate(lastDate)
            }
          }
          acc.push(obj)
          acc[acc.length - 1].total = 1
          acc[acc.length - 1].sum = parseFloat(obj.value)
          acc[acc.length - 1].date = nextDate
          lastDate = nextDate
          if (obj.date == nextDate) {
            nextDate = that.setNextDate(lastDate)
          }
        }
        return acc
      }, [])
      return computedValues
    },
    setStackedValues() {
      let sortedValues = this.getValuesByKpi(this.kpi_id).sort((a, b) => b.date < a.date ? 1 : -1)
      let values = sortedValues.map((item) => {
        if (typeof item.value === 'string') {
          item.value = JSON.parse(item.value)
        }
        return item
      })
      return values
    },
    setLineChartDataset(label, color, data, xAxisID) {
      return {
        label: label,
        backgroundColor: 'transparent',
        borderColor: color,
        pointHoverBackgroundColor: color,
        borderWidth: 1,
        borderDash: [8, 5],
        data: data,
        type: 'line',
        xAxisID: xAxisID,
        pointRadius: this.chartType == 'CChartLine' ? 4 : 0,
        hoverRadius: this.chartType == 'CChartLine' ? 4 : 0
      }
    },
    setBarChartDataset(label, color, data, xAxisID) {
      return {
        label: label,
        backgroundColor: hexToRgba(color, 10),
        borderColor: color,
        pointHoverBackgroundColor: color,
        borderWidth: 2,
        data: data,
        xAxisID: xAxisID
      }
    }
  },
  mounted() {
    let today = new Date();
    let periodAgo = new Date();
    periodAgo.setDate(today.getDate() - this.showPeriod);

    this.dateRange = [periodAgo, today];
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = periodAgo.toISOString().split('T')[0];
  }
}
</script>

<style scoped>
@media (min-width: 800px) {
  .chart-box {
    margin-top: -42px;
  }
  .filter-box {
    text-align: right;
  }
}
.chart-button {
  max-width: 220px;
}
.range-select {
  width: 220px;
}
</style>