export class Schedule {
    constructor(
      public position_id: number,
      public store_id: number,
      public department_id: number,
      public employee_id: number,
      public start_date_time: Date,
      public end_date_time: Date,
      public id?: number,
      public updated_at?: Date,
      public created_at?: Date,
      public last_updated_by?: string,
    ) { }
  }