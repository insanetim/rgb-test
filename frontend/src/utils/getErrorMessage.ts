// https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling

import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  )
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isDataWithMessage(data: unknown): data is { message: string } {
  return (
    typeof data === "object" &&
    data != null &&
    "message" in data &&
    typeof (data as { message: unknown }).message === "string"
  )
}

export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    // you can access all properties of `FetchBaseQueryError` here
    return "error" in error
      ? error.error
      : isDataWithMessage(error.data)
        ? error.data.message
        : JSON.stringify(error.data)
  } else if (isErrorWithMessage(error)) {
    // you can access a string 'message' property here
    return error.message
  }

  return "Something went wrong"
}
