export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password?: string,
    public createdAt: Date = new Date()
  ) {}

  static create(props: {
    id: string;
    name: string;
    email: string;
    password?: string;
    createdAt?: Date;
  }): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.password,
      props.createdAt || new Date()
    );
  }
} 