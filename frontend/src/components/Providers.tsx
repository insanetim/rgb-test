"use client"

import { baseApi } from "@/api/baseApi"
import { ApiProvider } from "@reduxjs/toolkit/query/react"
import { PropsWithChildren } from "react"

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return <ApiProvider api={baseApi}>{children}</ApiProvider>
}

export default Providers
