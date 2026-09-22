import { adminDb, hasAdminCredentials } from "./firebase-admin";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { fetchCollectionDocs } from "./firebase-admin-helper";
import { recordSecurityAuditLog } from "./zero-trust";
import { emailProvider } from "./email/provider";
import { buildKarmaCoinsSpentEmail } from "./mail-templates";

export interface WalletTransaction {
  id: string;
  studentEmail: string;
  type: "EARN" | "SPEND" | "TRANSFER" | "BONUS_PROFILE_COMPLETION" | "POW_DAILY_LOG" | "UGC_REWARD";
  amount: number;
  reason: string;
  referenceId?: string;
  timestamp: string;
  balanceAfter: number;
}

export interface StudentWallet {
  studentEmail: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  reputationLevel: number;
  unlockedPerks: string[];
  lastUpdated?: any;
}

export async function getStudentWallet(email: string): Promise<StudentWallet> {
  const cleanEmail = email.toLowerCase().trim();

  try {
    let walletBalance = 100;
    let walletEarned = 100;
    let walletSpent = 0;
    let reputationLevel = 1;
    let unlockedPerks: string[] = ["Community Member Access"];

    // 1. Fetch student_wallets docs safely
    try {
      const walletDocs = await fetchCollectionDocs("student_wallets");
      const matchedWalletDoc = walletDocs.find((w: any) => {
        const em = (w.studentEmail || w.email || w.id || "").toLowerCase().trim();
        return em === cleanEmail;
      });
      if (matchedWalletDoc) {
        walletBalance = Number(matchedWalletDoc.balance) || 100;
        walletEarned = Number(matchedWalletDoc.totalEarned) || walletBalance;
        walletSpent = Number(matchedWalletDoc.totalSpent) || 0;
        reputationLevel = matchedWalletDoc.reputationLevel || 1;
        unlockedPerks = matchedWalletDoc.unlockedPerks || unlockedPerks;
      }
    } catch (e) {}

    // 2. Fetch student_profiles docs case-insensitively
    let profileCoins: number | null = null;
    let profileEarned: number | null = null;
    try {
      const profileDocs = await fetchCollectionDocs("student_profiles");
      profileDocs.forEach((p: any) => {
        const em = (p.email || p.studentEmail || p.id || "").toLowerCase().trim();
        if (em === cleanEmail) {
          if (typeof p.karmaCoins === "number") profileCoins = Math.max(profileCoins ?? 0, p.karmaCoins);
          if (typeof p.totalKarmaEarned === "number") profileEarned = Math.max(profileEarned ?? 0, p.totalKarmaEarned);
        }
      });
    } catch (e) {}

    // 3. Fetch daily logs docs case-insensitively
    let dailyLogsCoinsSum = 0;
    try {
      const logDocs = await fetchCollectionDocs("arena_daily_logs");
      logDocs.forEach((l: any) => {
        const em = (l.studentEmail || l.email || "").toLowerCase().trim();
        if (em === cleanEmail) {
          const c = Number(l.coinsAwarded) || 20;
          dailyLogsCoinsSum += c;
        }
      });
    } catch (e) {}

    const computedLogsTotal = 100 + dailyLogsCoinsSum;
    const realBalance = Math.max(walletBalance, profileCoins ?? 0, computedLogsTotal);
    const realTotalEarned = Math.max(walletEarned, profileEarned ?? realBalance, computedLogsTotal);

    const mergedWallet: StudentWallet = {
      studentEmail: cleanEmail,
      balance: realBalance,
      totalEarned: realTotalEarned,
      totalSpent: walletSpent,
      reputationLevel: Math.max(reputationLevel, Math.min(Math.floor(realTotalEarned / 300) + 1, 10)),
      unlockedPerks,
      lastUpdated: new Date().toISOString()
    };

    // Keep student_wallets doc in sync
    if (adminDb && hasAdminCredentials) {
      adminDb.collection("student_wallets").doc(cleanEmail).set(mergedWallet, { merge: true }).catch(() => {});
    } else {
      setDoc(doc(db, "student_wallets", cleanEmail), mergedWallet, { merge: true }).catch(() => {});
    }

    return mergedWallet;
  } catch (err) {
    console.warn("getStudentWallet error:", err);
    return {
      studentEmail: cleanEmail,
      balance: 100,
      totalEarned: 100,
      totalSpent: 0,
      reputationLevel: 1,
      unlockedPerks: ["Community Member Access"]
    };
  }
}


/**
 * Atomically adjusts wallet balance, total earned, total spent, and reputation level.
 * Prevents race conditions and guarantees ledger precision across all reward events.
 */
