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
      getKpiById: 'kpiData/getKpiById',
      getValuesByKpi: 'kpiData/getValuesByKpi'
    }),
    kpiData() {
      return this.getKpiById(this.kpi_id);
    },
    kpiValues() {
      return this.getValuesByKpi(this.kpi_id).sort((a, b) => b.date < a.date ? 1 : -1);
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
    values() {
      return this.rangedData.map(item => item.value);
    },
    maxVal() {
      return Math.max(...this.values, this.kpiData.target);
    },
    minVal() {
      return Math.min(...this.values, this.kpiData.target);
    },
    avgVal() {
      let valuesArr = this.values
      return Math.round((valuesArr.reduce((a,b) => a + b ,0) / valuesArr.length) * 100) / 100
    },
    dates() {
      return this.rangedData.map(item => item.date);
    },
    showPeriod() {
      switch (this.kpiData.frequency) {
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
        {
          label: 'KPI target',
          backgroundColor: 'transparent',
          borderColor: brandDanger,
          pointHoverBackgroundColor: brandDanger,
          borderWidth: 1,
          borderDash: [8, 5],
          data: target,
          type: 'line',
          xAxisID: 'targetAxis',
          pointRadius: this.chartType == 'CChartBar' ? 0 : 4,
          hoverRadius: this.chartType == 'CChartBar' ? 0 : 4
        },
        {
          label: 'KPI average',
          backgroundColor: 'transparent',
          borderColor: brandSuccess,
          pointHoverBackgroundColor: brandSuccess,
          borderWidth: 1,
          borderDash: [8, 5],
          data: average,
          type: 'line',
          xAxisID: 'targetAxis',
          pointRadius: this.chartType == 'CChartBar' ? 0 : 4,
          hoverRadius: this.chartType == 'CChartBar' ? 0 : 4
        },
        {
          label: 'KPI value',
          backgroundColor: hexToRgba(brandInfo, 10),
          borderColor: brandInfo,
          pointHoverBackgroundColor: brandInfo,
          borderWidth: 2,
          data: this.values,
          xAxisID: 'mainAxis'
        }
      ]
    },
    defaultOptions () {
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
            }
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
            }
          }]
        },
        elements: {
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        }
      }
    }
  },
  methods: {
    toggleChartType() {
      this.chartType = this.chartType == 'CChartBar' ? 'CChartLine' : 'CChartBar'
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

<style lang="scss" scoped>
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