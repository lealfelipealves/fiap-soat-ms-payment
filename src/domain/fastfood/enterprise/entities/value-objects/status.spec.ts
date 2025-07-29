import { Status } from './status'

describe('Status Value Object', () => {
  it('should create a valid status', () => {
    const status = Status.create('Recebido')
    expect(status.getValue()).toBe('Recebido')
  })

  it('should throw an error for an invalid status', () => {
    expect(() => Status.create('InvalidStatus')).toThrowError(
      'Invalid status: InvalidStatus'
    )
  })

  it('should compare two statuses with the same value as equal', () => {
    const status1 = Status.create('Pronto')
    const status2 = Status.create('Pronto')
    expect(status1.equals(status2)).toBe(true)
  })

  it('should compare two statuses with different values as not equal', () => {
    const status1 = Status.create('Recebido')
    const status2 = Status.create('Finalizado')
    expect(status1.equals(status2)).toBe(false)
  })

  it('should allow valid status transitions', () => {
    const status = Status.create('Recebido')
    expect(status.canTransitionTo('Preparação')).toBe(true)
  })

  it('should not allow invalid status transitions', () => {
    const status = Status.create('Recebido')
    expect(status.canTransitionTo('Finalizado')).toBe(false)
  })

  it("should allow transition from 'Preparação' to 'Pronto'", () => {
    const status = Status.create('Preparação')
    expect(status.canTransitionTo('Pronto')).toBe(true)
  })

  it("should not allow transition from 'Finalizado' to any other status", () => {
    const status = Status.create('Finalizado')
    expect(status.canTransitionTo('Pronto')).toBe(false)
    expect(status.canTransitionTo('Preparação')).toBe(false)
  })
})
