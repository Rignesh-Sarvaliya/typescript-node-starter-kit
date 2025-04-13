export class Name {
  private readonly value: string;

  constructor(name: string) {
    if (name.length < 2) throw new Error("Name too short");
    this.value = name.trim();
  }

  getValue() {
    return this.value;
  }
}
