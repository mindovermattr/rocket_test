export interface Lead {
  id: number
  name: string
  price: number
  created_at: number
  status_id: number
  pipeline_id: number
  _links: {
    self: {
      href: string
    }
  }
}

export interface LeadListResponse {
  _page: number
  _links: {
    self: {
      href: string
    }
  }
  _embedded: {
    leads: Lead[]
  }
}
