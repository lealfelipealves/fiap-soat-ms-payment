export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Email {
    const trimmedValue = value.trim()

    if (!Email.isValid(trimmedValue)) {
      throw new Error(`Invalid email: ${value}`)
    }

    return new Email(trimmedValue.toLowerCase())
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public getValue(): string {
    return this.value
  }

  public toString(): string {
    return this.value
  }

  public toValue(): string {
    return this.value
  }

  public equals(other: Email): boolean {
    return this.value === other.value
  }
}
