import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

// GET all discussions & comments for admin moderation
export async function GET(req: Request) {
  try {
    let discussions: any[] = [];

    if (adminDb) {
      const snap = await adminDb.collection("discussions").orderBy("createdAt", "desc").get();
      discussions = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt,
      }));
    }

    return NextResponse.json({ success: true, discussions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch discussions." }, { status: 500 });
  }
}

// POST: Admin creates official discussion thread
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, content, channel, tags, isPinned, authorName, authorRole } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const newPost = {
      title: title.trim(),
      content: content.trim(),
      channel: channel || "announcements",
      tags: tags && Array.isArray(tags) ? tags : ["Official", "Announcement"],
      author: {
        name: authorName || "Soham Sharma (Founder)",
        handle: "@soham_founder",
        role: authorRole || "Founder & Core Admin",
        avatarBg: "from-[#0066FF] to-purple-600",
      },
      upvotes: 1,
      replies: 0,
      commentsList: [],
      isPinned: Boolean(isPinned),
      isOfficial: true,
      isHot: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let id = `disc_${Date.now()}`;
    if (adminDb) {
      const docRef = await adminDb.collection("discussions").add(newPost);
      id = docRef.id;
    }

    return NextResponse.json({ success: true, message: "Discussion thread published successfully.", id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to publish discussion." }, { status: 500 });
  }
}

// DELETE: Delete a thread or a specific comment
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const discussionId = searchParams.get("discussionId");
    const commentId = searchParams.get("commentId");

    if (!discussionId) {
      return NextResponse.json({ error: "discussionId parameter is required." }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: true, message: "Mock deletion (db disabled)." });
    }

    const docRef = adminDb.collection("discussions").doc(discussionId);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Discussion not found." }, { status: 404 });
    }

    // If commentId provided, remove the comment from the commentsList array
    if (commentId) {
      const data = snap.data();
      const existingComments = data?.commentsList || [];
      const targetComment = existingComments.find((c: any) => c.id === commentId);
      const updatedComments = existingComments.filter((c: any) => c.id !== commentId);

      await docRef.update({
        commentsList: updatedComments,
        replies: updatedComments.length,
        updatedAt: new Date().toISOString(),
      });

      // Deduct 20 negative karma coins for spam comment if author email exists
      if (targetComment?.author?.email) {
        await adjustStudentWallet(targetComment.author.email, 20, "SPEND", `Moderation Penalty: Toxic/Spam Comment Removed on Discussion`, discussionId).catch(() => null);
      }

      return NextResponse.json({
        success: true,
        message: "Comment removed by admin moderation (-20 Karma Coins penalty applied).",
      });
    }

    // Otherwise, delete the entire discussion post
    const postData = snap.data();
    await docRef.delete();

    // Deduct 20 negative karma coins for spam post
    const authorEmail = postData?.author?.email || postData?.authorEmail;
    if (authorEmail) {
      await adjustStudentWallet(authorEmail, 20, "SPEND", `Moderation Penalty: Spam Thread Removed from Community`, discussionId).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      message: "Discussion thread deleted by admin moderation (-20 Karma Coins penalty applied).",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete item." }, { status: 500 });
  }
}

// PATCH: Toggle Pin / Lock status
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { discussionId, isPinned, isLocked } = body;

    if (!discussionId || !adminDb) {
      return NextResponse.json({ error: "discussionId is required." }, { status: 400 });
    }

    const docRef = adminDb.collection("discussions").doc(discussionId);
    const updateData: any = { updatedAt: new Date().toISOString() };

    if (isPinned !== undefined) updateData.isPinned = Boolean(isPinned);
    if (isLocked !== undefined) updateData.isLocked = Boolean(isLocked);

    await docRef.update(updateData);

    return NextResponse.json({ success: true, message: "Discussion updated." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update discussion." }, { status: 500 });
  }
}
