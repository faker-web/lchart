import Base from "../Base"
import { ICrycle } from '../type'

class Chart extends Base {
  chartCrycleRadius: string
  crycle: ICrycle
  onChange: (e, idx, fn) => {}
  cancelMousemove: () => {}
  area: Array<string>

  constructor(props) {
    super(props)
    this.chartCrycleRadius = props.chartCrycleRadius
    this.onChange = props.onChange
    this.area = props.area
    this.calculationChartXAxisSectionWidth()
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
    this._drawChartXAxisMark()            // 折线图x坐标轴上的竖线和文案
    this._drawChart()                     // 画折线图
    this._drawCycle()                     // 面积图不画圆
  }

  _drawChart() {
    const crycle = []
    for (let i = 0; i < this.yAxisData.length; i ++) {
      const currentCrycle = { color: this.yAxisData[i].color, data: [] }
      this.ctx.beginPath()

      if (this.area) {
        this.ctx.moveTo(this.left, this.bottomLineY)
      }

      for (let j = 0; j < this.dataLength; j ++) {
        const x = this.xPoints[j]
        const y = this.calculationYHeight(this.yAxisData[i].data[j])
        this.ctx.lineTo(x, y)
        this.ctx.strokeStyle = this.yAxisData[i].color
        this.ctx.stroke()
        currentCrycle.data.push({ x, y })
      }

      if (this.area) {
        this.ctx.lineTo(this.left + this.effectWidth, this.bottomLineY)
        var gradient = this.ctx.createLinearGradient(0, 0, 0, 300);
        this.area.forEach((value, index) => {
          gradient.addColorStop(index, value);

        })
        this.ctx.fillStyle = gradient
        this.ctx.fill();
        this.ctx.closePath()
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
    this.ctx.strokeStyle = '#d0d0d0'
    this.drawLine(x, this.height - this.bottom, x, this.bottom)
  }
}

export default Chart