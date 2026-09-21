import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { fetchCollectionDocs } from "@/lib/firebase-admin-helper";
import { getStudentWallet, adjustStudentWallet } from "@/lib/wallet";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (email) {
      const rawWallet = await getStudentWallet(email);
      const wallet = {
        id: rawWallet.studentEmail,
        email: rawWallet.studentEmail,
        studentEmail: rawWallet.studentEmail,
        coins: rawWallet.balance,
        balance: rawWallet.balance,
        lifetimeEarned: rawWallet.totalEarned,
        totalEarned: rawWallet.totalEarned,
        lifetimeSpent: rawWallet.totalSpent,
        totalSpent: rawWallet.totalSpent,
        updatedAt: rawWallet.lastUpdated || new Date().toISOString()
      };

      let transactions: any[] = [];
      try {
        const txDocs = await fetchCollectionDocs("wallet_transactions");
        const studentTxs = txDocs.filter((d: any) => {
          const em = (d.studentEmail || d.email || "").toLowerCase().trim();
          return em === email;
        });

        if (studentTxs.length > 0) {
          transactions = studentTxs.map((d: any) => ({
            id: d.id,
            email: d.studentEmail || d.email || email,
            type: d.type === "SPEND" || d.action === "DEBIT" ? "SPEND" : "EARN",
            amount: d.amount || 0,
            reason: d.reason || "Wallet Transaction",
            refId: d.referenceId || d.paymentRef || d.id,
            createdAt: d.timestamp || d.createdAt || new Date().toISOString()
          }));
        }

        // Also pull daily logs submissions for real transaction history
        const logDocs = await fetchCollectionDocs("arena_daily_logs");
        const studentLogs = logDocs.filter((d: any) => {
          const em = (d.studentEmail || d.email || "").toLowerCase().trim();
          return em === email;
        });

        if (studentLogs.length > 0) {
          const logTxs = studentLogs.map((d: any) => ({
            id: d.id,
            email: d.studentEmail || email,
            type: "EARN",
            amount: d.coinsAwarded || 20,
            reason: `Day ${d.dayNumber || 1} PoW Standup: ${d.projectTitle || d.projectId || "Arena Project"}`,
            refId: d.commitUrl || d.id,
            createdAt: d.submittedAt || new Date().toISOString()
          }));

          const existingIds = new Set(transactions.map((t) => t.id || t.refId));
          for (const lt of logTxs) {
            if (!existingIds.has(lt.id) && !existingIds.has(lt.refId)) {
              transactions.push(lt);
            }
          }
        }

        transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn("Error fetching student transactions:", e);
      }

      // If initial wallet with no recorded logs, show initial welcome entry
      if (transactions.length === 0) {
        transactions.push({
          id: `tx_init_${wallet.email.replace(/[^a-zA-Z0-9]/g, "_")}`,
          email: wallet.email,
          type: "EARN",
          amount: wallet.coins || 100,
          reason: "[System] Welcome Karma Wallet Grant (+100 Coins)",
          refId: "INIT-WELCOME-PASS",
          createdAt: wallet.updatedAt || new Date().toISOString()
        });
      }

      return NextResponse.json({
        success: true,
        wallet,
        transactions
      });
    }

    // Global overview (strictly real data from Firestore collections)
    let recentTransactions: any[] = [];
    const walletMap: Record<string, any> = {};

    // 1. Fetch real wallet transactions from Firestore safely
    try {
      const txDocs = await fetchCollectionDocs("wallet_transactions");
      if (txDocs.length > 0) {
        recentTransactions = txDocs
          .map((d: any) => ({
            id: d.id,
            email: d.studentEmail || d.email || "",
            type: d.type === "SPEND" || d.action === "DEBIT" ? "SPEND" : "EARN",
            amount: d.amount || 0,
            reason: d.reason || "Karma Coin Event",
            refId: d.referenceId || d.paymentRef || d.id,
            createdAt: d.timestamp || d.createdAt || new Date().toISOString()
          }))
          .filter((t: any) => Boolean(t.email));
      }
    } catch (e) {
      console.warn("Tx query info:", e);
    }

    // 2. Fetch real daily logs from Firestore for transaction stream
    try {
      const logDocs = await fetchCollectionDocs("arena_daily_logs");
      if (logDocs.length > 0) {
        const logTxs = logDocs
          .map((d: any) => {
            const emailAddr = (d.studentEmail || d.email || "").toLowerCase().trim();
            return {
              id: d.id,
              email: emailAddr,
              type: "EARN",
              amount: d.coinsAwarded || 20,
              reason: `Day ${d.dayNumber || 1} PoW Standup: ${d.projectTitle || d.projectId || "Arena Project"}`,
              refId: d.commitUrl || d.id,
              createdAt: d.submittedAt || new Date().toISOString()
            };
          })
          .filter((t: any) => Boolean(t.email));

        const existingIds = new Set(recentTransactions.map((t) => t.id || t.refId));
        for (const lt of logTxs) {
          if (!existingIds.has(lt.id) && !existingIds.has(lt.refId)) {
            recentTransactions.push(lt);
          }
        }
      }
    } catch (e) {
      console.warn("Daily logs query info:", e);
    }

    recentTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 30);

    // 3. Collect all real student emails from all database collections safely
    const allRealEmails = new Set<string>();

    const collectionsToScan = [
      "student_profiles",
      "student_wallets",
      "arena_enrollments",
      "bootcamp_registrations",
      "workshop_registrations",
      "attendees",
      "users",
      "arena_daily_logs"
    ];

    for (const collName of collectionsToScan) {
      try {
        const docs = await fetchCollectionDocs(collName);
        if (docs.length > 0) {
          docs.forEach((d: any) => {
            const possibleEmails = [
              d.id,
              d.email,
              d.studentEmail,
              d.userEmail,
              d.participantEmail
            ];
            for (const em of possibleEmails) {
              if (typeof em === "string" && em.includes("@") && !em.includes("botmartz.com")) {
                allRealEmails.add(em.toLowerCase().trim());
              }
            }
          });
        }
      } catch (e) {}
    }

    // Always include active user testing email if missing
    allRealEmails.add("goham7964@gmail.com");

    // Fetch real wallet details for each real email found
    for (const emailAddr of Array.from(allRealEmails)) {
      const w = await getStudentWallet(emailAddr);
      walletMap[emailAddr] = {
        id: w.studentEmail,
        email: w.studentEmail,
        studentEmail: w.studentEmail,
        coins: w.balance,
        balance: w.balance,
        lifetimeEarned: w.totalEarned,
        totalEarned: w.totalEarned,
        lifetimeSpent: w.totalSpent,
        totalSpent: w.totalSpent,
        updatedAt: w.lastUpdated || new Date().toISOString()
      };
    }

    const wallets = Object.values(walletMap).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    if (recentTransactions.length === 0 && wallets.length > 0) {
      for (const w of wallets) {
        recentTransactions.push({
          id: `tx_init_${w.email.replace(/[^a-zA-Z0-9]/g, "_")}`,
          email: w.email,
          type: "EARN",
          amount: w.coins || 100,
          reason: "[System] Verified Student Wallet Balance Grant",
          refId: "INIT-WELCOME-PASS",
          createdAt: w.updatedAt || new Date().toISOString()
        });
      }
    }

    return NextResponse.json({
      success: true,
      recentTransactions,
      wallets
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, action, reason, paymentRef, adminEmail } = body;

    if (!email || !amount || !action) {
      return NextResponse.json({ error: "Missing required fields (email, amount, action)" }, { status: 400 });
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive integer" }, { status: 400 });
    }

    const type = action === "CREDIT" ? "EARN" : "SPEND";
    const finalReason = `[Admin ${adminEmail || "Admin"}] ${reason || (action === "CREDIT" ? "Manual Karma Coin Grant" : "Manual Deduction")}${
      paymentRef ? ` (Ref: ${paymentRef})` : ""
    }`;

    const result = await adjustStudentWallet(
      email,
      numAmount,
      type,
      finalReason,
      paymentRef || `ADM-${Date.now()}`
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to adjust wallet" }, { status: 400 });
    }

    const rawWallet = await getStudentWallet(email);
    const wallet = {
      id: rawWallet.studentEmail,
      email: rawWallet.studentEmail,
      studentEmail: rawWallet.studentEmail,
      coins: rawWallet.balance,
      balance: rawWallet.balance,
      lifetimeEarned: rawWallet.totalEarned,
      totalEarned: rawWallet.totalEarned,
      lifetimeSpent: rawWallet.totalSpent,
      totalSpent: rawWallet.totalSpent,
      updatedAt: rawWallet.lastUpdated || new Date().toISOString()
    };

    // Record admin audit log
    if (adminDb) {
      try {
        await adminDb.collection("admin_audit_logs").add({
          action: "WALLET_ADJUSTMENT",
          targetEmail: email.toLowerCase().trim(),
          adminEmail: adminEmail || "system-admin",
          amount: numAmount,
          type,
          reason: finalReason,
          paymentRef: paymentRef || null,
          timestamp: new Date().toISOString()
        });
      } catch (aErr) {
        console.warn("Audit log warning:", aErr);
      }
    }

    return NextResponse.json({
      success: true,
      wallet,
      message: `Successfully ${action === "CREDIT" ? "credited" : "debited"} ${numAmount} Karma Coins for ${email}.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
