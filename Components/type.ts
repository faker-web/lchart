export type IX = Array<string>

export type IY = Array<{
  labal?: string
  data: Array<number>
  color?: string
}>

export type ICrycle = Array<{
  data: Array<{
    x: number
    y: number
  }>
  color?: string
}>

export interface IPiedata {
  num: number
  name: string
  color: string
}