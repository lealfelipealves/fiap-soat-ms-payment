export type CategoryType = (typeof Category.VALID_CATEGORIES)[number]
export class Category {
  private readonly value: string

  public static readonly SNACK = 'Lanche'
  public static readonly SIDE_DISH = 'Acompanhamento'
  public static readonly DRINK = 'Bebida'
  public static readonly DESSERT = 'Sobremesa'

  static readonly VALID_CATEGORIES = [
    this.SNACK,
    this.SIDE_DISH,
    this.DRINK,
    this.DESSERT
  ] as const

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Category {
    if (
      !this.VALID_CATEGORIES.includes(
        value as (typeof Category.VALID_CATEGORIES)[number]
      )
    ) {
      throw new Error(`Invalid category: ${value}`)
    }
    return new Category(value)
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

  equals(other: Category): boolean {
    return this.value === other.value
  }
}
