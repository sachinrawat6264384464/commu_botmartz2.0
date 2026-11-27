import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      return NextResponse.json(
        { success: false, error: "Cloudinary cloud name is not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder =
      typeof folderRaw === "string" && /^[a-zA-Z0-9_-]+$/.test(folderRaw.trim())
        ? folderRaw.trim()
        : "botmartz-workshops";

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid image file." },
        { status: 400 }
      );
    }

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", file);
    cloudinaryForm.append("folder", folder);

    if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");
      cloudinaryForm.append("api_key", apiKey);
      cloudinaryForm.append("timestamp", timestamp);
      cloudinaryForm.append("signature", signature);
    } else if (uploadPreset) {
      cloudinaryForm.append("upload_preset", uploadPreset);
    } else {
      return NextResponse.json(
        { success: false, error: "Cloudinary credentials missing." },
        { status: 500 }
      );
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudinaryForm,
    });

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      return NextResponse.json(
        { success: false, error: data?.error?.message || "Cloudinary upload failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    });
  } catch (err: any) {
    console.error("[CloudinaryUpload] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Upload failed." },
      { status: 500 }
    );
  }
}
