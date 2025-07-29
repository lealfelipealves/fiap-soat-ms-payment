export type StatusType = (typeof Status.VALID_STATUS)[number]
export class Status {
  private readonly value: string

  public static readonly RECEIVED = 'Recebido'
  public static readonly IN_PREPARATION = 'Preparação'
  public static readonly READY = 'Pronto'
  public static readonly FINALIZED = 'Finalizado'

  static readonly VALID_STATUS = [
    this.RECEIVED,
    this.IN_PREPARATION,
    this.READY,
    this.FINALIZED
  ] as const

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Status {
    if (!this.VALID_STATUS.includes(value as StatusType)) {
      throw new Error(`Invalid status: ${value}`)
    }
    return new Status(value)
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

  public equals(other: Status): boolean {
    return this.value === other.value
  }

  canTransitionTo(nextStatus: string): boolean {
    const transitions: {
      [key in StatusType]: string[]
    } = {
      Recebido: ['Preparação'],
      Preparação: ['Pronto'],
      Pronto: ['Finalizado'],
      Finalizado: []
    }

    return transitions[this.value as StatusType]?.includes(nextStatus) || false
  }
}
