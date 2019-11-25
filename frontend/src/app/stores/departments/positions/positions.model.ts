export class Position {
    constructor(
      public department_id: number,
      public name: string,
      public description: string,
      public expiration_date?: Date,
      public _id?: number,
      public updatedAt?: Date,
      public createdAt?: Date,
      public lastUpdatedBy?: string,
    ) { }
  }