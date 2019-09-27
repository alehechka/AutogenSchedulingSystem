export class Store {
    constructor(
      public street_address: string,
      public phone_number: number,
      public zip_code: number,
      public name: string,
      public description: string,
      public _id?: number,
      public updatedAt?: Date,
      public createdAt?: Date,
      public lastUpdatedBy?: string,
    ) { }
  }