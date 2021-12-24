import Base from "../Base"
import { IPiedata } from '../type'

class Pie extends Base {
  data: Array<IPiedata>

  scale: number

  /**
   * 动画时长
   */
  duration: number

  /**
   * 是否是南丁格尔玫瑰图 
   */
  isNightingaleRose: boolean

  /**
   * 中心裁剪圆的半径比例
   */
  innerRadius: number

  /**
   * 饼图半径
   */
  radius: number

  x: number

  y: number

  onChange: (i,d,x,y) => {}

  static easeOutBounce(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
  }

  static move (duration, callback) {
    let startTime = Date.now()
    let timer = null
    function run () {
        let endTime = Date.now()
        const difftime = endTime - startTime
        const percentage = Pie.easeOutBounce(difftime, 0, 1, duration)
        callback(percentage > 0.9 ? 1 : percentage)
        if (percentage < 1) {
            timer = window.requestAnimationFrame(run)
        } else {
            window.cancelAnimationFrame(timer)
        }
    }
    run()
  }

  constructor(props) {
      super(props)
      const {
          data = {},
          scale = 1.1,
          duration = 1000,
          innerRadius = 0,
          radius,
          x,
          y,
          isNightingaleRose = false,
          onChange = () => {},
      } = props
      this.data = data
      this.scale = scale
      this.duration = duration
      this.radius = radius
      this.x = x || this.width / 2
      this.y = y || this.height / 2
      this.innerRadius = innerRadius
      this.isNightingaleRose = isNightingaleRose
      this.onChange = onChange
      this.draw()
  }

  addEventListener() {
      this.canvas.addEventListener('mousemove', this.onmousemove.bind(this))
      return () => {
        this.canvas.removeEventListener('mousemove', this.onmousemove.bind(this))
      }
  }

  draw() {
      if (this.innerRadius > 0) {
          this.clipPath()
      }
      Pie.move(this.duration, (cur) => {
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            cur * Math.PI * 360 / 180
          );
          this.ctx.closePath();
          this.ctx.clip();
          this.render();
          this.ctx.restore();
        });
  }

  render({
    isScale = false,
    x = 0,
    y = 0,
  } = {}) {
      const num = this.data.map((item) => (item.num))
      const max = Math.max.apply(Math.max, num)
      const totalNum = this.data.reduce((preVal, current) => (preVal + current.num), 0)
      let startRadian = 0
      for (let i = 0; i < this.data.length; i ++) {
          const item = this.data[i]
          const radian = (item.num / totalNum) * 360 * Math.PI / 180 // 角度转弧度
          const endRadian = radian + startRadian
    
          const radius = this.isNightingaleRose ? this.radius * (item.num / max) : this.radius
          this.drawCycle(this.x, this.y, radius, item.color, startRadian, endRadian)
          startRadian = endRadian

          if (isScale && this.ctx.isPointInPath(x, y)) {
              return i
          }
      }
  }

  onmousemove(e) {
      const x = e.offsetX
      const y = e.offsetY
      const index = this.render({ isScale: true, x, y })
      this.clear()
      this.onChange(index, this.data[index], x, y)
      this.render()
  }

  clear() {
      this.ctx.clearRect(-this.width / 2, -this.height / 2, this.width, this.height)
  }

  clipPath() {
      this.ctx.beginPath()
      this.ctx.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2)
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.clip()
  }
}

export default Pie