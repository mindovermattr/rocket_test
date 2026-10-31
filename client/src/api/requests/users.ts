import { apiClient } from '../client'
import type { User } from '../types/user.type'

export type UsersResponse = User[]

export function fetchUsers() {
  return apiClient.get<UsersResponse>(`/leads/users/`)
}
