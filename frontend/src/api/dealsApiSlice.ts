import {
  CreateDeal,
  Deal,
  DealsQuery,
  PaginatedResponse,
  UpdateDeal,
} from "@/types"
import { baseApi } from "./baseApi"

const dealsApiSlice = baseApi.injectEndpoints({
  endpoints: builder => ({
    // GET /deals - Get all deals with pagination and filtering
    getDeals: builder.query<PaginatedResponse<Deal>, DealsQuery>({
      query: query => ({
        url: "deals",
        params: query,
      }),
      providesTags: ["DealsList"],
    }),

    // POST /deals - Create new deal
    createDeal: builder.mutation<Deal, CreateDeal>({
      query: data => ({
        url: "deals",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { clientId }) => [
        { type: "Client", id: clientId },
        "DealsList",
      ],
    }),

    // PATCH /deals/:id - Update deal
    updateDeal: builder.mutation<Deal, { id: Deal["id"] } & UpdateDeal>({
      query: ({ id, ...patch }) => ({
        url: `deals/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Client", id },
        "DealsList",
      ],
    }),

    // DELETE /deals/:id - Delete deal
    deleteDeal: builder.mutation<
      void,
      { id: Deal["id"]; clientId: Deal["clientId"] }
    >({
      query: id => ({
        url: `deals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { clientId }) => [
        { type: "Client", id: clientId },
        "DealsList",
      ],
    }),
  }),
})

export const {
  useGetDealsQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,
} = dealsApiSlice

export default dealsApiSlice
