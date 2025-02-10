export class Favorite {
  constructor(
    public id: string,
    public hospitalId: string,
    public userId: string,
    public createdAt: Date = new Date()
  ) {}

  static create(data: {
    id: string;
    hospitalId: string;
    userId: string;
    createdAt?: Date;
  }): Favorite {
    return new Favorite(
      data.id,
      data.hospitalId,
      data.userId,
      data.createdAt || new Date()
    );
  }

  toJSON() {
    return {
      id: this.id,
      hospitalId: this.hospitalId,
      userId: this.userId,
      createdAt: this.createdAt
    };
  }
} 