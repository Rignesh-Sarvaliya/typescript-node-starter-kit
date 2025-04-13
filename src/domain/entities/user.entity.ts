export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string
  ) {}

  get displayName() {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
}
