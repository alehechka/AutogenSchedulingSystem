export class Position {
    constructor(
      public department_id: number,
      public name: string,
      public description: string,
      public id?: number,
      public expiration_date?: Date,
      public updatedAt?: Date,
      public createdAt?: Date,
      public lastUpdatedBy?: string,

      public newName?: string,
      public newDescription?: string,
    ) { }
  }