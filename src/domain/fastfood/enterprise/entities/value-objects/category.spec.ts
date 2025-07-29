import { Category } from './category'

describe('Category Value Object', () => {
  it('should create a valid category', () => {
    const category = Category.create('Lanche')
    expect(category.getValue()).toBe('Lanche')
  })

  it('should throw an error for an invalid category', () => {
    expect(() => Category.create('InvalidCategory')).toThrowError(
      'Invalid category: InvalidCategory'
    )
  })

  it('should compare two categories with the same value as equal', () => {
    const category1 = Category.create('Bebida')
    const category2 = Category.create('Bebida')
    expect(category1.equals(category2)).toBe(true)
  })

  it('should compare two categories with different values as not equal', () => {
    const category1 = Category.create('Bebida')
    const category2 = Category.create('Sobremesa')
    expect(category1.equals(category2)).toBe(false)
  })

  it('should return the correct value from getValue', () => {
    const category = Category.create('Acompanhamento')
    expect(category.getValue()).toBe('Acompanhamento')
  })
})
