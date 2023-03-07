
export enum ActiveType {
  Charts = "Charts",
  Input = "Input",
}

export interface SumData {
  name: string;
  value: number | string;
  data?: ItemData[];
}

export interface ItemData {
  name: string;
  value: number | string;
  data?: { name: string; value: number | string }[];
}