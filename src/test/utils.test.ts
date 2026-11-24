import { describe, expect, test } from 'vitest'
import { filterUsersByName } from '../utils'
import { users } from './server'

const names = (query: string) =>
  filterUsersByName(users, query).map((user) => user.name)

describe('filterUsersByName', () => {
  test('returns every user for an empty or blank query', () => {
    expect(names('')).toHaveLength(users.length)
    expect(names('   ')).toHaveLength(users.length)
  })

  test('matches part of the name, ignoring case and outer spaces', () => {
    expect(names('lea')).toEqual(['Leanne Graham'])
    expect(names('  LEANNE ')).toEqual(['Leanne Graham'])
  })

  test('returns no users when nothing matches', () => {
    expect(names('zzz')).toEqual([])
  })
})