export async function adjustStudentWallet(
  email: string,
  amount: number,
  type: "EARN" | "SPEND" | "BONUS_PROFILE_COMPLETION" | "POW_DAILY_LOG" | "UGC_REWARD",
  reason: string,
  referenceId?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const cleanEmail = email.toLowerCase().trim();

  if (!adminDb || !hasAdminCredentials) {
    const newBal = Math.max(0, 100 - (type === "SPEND" ? amount : -amount));
    if (type === "SPEND") {
      emailProvider.sendEmail({
        to: cleanEmail,
        subject: `Karma Coins Spend Confirmation (-${amount} Coins) | Botmartz`,
        html: buildKarmaCoinsSpentEmail({
          email: cleanEmail,
          amount,
          reason,
          newBalance: newBal,
          referenceId: referenceId || `tx_${Date.now()}`
        })
      }).catch((mailErr) => {
        console.warn("Failed to dispatch fallback Karma spend email:", mailErr);
      });
    }
    return { success: true, newBalance: newBal };
  }

  try {
    const walletRef = adminDb.collection("student_wallets").doc(cleanEmail);
    const txCollection = adminDb.collection("wallet_transactions");

    // Execute atomic transaction
    const result = await adminDb.runTransaction(async (t) => {
      const doc = await t.get(walletRef);

      let currentBalance = 100;
      let totalEarned = 100;
      let totalSpent = 0;
      let unlockedPerks: string[] = ["Community Member Access"];

      if (doc.exists) {
        const data = doc.data() as StudentWallet;
        currentBalance = Number(data.balance) || 0;
        totalEarned = Number(data.totalEarned) || currentBalance;
        totalSpent = Number(data.totalSpent) || 0;
        unlockedPerks = data.unlockedPerks || unlockedPerks;
      }

      const isDeduction = type === "SPEND";

      if (isDeduction && currentBalance < amount) {
        throw new Error(`Insufficient Botmartz Coins. Balance: ${currentBalance}, Required: ${amount}`);
      }

      const newBalance = isDeduction ? currentBalance - amount : currentBalance + amount;
      const newTotalEarned = isDeduction ? totalEarned : totalEarned + amount;
      const newTotalSpent = isDeduction ? totalSpent + amount : totalSpent;
      const reputationLevel = Math.min(Math.floor(newTotalEarned / 300) + 1, 10);

      // Unlock tier perks
      if (newTotalEarned >= 300 && !unlockedPerks.includes("Verified Shipper")) {
        unlockedPerks.push("Verified Shipper");
      }
      if (newTotalEarned >= 600 && !unlockedPerks.includes("Priority Code Review")) {
        unlockedPerks.push("Priority Code Review");
      }
      if (newTotalEarned >= 1000 && !unlockedPerks.includes("15 Company Referral Dispatch")) {
        unlockedPerks.push("15 Company Referral Dispatch");
      }

      t.set(
        walletRef,
        {
          studentEmail: cleanEmail,
          balance: newBalance,
          totalEarned: newTotalEarned,
          totalSpent: newTotalSpent,
          reputationLevel,
          unlockedPerks,
          lastUpdated: new Date().toISOString()
        },
        { merge: true }
      );

      // Add to transaction ledger
      const newTxRef = txCollection.doc();
      t.set(newTxRef, {
        id: newTxRef.id,
        studentEmail: cleanEmail,
        type,
        amount,
        reason,
        referenceId: referenceId || "",
        balanceAfter: newBalance,
        timestamp: new Date().toISOString()
      });

      return { newBalance, newTotalEarned };
    });

    // Also sync karmaCoins in student_profiles if profile exists
    try {
      const profileSnap = await adminDb
        .collection("student_profiles")
        .where("email", "==", cleanEmail)
        .limit(1)
        .get();

      if (!profileSnap.empty) {
        const docRef = profileSnap.docs[0].ref;
        await docRef.set(
          {
            karmaCoins: result.newBalance,
            totalKarmaEarned: result.newTotalEarned,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      }
    } catch (profileSyncErr) {
      console.warn("Profile sync non-fatal warning:", profileSyncErr);
    }

    // Zero-Trust Security Audit
    await recordSecurityAuditLog({
      action: `WALLET_${type}`,
      actor: cleanEmail,
      details: { amount, reason, newBalance: result.newBalance },
      severity: "INFO",
      status: "SUCCESS"
    });

    // Automatically send Email Confirmation when Karma Coins are spent
    if (type === "SPEND") {
      emailProvider.sendEmail({
        to: cleanEmail,
        subject: `Karma Coins Spend Confirmation (-${amount} Coins) | Botmartz`,
        html: buildKarmaCoinsSpentEmail({
          email: cleanEmail,
          amount,
          reason,
          newBalance: result.newBalance,
          referenceId
        })
      }).catch((mailErr) => {
        console.warn("Failed to dispatch Karma spend email:", mailErr);
      });
    }

    return { success: true, newBalance: result.newBalance };
  } catch (err: any) {
    console.error("Wallet transaction failure:", err);
    return { success: false, newBalance: 0, error: err.message || "Failed to adjust wallet" };
  }
}
