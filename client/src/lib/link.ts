export function apiLeadUrlToDetail(apiUrl: string): string {
  try {
    const url = new URL(apiUrl)
    const match = url.pathname.match(/\/api\/v4\/leads\/(\d+)/)
    return match ? `${url.origin}/leads/detail/${match[1]}` : ''
  } catch {
    return ''
  }
}
