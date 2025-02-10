export class Comment {
  constructor(
    public id: string,
    public hospitalId: string,
    public userId: string,
    public text: string,
    public rating: number,
    public createdAt: Date = new Date()
  ) {}

  static create(props: {
    id: string;
    hospitalId: string;
    userId: string;
    text: string;
    rating: number;
    createdAt?: Date;
  }): Comment {
    return new Comment(
      props.id,
      props.hospitalId,
      props.userId,
      props.text,
      props.rating,
      props.createdAt || new Date()
    );
  }
} 