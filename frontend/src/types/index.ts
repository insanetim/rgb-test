export interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
  updatedAt: string
}

export interface ClientWithDeals extends Client {
  deals: Deal[]
}

export enum DealStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  WON = "WON",
  LOST = "LOST",
}

export interface Deal {
  id: string
  title: string
  amount: number
  status: DealStatus
  clientId: string
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ClientsQuery {
  page?: number
  limit?: number
}

export interface DealsQuery {
  page?: number
  limit?: number
  clientId?: string
  status?: DealStatus
}

export interface CreateClient {
  name: string
  email: string
  phone?: string
}

export type UpdateClient = Partial<CreateClient>

export interface CreateDeal {
  title: string
  amount: number
  status?: DealStatus
  clientId: string
}

export type UpdateDeal = Partial<Omit<CreateDeal, "clientId">>
