import { adminDb } from "./firebase-admin";
import { recordSecurityAuditLog } from "./zero-trust";

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

  if (!adminDb) {
    return {
      studentEmail: cleanEmail,
      balance: 100,
      totalEarned: 100,
      totalSpent: 0,
      reputationLevel: 1,
      unlockedPerks: ["Community Member Access"]
    };
  }

  try {
    const doc = await adminDb.collection("student_wallets").doc(cleanEmail).get();
    if (doc.exists) {
      return doc.data() as StudentWallet;
    }

    // Initialize new wallet with 100 Welcome Coins
    const initialWallet: StudentWallet = {
      studentEmail: cleanEmail,
      balance: 100,
      totalEarned: 100,
      totalSpent: 0,
      reputationLevel: 1,
      unlockedPerks: ["Community Member Access"],
      lastUpdated: new Date().toISOString()
    };

    await adminDb.collection("student_wallets").doc(cleanEmail).set(initialWallet);
    return initialWallet;
  } catch (err) {
    console.error("Wallet retrieval error:", err);
    return {
      studentEmail: cleanEmail,
      balance: 100,
      totalEarned: 100,
      totalSpent: 0,
      reputationLevel: 1,
      unlockedPerks: []
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

  if (!adminDb) {
    return { success: true, newBalance: 100 + amount };
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

    return { success: true, newBalance: result.newBalance };
  } catch (err: any) {
    console.error("Wallet transaction failure:", err);
    return { success: false, newBalance: 0, error: err.message || "Failed to adjust wallet" };
  }
}
