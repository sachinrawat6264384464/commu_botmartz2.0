import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

export async function GET(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ discussions: [] });
    }
    const snap = await adminDb.collection("discussions").orderBy("createdAt", "desc").limit(50).get();
    const discussions = snap.docs.map(d => {
      const data = d.data();
      const rawAuthor = data.author;
      const authorObj = typeof rawAuthor === "object" && rawAuthor !== null
        ? {
            name: rawAuthor.name || "Community Builder",
            handle: rawAuthor.handle || `@${(rawAuthor.email || "builder").split("@")[0]}`,
            role: rawAuthor.role || "AI Builder",
            avatarBg: rawAuthor.avatarBg || "from-blue-600 to-indigo-700",
            github: rawAuthor.github || "",
            discord: rawAuthor.discord || "",
            email: rawAuthor.email || data.authorEmail || ""
          }
        : {
            name: typeof rawAuthor === "string" ? rawAuthor : "Community Builder",
            handle: `@${(data.authorEmail || "builder").split("@")[0]}`,
            role: "AI Builder",
            avatarBg: "from-blue-600 to-indigo-700",
            github: "",
            discord: "",
            email: data.authorEmail || ""
          };

      const rawTags = data.tags;
      const tagsArray = Array.isArray(rawTags)
        ? rawTags.map(t => String(t).trim()).filter(Boolean)
        : typeof rawTags === "string"
        ? rawTags.split(",").map(t => t.trim()).filter(Boolean)
        : ["Discussion"];

      const rawComments = data.commentsList;
      const commentsArray = Array.isArray(rawComments)
        ? rawComments.map((c, idx) => ({
            id: c.id || `c-${idx}`,
            author: c.author || "Builder",
            handle: c.handle || "@builder",
            text: c.text || c.content || "",
            timeAgo: c.timeAgo || "Recently"
          }))
        : [];

      return {
        id: d.id,
        title: data.title || "Untitled Discussion",
        content: data.content || "",
        channel: data.channel || "all",
        tags: tagsArray.length > 0 ? tagsArray : ["General"],
        author: authorObj,
        upvotes: typeof data.upvotes === "number" ? data.upvotes : 0,
        replies: typeof data.replies === "number" ? data.replies : commentsArray.length,
        commentsList: commentsArray,
        timeAgo: data.timeAgo || "Recently",
        isHot: Boolean(data.isHot),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
      };
    });
    return NextResponse.json({ discussions });
  } catch (err: any) {
    return NextResponse.json({ discussions: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, postId, title, content, channel, tags, author, comment } = body;

    if (!adminDb) {
      return NextResponse.json({ success: true, message: "Mock response (db offline)" });
    }

    // ACTION 1: UPVOTE A DISCUSSION (+1 Karma Coin to Author)
    if (action === "UPVOTE") {
      if (!postId) {
        return NextResponse.json({ error: "postId is required for upvote." }, { status: 400 });
      }
      const docRef = adminDb.collection("discussions").doc(postId);
      const snap = await docRef.get();
      if (!snap.exists) {
        return NextResponse.json({ error: "Discussion post not found." }, { status: 404 });
      }
      const postData = snap.data();
      const currentUpvotes = (postData?.upvotes || 0) + 1;
      await docRef.update({
        upvotes: currentUpvotes,
        updatedAt: new Date().toISOString()
      });

      // Award +1 Karma Coin to post author
      const authorEmail = postData?.author?.email || postData?.authorEmail;
      if (authorEmail) {
        await adjustStudentWallet(authorEmail, 1, "EARN", `Received Upvote on Discussion: ${postData?.title?.slice(0, 30)}...`, postId).catch(() => null);
      }

      return NextResponse.json({ success: true, upvotes: currentUpvotes });
    }

    // ACTION 2: REPLY / COMMENT ON A DISCUSSION (+3 Karma Coins to Commenter)
    if (action === "REPLY") {
      if (!postId || !comment || !comment.content) {
        return NextResponse.json({ error: "postId and comment content are required." }, { status: 400 });
      }
      const docRef = adminDb.collection("discussions").doc(postId);
      const snap = await docRef.get();
      if (!snap.exists) {
        return NextResponse.json({ error: "Discussion post not found." }, { status: 404 });
      }

      const postData = snap.data();
      const newComment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        content: comment.content.trim(),
        author: {
          name: comment.author?.name || "Community Builder",
          handle: comment.author?.handle || "@builder",
          email: comment.author?.email || ""
        },
        createdAt: new Date().toISOString()
      };

      const existingComments = postData?.commentsList || [];
      const updatedComments = [...existingComments, newComment];

      await docRef.update({
        commentsList: updatedComments,
        replies: updatedComments.length,
        updatedAt: new Date().toISOString()
      });

      // Award +3 Karma Coins to commenter
      if (comment.author?.email) {
        await adjustStudentWallet(comment.author.email, 3, "EARN", `Commented on Discussion: ${postData?.title?.slice(0, 30)}...`, postId).catch(() => null);
      }

      return NextResponse.json({ success: true, comment: newComment, totalReplies: updatedComments.length });
    }

    // ACTION 3: CREATE NEW DISCUSSION THREAD (+5 Karma Coins to Author)
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const newPost = {
      title: title.trim(),
      content: content.trim(),
      channel: channel || "general",
      tags: tags || [],
      author: {
        name: author?.name || "Community Member",
        handle: author?.handle || "@builder",
        email: author?.email || ""
      },
      upvotes: 1,
      replies: 0,
      commentsList: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection("discussions").add(newPost);

    // Award +5 Karma Coins to student author
    if (author?.email) {
      await adjustStudentWallet(author.email, 5, "EARN", `Started Discussion Topic: ${title.slice(0, 30)}...`, docRef.id).catch(() => null);
    }

    return NextResponse.json({ success: true, id: docRef.id, newPost });
  } catch (err: any) {
    console.error("Discussion POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to process discussion action." }, { status: 500 });
  }
}
