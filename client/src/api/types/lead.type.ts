export interface Lead {
  id: number
  name: string
  price: number
  created_at: number
  status_id: number
  pipeline_id: number
  responsible_user_id: number
  _links: {
    self: {
      href: string
    }
  }
}
