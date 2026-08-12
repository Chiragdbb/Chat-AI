export async function pingServer() {
    const baseUrl = import.meta.env.VITE_SERVER_URL
    if (!baseUrl) return

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    try {
        await fetch(`${baseUrl}/api/health`, {
            method: "GET",
            signal: controller.signal,
        })
    } catch {
        // Ignore — used only to wake a sleeping Render instance
    } finally {
        clearTimeout(timeoutId)
    }
}
