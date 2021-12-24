import React, { useEffect, useRef } from 'react';
import lChart from './chart'
import { IX, IY } from '../type'

export interface ChartProps {
  /**
   * x轴刻度线数据
   */
  x: IX;
  /**
   * y轴数据
   */
  y: IY
  /**
   * canvas height
   */
  width?: number
  /**
   * canvas width
   */
  height?: number
  /**
   * canvas 组件左边距
   */
  left?: number
  /**
   * canvas 组件右边距
   */
  right?: number
  /**
   * canvas 组件上边距
   */
  top?: number
  /**
   * canvas 组件下边距
   */
  bottom?: number
  /**
   * canvas padding边距
   */
  padding?: number
  /**
   * 折线图圆的半径
   */
  chartCrycleRadius?: number
  /**
   * 鼠标onchange事件回掉函数(e, idx)
   * e => Event
   * idx => 当前所选中的index(从0开始)
   */
  onChange?: () => {}
}

export const Chart: React.FC<ChartProps> = ({
  padding = 30,
  width = 600,
  height = 400,
  chartCrycleRadius = 5,
  ...rest
}) => {
  const id = useRef(`canvas${`${Math.random() * 10}`.slice(2,7)}`)

  useEffect(() => {
    const chart = new lChart({
      padding,
      chartCrycleRadius,
      id: id.current,
      ...rest,
    })
    return () => {
      const cancelMousemove = chart.getCancelMousemove()
      cancelMousemove()
    }
  }, [rest, padding, width, height, chartCrycleRadius])

  return (
    <canvas id={id.current} width={width} height={height}></canvas>
  )
}
