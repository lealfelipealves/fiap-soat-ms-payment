import { Cpf } from './cpf'

describe('Cpf Value Object', () => {
  it('should create a valid CPF', () => {
    const cpf = Cpf.create('12345678909')
    expect(cpf.toFormattedString()).toBe('123.456.789-09')
    expect(cpf.getValue()).toBe('12345678909')
  })

  it('should throw an error for an invalid CPF', () => {
    expect(() => Cpf.create('12345678900')).toThrowError(
      'Invalid CPF: 12345678900'
    )
  })

  it('should ignore formatting characters and create a valid CPF', () => {
    const cpf = Cpf.create('123.456.789-09')
    expect(cpf.getValue()).toBe('12345678909')
  })

  it('should compare two CPFs with the same value as equal', () => {
    const cpf1 = Cpf.create('12345678909')
    const cpf2 = Cpf.create('12345678909')
    expect(cpf1.equals(cpf2)).toBe(true)
  })

  it('should compare two CPFs with different values as not equal', () => {
    const cpf1 = Cpf.create('12345678909')
    const cpf2 = Cpf.create('98765432100')
    expect(cpf1.equals(cpf2)).toBe(false)
  })
})
