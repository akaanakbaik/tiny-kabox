import React from "react"
import { Helmet } from "react-helmet-async"
import { getAppName, getLogoUrl } from "../lib/config"

type Props = {
  title?: string
  description?: string
  path?: string
}

export default function Seo({ title, description, path }: Props) {
  const app = getAppName()
  const t = title ? `${title} · ${app}` : app
  const d = description || "Modern short link platform"
  const origin = window.location.origin.replace(/\/+$/, "")
  const url = path ? `${origin}${path.startsWith("/") ? path : `/${path}`}` : origin
  const img = getLogoUrl()

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  )
}