const URL = import.meta.env.VITE_BASE_URL;

interface ApiRequestInit extends RequestInit {
  etag?: string;
}

export const apiFetch = async (
  endpoint: string,
  options: ApiRequestInit = {}
) => {
  const token = localStorage.getItem("authToken");

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  });

  // Add If-Match header if etag is provided in options
  if (options.etag) {
    // Ensure etag is properly quoted when sending
    const quotedEtag = options.etag.startsWith('"')
      ? options.etag
      : `"${options.etag}"`;
    headers.set("If-Match", quotedEtag);
  }

  const response = await fetch(`${URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  // Get the ETag from the response if present - try different cases
  const responseEtag = response.headers.get("ETag");

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    return responseEtag ? { data, etag: responseEtag } : data;
  }

  return null;
};
