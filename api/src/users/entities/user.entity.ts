export class User {
  private constructor(
    public readonly id: string,
    public username: string,
    public email: string,
    public password: string,
    public role: 'user' | 'admin' = 'user',
    public readonly createdAt: Date,
    public isActive: boolean,
    public updatedAt?: Date,
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
      'user',
      now,
      true,
      now,
    );
  }

  static restore(props: {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
    isActive: boolean;
    updatedAt?: Date;
  }): User {
    return new User(
      props.id,
      props.username,
      props.email,
      props.password,
      props.role,
      props.createdAt,
      props.isActive,
      props.updatedAt,
    );
  }
}
