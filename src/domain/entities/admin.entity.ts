export class AdminEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string
  ) {}

  get label() {
    return `${this.name} <${this.email}>`;
  }
}
