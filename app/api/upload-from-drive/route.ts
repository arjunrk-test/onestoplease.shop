import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// More flexible regex to extract file ID
function extractDriveFileId(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  return match?.[1] || match?.[2] || "";
}

export async function POST(req: Request) {
  try {
    const { imageUrl, bucket, path } = await req.json();

    const fileId = extractDriveFileId(imageUrl);
    if (!fileId) {
      throw new Error("Invalid Google Drive URL");
    }

    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const res = await fetch(driveUrl);

    if (!res.ok) {
      throw new Error(`Failed to fetch image from Google Drive: ${res.status}`);
    }

    const blob = await res.blob();

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, blob, {
        upsert: true,
        contentType: blob.type,
      });

    if (error) {
      throw new Error("Supabase upload error: " + error.message);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error("❌ Upload error:", err.message);
    return new Response("Internal Server Error", { status: 500 });
  }
}
