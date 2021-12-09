import { IX, IY } from './type'

export default class Base {
  props: any
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
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

  constructor(props) {
    this.props = props
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
    const end = { x: this.width - this.right, y: this.bottomLineY }
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

  _drawChartXAxisCoodrLine() {
    // 两个点占据一个位置，所以length要减少1
    const widthOfPiece = this.effectWidth / (this.xAxisData.length - 1)
    const xPoints = []
    if (this.props.type === 'chart') {
      for (let i = 0; i < this.xAxisData.length; i ++) {
        let x = i * widthOfPiece + this.left
        if (i === 0) x = x + 1
        else if (i === this.xAxisData.length - 1) x = x - 1
        let start = { x, y: this.bottomLineY }
        let end = { x, y: this.bottomLineY + 5 }
        this.drawLine({ start, end })
        xPoints.push(start.x)
      }
      this.xPoints = xPoints
    }
  }

  _drawChartXAxisCoodrText() {
    const xAxisData = this.xAxisData
    for (let i = 0; i < this.xPoints.length; i ++) {
      const width = this.ctx.measureText(xAxisData[i]).width
      this._fillText(xAxisData[i], this.xPoints[i] - width / 2, this.bottomLineY + 15)
    }
  }

  _fillYAxisText() {
    const yCoodrAxisData = this._getYCoodrAxisData()
    for (let i = 0; i < yCoodrAxisData.length; i ++) {
      this._fillText(yCoodrAxisData[i], this.left - 20, this.yPoints[i] + 2)
    }
  }

  _fillText(text, x, y, maxWidth?) {
    this.setFillColor(this.textColor)
    this.ctx.fillText(text, x, y, maxWidth)
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