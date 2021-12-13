import Base from "../Base"
import { ICrycle } from '../type'

class Chart extends Base {
  crycle: ICrycle
  barWidth: number
  barMiddlePoints: Array<{ x: number, data: number }>
  onChange: (e, { groupIdx, itemIdx }) => {}
  cancelMousemove: () => {}

  constructor(props) {
    super(props)
    this.barWidth = 30
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
    this.calculationBarXAxisSectionWidth()
    this.drawAxis()
    this._drawBarXAxisCoodrLine()
    this._drawBarXAxisCoodrText()
    this._drawBar()
  }

  _drawBar() {
    const itemLength = this.yAxisData.length
    /**
     * 计算柱形图padding
     * （区间宽度 - 柱形数量 * 柱形图宽度）/ （柱形图宽度 + 1）
     */
    const padding = (this.XAxisSecionWidth - itemLength * this.barWidth) / (itemLength + 1)
    const points = []
    for (let i = 0; i < this.yAxisData.length; i ++) {
      for (let j = 0; j < this.dataLength; j ++) {
        /**
         * x坐标的位置
         * canvas left + padding + 前面区间的距离 + 当前区间前面的bar width
         */
        const x = this.left + (i + 1) * padding + j * this.XAxisSecionWidth  + i * this.barWidth
        const color = this.yAxisData[i]?.color
        const data = this.yAxisData[i].data[j]
        const h = this.calculationYHeight(data)
        const y = this.effectHeight - h + this.bottom
        const w = this.barWidth
        this.drawBar({ x, y, w, h, color })

        const text = `${data}`
        const textWidth = this.ctx.measureText(text).width
        this._fillText({ text, x: x + (this.barWidth - textWidth) / 2, y: y - 10, color })

        /**
         * 保存搜有数据的X轴起始点
         */
        points.push({ x, data })
      }
    }
    this.barMiddlePoints = points
  }

  _onmousemove(e) {
    const { offsetX } = e
    const item = this.barMiddlePoints.find((item) => (Math.abs(offsetX - item.x) < 30))
    if (!item) return
    let groupIdx
    let itemIdx
    for (let i = 0; i < this.yAxisData.length; i ++) {
      for (let j = 0; j < this.dataLength; j ++) {
        if (item.data === this.yAxisData[i]?.data[j]) {
          groupIdx = i
          itemIdx = j
          break
        }
      }
    }

    
    /**
     * 吸附线居中
     */
    this._drawTipsLine(item.x + this.barWidth / 2)
    this.onChange && this.onChange(e, { groupIdx, itemIdx })
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