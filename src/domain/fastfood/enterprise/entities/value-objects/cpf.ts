export class Cpf {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Cpf {
    const sanitizedValue = value.replace(/\D/g, '')

    if (!Cpf.isValid(sanitizedValue)) {
      throw new Error(`Invalid CPF: ${value}`)
    }

    return new Cpf(sanitizedValue)
  }

  private static isValid(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

    const calcDigit = (factor: number) => {
      let total = 0
      for (const digit of cpf.slice(0, factor - 1)) {
        total += parseInt(digit) * factor--
      }
      const remainder = total % 11
      return remainder < 2 ? 0 : 11 - remainder
    }

    const firstDigit = calcDigit(10)
    const secondDigit = calcDigit(11)

    return firstDigit === parseInt(cpf[9]) && secondDigit === parseInt(cpf[10])
  }

  private static format(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  public getValue(): string {
    return this.value
  }

  public toString(): string {
    return this.value
  }

  public toFormattedString(): string {
    return Cpf.format(this.value)
  }

  public toValue(): string {
    return this.value
  }

  public equals(other: Cpf): boolean {
    return this.value === other.value
  }
}
