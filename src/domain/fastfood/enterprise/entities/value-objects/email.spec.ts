import { describe, it, expect } from 'vitest'
import { Email } from './email'

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('example@domain.com')
    expect(email.getValue()).toBe('example@domain.com')
  })

  it('should throw an error for an invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrowError(
      'Invalid email: invalid-email'
    )
  })

  it('should trim whitespace around the email', () => {
    const email = Email.create('   example@domain.com   ')
    expect(email.getValue()).toBe('example@domain.com')
  })

  it('should convert email to lowercase', () => {
    const email = Email.create('Example@Domain.Com')
    expect(email.getValue()).toBe('example@domain.com')
  })

  it('should compare two emails with the same value as equal', () => {
    const email1 = Email.create('user@example.com')
    const email2 = Email.create('user@example.com')
    expect(email1.equals(email2)).toBe(true)
  })

  it('should compare two emails with different values as not equal', () => {
    const email1 = Email.create('user@example.com')
    const email2 = Email.create('other@example.com')
    expect(email1.equals(email2)).toBe(false)
  })
})
