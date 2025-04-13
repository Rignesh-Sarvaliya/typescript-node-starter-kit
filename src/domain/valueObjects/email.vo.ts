export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    this.value = email.toLowerCase();
  }

  getValue() {
    return this.value;
  }
}
