import { IX, IY } from './type'

export default class Base {
  props: any
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  type: string
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
  effectWidth: number
  effectHeight: number
  bottomLineY: number
  textColor: string
  xPoints: Array<number>
  yPoints: Array<number>
  yAxisCoodrData: Array<number>
  yPiece: number
  xAxisData: IX
  yAxisData: IY
  dataLength: number
  yMax: number
  yAxisCount: number
  XAxisSecionWidth: number

  constructor(props) {
    this.props = props
    this.type = props.type
    this.top = props.top || props.padding
    this.right = props.right || props.padding
    this.bottom = props.bottom || props.padding
    this.left = props.left || props.padding
    this.textColor = props.textColor
    this.xAxisData = props.x
    this.yAxisData = Array.isArray(props.y) ? props.y : [props.y]
    this.dataLength = this.xAxisData.length
    this._init()
  
    this.effectWidth = this.width - this.left - this.right
    this.effectHeight = this.height - this.top - this.bottom
    this.bottomLineY = this.height - this.bottom
    this.yAxisCount = 5
  }

  _init() {
    const canvas: HTMLCanvasElement = document.getElementById(this.props.id) as HTMLCanvasElement
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    this.ctx = canvas.getContext('2d')
  }

  drawAxis() {
    this._drawXAxis()
    this._drawYAxis()
    this._fillYAxisText()
  }

  _drawXAxis() {
    const start = { x: this.left, y: this.bottomLineY }
    const end = { x: this.left + this.effectWidth, y: this.bottomLineY }
    console.log(this.left + this.effectWidth)
    this.drawLine({ start, end })
  }

  _drawYAxis() {
    const yCoodrAxisData = this._getYCoodrAxisData()
    const length = yCoodrAxisData.length
    const yPiece = this.effectHeight / length
    const points = []
    for (let i = 0; i < length; i ++) {
      const y = this.height - (i + 1) * yPiece - this.bottom // 0刻度线不画
      points.push(y)
      const start = { x: this.left, y: y }
      const end = { x: this.width - this.right, y }
      this.drawLine({ start, end, isDotted: true })
    }
    this.yPoints = points
  }

  _getYCoodrAxisData() {
    let yDataArr = this.yAxisData.reduce((pre, current) => {
      return [...pre, ...current.data]
    }, [])
    let max = yDataArr.reduce((pre, current) => {
      return current > pre ? current : pre
    }, -Infinity)
    
    if (max < 10) max = 10
    else {
      const piece = max / this.yAxisCount       // 将最大值分为`this.yAxisCount`份
      const remainder = piece % 10              // 获得最大数的余数
      let integer = piece - remainder           // 将每一份取整
      integer = integer + 10                    // 将每一份数据在加上10
      max = integer * this.yAxisCount           // 得到新的最大值
    }
    this.yMax = max
    const arr = []
    for (let i = 1; i <= this.yAxisCount; i ++) {
      arr.push((max / this.yAxisCount) * i)
    }
    return arr
  }

  calculationChartXAxisSectionWidth() {
    this.XAxisSecionWidth = this.effectWidth / (this.xAxisData.length - 1)
  }

  calculationBarXAxisSectionWidth() {
    this.XAxisSecionWidth = this.effectWidth / this.xAxisData.length
  }

  _drawChartXAxisCoodrLine() {
    this._drawAxisCoodrLine(this.xAxisData.length)
  }

  _drawBarXAxisCoodrLine() {
    this._drawAxisCoodrLine(this.xAxisData.length + 1)
  }

  _drawAxisCoodrLine(length) {
    const xPoints = []
    for (let i = 0; i < length; i ++) {
      let x = i * this.XAxisSecionWidth + this.left
      if (i === 0) x = x + 1
      else if (i === length - 1) x = x - 1
      let start = { x, y: this.bottomLineY }
      let end = { x, y: this.bottomLineY + 5 }
      this.drawLine({ start, end })
      xPoints.push(start.x)
    }
    this.xPoints = xPoints
  }

  _drawChartXAxisCoodrText() {
    const xAxisData = this.xAxisData
    for (let i = 0; i < this.xPoints.length; i ++) {
      const width = this.ctx.measureText(xAxisData[i]).width
      this._fillText({ text: xAxisData[i], x: this.xPoints[i] - width / 2, y: this.bottomLineY + 15 })
    }
  }

  _drawBarXAxisCoodrText() {
    const xAxisData = this.xAxisData
    for (let i = 0; i < this.xPoints.length; i ++) {
      const width = this.ctx.measureText(xAxisData[i]).width
      this._fillText({ text: xAxisData[i], x: this.xPoints[i] - width / 2 + this.XAxisSecionWidth / 2, y: this.bottomLineY + 15 })
    }
  }

  _fillYAxisText() {
    const yCoodrAxisData = this._getYCoodrAxisData()
    for (let i = 0; i < yCoodrAxisData.length; i ++) {
      this._fillText({ text: yCoodrAxisData[i], x: this.left - 20, y: this.yPoints[i] + 2 })
    }
  }

  _fillText({ text, x, y, color = this.textColor }) {
    this.setFillColor(color)
    this.ctx.fillText(text, x, y)
    this.clearFillColor()
  }

  setStrokeColor(color) {
    this.ctx.strokeStyle = color
  }

  cleraStrokeColor() {
    this.ctx.strokeStyle = ''
  }

  setFillColor(color) {
    this.ctx.fillStyle = color
  }

  clearFillColor() {
    this.ctx.fillStyle = '#000000'
  }

  // 有效高度 — 实际高度 + 底部padding高度
  calculationYHeight(data) {
    this.yPiece = this.effectHeight / this.yMax
    return this.effectHeight - (data * this.yPiece) + this.bottom
  }

  calculationBarHeight(data) {
    this.yPiece = this.effectHeight / this.yMax
    return data * this.yPiece
  }

  drawLine({
    start,
    end,
    isDotted = false,
    color = '#000'
  }) {
    this.ctx.beginPath()
    if (isDotted) {
      this.ctx.setLineDash([2, 5])
    } else {
      this.ctx.setLineDash([])
    }
    this.setStrokeColor(color)
    this.ctx.moveTo(start.x, start.y)
    this.ctx.lineTo(end.x, end.y)
    this.ctx.stroke()
  }

  drawBar({
    x,
    y,
    w,
    h,
    color = '#000'
  }) {
    this.ctx.beginPath()
    this.setFillColor(color)
    this.ctx.rect(x, y, w, h);
    this.ctx.fill()
    this.ctx.closePath()
    this.clearFillColor()
  }

  drawCycle(x, y, r, color) {
    this.ctx.beginPath()
    this.setFillColor(color)
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, false)
    this.ctx.fill()
    this.clearFillColor()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}