import React, { useCallback, useEffect, useRef } from 'react';
import lChart from './pie'
import { IPiedata } from '../type'
import './index.css'

export interface ChartProps {
  data: Array<IPiedata>

  /**
   * 动画时长
   */
  duration?: number

  /**
   * 是否是南丁格尔玫瑰图 
   */
  isNightingaleRose?: boolean

  /**
   * 中心裁剪圆的半径比例
   */
  innerRadius?: number

  /**
   * canvas 宽度
   */
  width?: number

  /**
   * canvas 高度
   */
  height?: number

  /**
   * 饼图半径
   */
  radius?: number

  /**
   * canvas padding
   */
  padding?: number

  /**
   * 圆心X轴坐标
   */
  x?: number

  /**
   * 圆心Y轴坐标
   */
  y?: number

  onChange?: () => {}
}

export const Pie: React.FC<ChartProps> = ({
  padding = 30,
  width = 600,
  height = 400,
  ...rest
}) => {
  const tipsContainer = useRef(null)
  const id = useRef(`canvas${`${Math.random() * 10}`.slice(2,7)}`)

  const onChange = (index, data, x, y) => {
    if (index > -1) {
        tipsContainer.current.textContent = `数据：${data.name}_ ${data.num}`
        tipsContainer.current.style.visibility = 'visible'
        tipsContainer.current.style.left = x + 2 + 'px'
        tipsContainer.current.style.top = y + 2 + 'px'
    } else {
        tipsContainer.current.style.visibility = 'hidden'
    }
  }

  useEffect(() => {
    const pie = new lChart({
      padding,
      id: id.current,
      ...rest,
      onChange
    })
    const cancelMousemove = pie.addEventListener()
    return () => {
      cancelMousemove()
    }
  }, [rest, padding, width, height, tipsContainer])

  return (
    <div>
      <div
        ref={tipsContainer}
        className='tooltip'
      />
      <canvas
        id={id.current}
        width={width}
        height={height}
      ></canvas>
    </div>
  )
}
