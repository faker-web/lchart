import Base from "./Base"
import { ICrycle } from './type'

class Chart extends Base {
  chartCrycleRadius: string
  crycle: ICrycle
  onChange: (e, idx, fn) => {}
  cancelMousemove: () => {}

  constructor(props) {
    super(props)
    this.chartCrycleRadius = props.chartCrycleRadius
    this.onChange = props.onChange
    this._chartInit()
    this.addEventListener()
  }

  addEventListener() {
    this.canvas.addEventListener('mousemove', this._onmousemove.bind(this))
  }

  getCancelMousemove()  {
    return () => {
      this.canvas.removeEventListener('mousemove', this._onmousemove)
    }
  }

  _chartInit() {
    this.drawAxis()                       // 坐标轴（通用）
    this._drawChartXAxisCoodrLine()       // 折线图x坐标轴上的竖线
    this._drawChartXAxisCoodrText()       // 折线图x坐标轴上的文案
    this._drawChart()                     // 画折线图
    this._drawCycle()                     // 画圆
  }

  _drawChart() {
    const crycle = []
    for (let i = 0; i < this.yAxisData.length; i ++) {
      const currentCrycle = { color: this.yAxisData[i].color, data: [] }
      for (let j = 0; j < this.dataLength; j ++) {
        const start = {
          x: this.xPoints[j],
          y: this.calculationYHeight(this.yAxisData[i].data[j])
        }
        const end = {
          x: this.xPoints[j + 1],
          y: this.calculationYHeight(this.yAxisData[i].data[j + 1])
        }
        currentCrycle.data.push(start)
        if (i === this.yAxisData[i].data.length - 2) currentCrycle.data.push(end)
        this.drawLine({ start, end, color: this.yAxisData[i].color })
      }
      crycle.push(currentCrycle)
    }
    this.crycle = crycle
  }

  _drawCycle() {
    for (let i = 0; i < this.crycle.length; i ++) {
      const { data, color } = this.crycle[i]
      for (let j = 0; j < data.length; j ++) {
        this.drawCycle(data[j].x, data[j].y, this.chartCrycleRadius, color)
      }
    }
  }

  _onmousemove(e) {
    const { offsetX } = e
    const item = this.xPoints.find((item) => (Math.abs(offsetX - item) < 50))
    const idx = this.xPoints.indexOf(item)
    this._drawTipsLine(item)
    this.onChange && this.onChange(e, idx, this.cancelMousemove)
  }

  _drawTipsLine(x) {
    this.clear()
    this._chartInit()
    const start = {
      x,
      y: this.height - this.bottom
    }
    const end = {
      x,
      y: this.bottom
    }
    this.drawLine({ start, end, isDotted: true })
  }
}

export default Chart