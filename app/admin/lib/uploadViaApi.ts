export const uploadViaDriveApi = async (
  driveUrl: string,
  bucket: string,
  path: string
): Promise<string | null> => {
  try {
    const res = await fetch("/api/upload-from-drive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: driveUrl, bucket, path }), // ✅ fixed key name
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    return data?.url || null;
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
};
