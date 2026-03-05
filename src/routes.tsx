import React from "react"
import { RouteObject } from "react-router-dom"
import HomePage from "./views/HomePage"
import ApiDocsPage from "./views/ApiDocsPage"
import TermsPage from "./views/TermsPage"
import NotFoundPage from "./views/NotFoundPage"

export const routes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/apidocs", element: <ApiDocsPage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "*", element: <NotFoundPage /> }
]