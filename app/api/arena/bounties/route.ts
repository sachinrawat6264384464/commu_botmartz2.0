import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

export async function GET(req: NextRequest) {
  try {
    let bounties: any[] = [];

    if (adminDb) {
      const snap = await adminDb
        .collection("arena_bounties")
        .orderBy("createdAt", "desc")
        .limit(30)
        .get();

      if (!snap.empty) {
        bounties = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() ? d.data().createdAt.toDate().toISOString() : new Date().toISOString()
        }));
      }
    }

    if (bounties.length === 0) {
      bounties = [
        {
          id: "bounty_01",
          authorName: "Rahul Verma",
          authorEmail: "rahul@college.edu",
          projectTitle: "Autonomous Drone WebRTC Edge Telemetry",
          title: "Resolving 1080p 60fps WebRTC aiortc frame drops on Linux",
          bountyCoins: 150,
          domain: "Edge Drone Vision & Robotics",
          discordThreadUrl: "https://discord.gg/k75ZpEnzp",
          status: "OPEN",
          createdAt: new Date().toISOString()
        },
        {
          id: "bounty_02",
          authorName: "Pooja Mehta",
          authorEmail: "pooja@college.edu",
          projectTitle: "Multi-Hop GraphRAG & Knowledge Topology",
          title: "Optimizing Leiden community sub-graph clustering Cypher queries",
          bountyCoins: 200,
          domain: "GraphRAG & Knowledge Topology",
          discordThreadUrl: "https://discord.gg/k75ZpEnzp",
          status: "OPEN",
          createdAt: new Date().toISOString()
        }
      ];
    }

    return NextResponse.json({
      success: true,
      bounties
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authorName, authorEmail, projectTitle, title, description, bountyCoins, domain, discordThreadUrl } = body;

    if (!authorEmail || !title || !bountyCoins) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const cleanCoins = parseInt(bountyCoins, 10) || 50;

    // Deduct coins from author wallet
    const deduction = await adjustStudentWallet(
      authorEmail,
      cleanCoins,
      "SPEND",
      `Posted Blocker Bounty: "${title.slice(0, 40)}..."`
    );

    if (!deduction.success) {
      return NextResponse.json({ error: deduction.error }, { status: 400 });
    }

    let bountyId = "sim_bounty_" + Date.now();
    if (adminDb) {
      const docRef = await adminDb.collection("arena_bounties").add({
        authorName: authorName || "Student Builder",
        authorEmail: authorEmail.toLowerCase().trim(),
        projectTitle: projectTitle || "Arena Production Project",
        title: title.trim(),
        description: description?.trim() || "",
        bountyCoins: cleanCoins,
        domain: domain || "AI Systems",
        discordThreadUrl: discordThreadUrl?.trim() || "https://discord.gg/k75ZpEnzp",
        status: "OPEN",
        createdAt: new Date()
      });
      bountyId = docRef.id;
    }

    return NextResponse.json({
      success: true,
      message: `Blocker Bounty created! ${cleanCoins} Coins escrowed. Discuss live on Discord.`,
      bountyId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
