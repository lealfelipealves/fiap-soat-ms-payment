import { faker } from '@faker-js/faker'

export type Params = { toValue: string; toDisplay: string }

export function makeCpf(): Params {
  const randomDigits = (): number[] =>
    Array.from({ length: 9 }, () => faker.number.int({ min: 0, max: 9 }))

  const calculateDigit = (cpfArray: number[], factor: number): number => {
    const total = cpfArray.reduce((sum, num) => sum + num * factor--, 0)
    const remainder = total % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const baseCPF = randomDigits()

  const firstDigit = calculateDigit(baseCPF, 10)

  const secondDigit = calculateDigit([...baseCPF, firstDigit], 11)

  const formated = [...baseCPF, firstDigit, secondDigit]
    .join('')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

  return {
    toValue: baseCPF.join(''),
    toDisplay: formated
  }
}
