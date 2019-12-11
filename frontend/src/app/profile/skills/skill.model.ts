export class Skill {
    constructor(
      public store_id: number,
      public department_id: number,
      public position_id: number,
      public employee_id: number,
      public skill_level: number,
      public id?: number,
      public created_at?: Date,
      public updated_at?: Date,
      public last_updated_by?: string,
    ) { }
  }