export class Department {
  constructor(
    public store_id: number,
    public name: string,
    public description: string,
    public id?: number,
    public expiration_date?: Date,
    public updatedAt?: Date,
    public createdAt?: Date,
    public lastUpdatedBy?: string,

    public positions?: Position[],


    public createNewPosition?: boolean,
    public editPosition?: boolean,
    public newPositionName?: string,
    public newPositionDescription?: string,
    public editing?: boolean,
    public newName?: string,
    public newDescription?: string,
  ) { }
}