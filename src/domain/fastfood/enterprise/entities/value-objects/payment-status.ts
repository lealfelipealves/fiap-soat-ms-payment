export type PaymentStatusType = (typeof PaymentStatus.VALID_STATUS)[number]

export class PaymentStatus {
  private readonly value: string

  public static readonly APPROVED = 'Aprovado'
  public static readonly REJECTED = 'Recusado'
  public static readonly PENDING = 'Pendente'

  static readonly VALID_STATUS = [
    this.APPROVED,
    this.REJECTED,
    this.PENDING
  ] as const

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): PaymentStatus {
    if (!this.VALID_STATUS.includes(value as PaymentStatusType)) {
      throw new Error(`Invalid payment status: ${value}`)
    }
    return new PaymentStatus(value)
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

  public equals(other: PaymentStatus): boolean {
    return this.value === other.value
  }
}
