import {
  Client,
  ClientsQuery,
  ClientWithDeals,
  CreateClient,
  PaginatedResponse,
  UpdateClient,
} from "@/types"
import { baseApi } from "./baseApi"

const clientsApiSlice = baseApi.injectEndpoints({
  endpoints: builder => ({
    // GET /clients - Get all clients with pagination
    getClients: builder.query<PaginatedResponse<Client>, ClientsQuery>({
      query: query => ({
        url: "clients",
        params: query,
      }),
      providesTags: ["ClientsList"],
    }),

    // GET /clients/:id - Get client by ID
    getClient: builder.query<ClientWithDeals, string>({
      query: id => `clients/${id}`,
      providesTags: (result, error, id) => [{ type: "Client", id }],
    }),

    // POST /clients - Create new client
    createClient: builder.mutation<Client, CreateClient>({
      query: data => ({
        url: "clients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClientsList"],
    }),

    // PATCH /clients/:id - Update client
    updateClient: builder.mutation<Client, { id: Client["id"] } & UpdateClient>(
      {
        query: ({ id, ...patch }) => ({
          url: `clients/${id}`,
          method: "PATCH",
          body: patch,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Client", id },
          "ClientsList",
        ],
      }
    ),

    // DELETE /clients/:id - Delete client
    deleteClient: builder.mutation<void, Client["id"]>({
      query: id => ({
        url: `clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClientsList"],
    }),
  }),
})

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApiSlice

export default clientsApiSlice
