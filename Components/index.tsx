import React, { useEffect } from 'react';
import lChart from './Chart'
import { IX, IY, type } from './type'

export interface ChartProps {
  /**
   * 当前组件的类型 'chart' | 'bar' | 'acr'
   */
  type: string
  /**
   * canvas 组件id
   */
  id?: string;
  /**
   * x轴刻度线数据
   */
  x: IX;
  /**
   * y轴数据
   */
  y: IY
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
  type = 'chart',
  padding = 30,
  ...rest
}) => {
  useEffect(() => {
    const chart = new lChart({
      id: 'canvas',
      type,
      padding,
      ...rest,
    })
    return () => {
      const cancelMousemove = chart.getCancelMousemove()
      cancelMousemove()
    }
  }, [rest, type, padding])
  if (rest.id) return null
  return (
    <canvas id="canvas" width="400" height="400"></canvas>
  )
}

