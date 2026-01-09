let tokenClient = null

export function isGoogleReady() {
  return typeof window !== "undefined" && window.google?.accounts?.oauth2
}

export function requestDriveToken({ clientId }) {
  if (!isGoogleReady()) throw new Error("Google Identity script not loaded yet.")
  if (!clientId) throw new Error("Missing VITE_GOOGLE_CLIENT_ID.")

  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (resp) => {
          if (resp?.access_token) resolve(resp.access_token)
          else reject(new Error("No access token returned."))
        },
        error_callback: () => reject(new Error("Google sign-in failed.")),
      })
    }

    tokenClient.callback = (resp) => {
      if (resp?.access_token) resolve(resp.access_token)
      else reject(new Error("No access token returned."))
    }

    tokenClient.requestAccessToken({ prompt: "consent" })
  })
}

export async function uploadToDriveResumable({ accessToken, fileName, mimeType, blob }) {
  const start = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": mimeType,
      "X-Upload-Content-Length": String(blob.size),
    },
    body: JSON.stringify({ name: fileName }),
  })

  const location = start.headers.get("location")
  if (!location) throw new Error("Drive resumable session did not return an upload URL.")

  const put = await fetch(location, {
    method: "PUT",
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(blob.size),
      "Content-Range": `bytes 0-${blob.size - 1}/${blob.size}`,
    },
    body: blob,
  })

  if (!put.ok) {
    const text = await put.text().catch(() => "")
    throw new Error(`Drive upload failed (${put.status}). ${text}`)
  }

  const data = await put.json().catch(() => ({}))
  return { id: data.id, webViewLink: data.webViewLink }
}