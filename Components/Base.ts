import { ca } from 'date-fns/locale'
import { IX, IY } from './type'
import { DPI } from './util'

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
    this.top = (props.top || props.padding)
    this.right = (props.right || props.padding)
    this.bottom = (props.bottom || props.padding)
    this.left = (props.left || props.padding)
    this.textColor = props.textColor
    this.xAxisData = props.x || []
    this.yAxisData = Array.isArray(props.y) ? props.y : [props.y]
    this.dataLength = this.xAxisData.length
    this._init()
  
    this.effectWidth = (this.width - this.left - this.right)
    this.effectHeight = (this.height - this.top - this.bottom)
    this.bottomLineY = (this.height - this.bottom)
    this.yAxisCount = 5
  }

  _init() {
    const canvas: HTMLCanvasElement = document.getElementById(this.props.id) as HTMLCanvasElement
    this.width = canvas.width
    this.height = canvas.height
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
    canvas.width = canvas.width * DPI
    canvas.height = canvas.height * DPI
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ctx.scale(DPI, DPI)
  }

  drawAxis() {
    this.ctx.strokeStyle = "#566a80";
    this._drawXAxis()
    // this._drawYAxis()
    this._drawYAxisMark()
  }

  _drawXAxis() {
    const originX = this.left
    const originY = this.bottomLineY
    const endX = this.left + this.effectWidth
    this.drawLine(originX, originY, endX, originY)
  }

  _drawYAxis() {
    const originX = this.left
    const originY = this.bottomLineY
    const endY = this.top
    this.drawLine(originX, originY, originX, endY)
  }

  _drawYAxisMark() {
    this.ctx.strokeStyle = "#E0E0E0";
    const yCoodrAxisData = this._getYCoodrAxisData()
    const length = yCoodrAxisData.length
    const yPiece = this.effectHeight / length
    for (let i = 0; i < length; i ++) {
      const y = this.height - (i + 1) * yPiece - this.bottom
      const originX = this.left
      const endX = this.width - this.right
      this.drawLine(originX, y, endX, y)
      this._fillText({ text: yCoodrAxisData[i], x: this.left - 20, y: y + 3 })
    }
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

  _drawChartXAxisMark() {
    this._drawXAxisMarkLine(this.xAxisData.length)
    this._drawChartXAxisMarkText()
  }

  _drawBarXAxisCoodrLine() {
    this._drawXAxisMarkLine(this.xAxisData.length + 1)
  }

  _drawXAxisMarkLine(length) {
    this.ctx.strokeStyle = '#566a80'
    const xPoints = []
    for (let i = 0; i < length; i ++) {
      let x = i * this.XAxisSecionWidth + this.left
      if (i === 0) x = x + 1
      else if (i === length - 1) x = x - 1
      this.drawLine(x, this.bottomLineY, x, this.bottomLineY + 5)
      xPoints.push(x)
    }
    this.xPoints = xPoints
  }

  _drawChartXAxisMarkText() {
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

  drawLine(x, y, X, Y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(X, Y);
    this.ctx.stroke();
    this.ctx.closePath();
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

  drawCycle(x, y, r, color, start = 0, end =  2 * Math.PI) {
    this.ctx.beginPath()
    this.setFillColor(color)
    this.ctx.arc(x, y, r, start, end, false)
    this.ctx.lineTo(x, y)
    this.ctx.fill()
    this.clearFillColor()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}