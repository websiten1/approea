export type EparchialEventType =
  | 'hram'
  | 'vizita-episcopala'
  | 'hirotonie'
  | 'sfintire'
  | 'sinaxa'
  | 'conferinta'
  | 'altele';

export interface EparchialEvent {
  id: string;
  /** format ISO: YYYY-MM-DD */
  date: string;
  title: string;
  type: EparchialEventType;
  location?: string;
  description?: string;
}
