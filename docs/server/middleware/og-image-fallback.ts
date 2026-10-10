export default defineEventHandler((event) => {
  if (import.meta.dev || import.meta.prerender)
    return
  if (event.path.startsWith('/_og/s/') || event.path.startsWith('/_og/d/'))
    return sendRedirect(event, '/og-image.png', 302)
})
