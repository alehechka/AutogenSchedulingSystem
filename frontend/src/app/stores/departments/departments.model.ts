export class Department {
  constructor(
    public store_id: number,
    public name: string,
    public description: string,
    public expiration_date?: Date,
    public id?: number,
    public updatedAt?: Date,
    public createdAt?: Date,
    public lastUpdatedBy?: string,
    public createNewPosition?: boolean,
    public newPositionName?: string,
    public newPositionDescription?: string,
    public positions?: Position[]
  ) { }
}