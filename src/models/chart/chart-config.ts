import * as HighCharts from 'highcharts'

export const config: HighCharts.Options = {
  boost: {
    allowForce: true,
    enabled: true,
    useGPUTranslations: true,
    usePreallocated: true,
  },
  chart: {
    type: 'areaspline',
    backgroundColor: '#232323',
    animation: true,
    scrollablePlotArea: {
      minHeight: 40,
      minWidth: 500,
      opacity: 0,
    },
    plotBorderWidth: 1,
    plotBorderColor: '#414141',
  },
  time: {
    useUTC: false,
  },
  title: {
    text: '',
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    areaspline: {
      lineWidth: 4,
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, '#ffffff'],
          [1, '#1a88a0'],
        ],
      },
      fillColor: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, 'rgba(26, 136, 160, 1)'],
          [1, 'rgba(26, 136, 160, 0)'],
        ],
      },
      marker: {
        enabled: false,
        fillColor: '#1a88a0',
        radius: 5,
        states: {
          hover: {
            enabled: true,
          },
          normal: {
            animation: true,
          },
          select: {
            enabled: true,
          },
        },
      },
    },
  },
  xAxis: {
    gridZIndex: 0,
    gridLineWidth: 1,
    gridLineColor: '#414141',
    lineColor: '#414141',
    type: 'datetime',
    softMax: Date.now(),
    tickColor: '#414141',
    maxPadding: 0.05,
  },
  yAxis: {
    gridZIndex: 0,
    gridLineColor: '#414141',
    gridLineWidth: 1,
    lineWidth: 1,
    lineColor: '#414141',
    title: {
      text: '',
    },
  },
  exporting: {
    enabled: false,
  },
  tooltip: {
    shared: true,
    valueSuffix: '',
  },
  credits: {
    enabled: false,
  },
}
