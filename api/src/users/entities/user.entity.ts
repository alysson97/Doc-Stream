export class User {
  private constructor(
    public readonly id: string,
    public username: string,
    public email: string,
    public password: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public isActive: boolean,
  ) {}

  static create(props: {
    id: string;
    username: string;
    email: string;
    password: string;
  }): User {
    const now = new Date();

    return new User(
      props.id,
      props.username,
      props.email,
      props.password,
      now,
      now,
      true,
    );
  }

  static restore(props: {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  }): User {
    return new User(
      props.id,
      props.username,
      props.email,
      props.password,
      props.createdAt,
      props.updatedAt,
      props.isActive,
    );
  }
}
