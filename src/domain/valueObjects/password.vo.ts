export class Password {
  private readonly value: string;

  constructor(password: string) {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    this.value = password;
  }

  getValue() {
    return this.value;
  }
}
