export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Create pagination metadata
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  // Ensure limit is at least 1 to avoid division by zero
  const safeLimit = Math.max(limit || 10, 1);
  const totalPages = Math.ceil(total / safeLimit);

  return {
    page: page || 1,
    limit: safeLimit,
    total,
    totalPages,
  };
}

// Create paginated response
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResponse<T> {
  return {
    data,
    meta: createPaginationMeta(page, limit, total),
  };
}
