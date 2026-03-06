import React from "react"
import { Helmet } from "react-helmet-async"
import { getAppName, getLogoUrl, getPublicBaseUrl } from "../lib/config"

type Props = {
  title?: string
  description?: string
  path?: string
}

export default function Seo({ title, description, path }: Props) {
  const appName = getAppName()
  const logo = getLogoUrl()
  const base = getPublicBaseUrl()

  const pageTitle = title ? `${title} · ${appName}` : appName
  const pageDescription = description || "Modern short URL platform with smooth UI, feedback-rich interactions, and fast link generation."
  const pageUrl = path ? `${base}${path}` : base

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="theme-color" content="#0b0f17" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={logo} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={logo} />

      <link rel="canonical" href={pageUrl} />
    </Helmet>
  )
}