import { useQuery } from '@tanstack/vue-query'
import { fetchUsers } from '../requests/users'

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    select: (response) => response.data,
  })
}
