import { adminDb } from "./firebase-admin";
import { recordSecurityAuditLog } from "./zero-trust";

export interface WalletTransaction {
  id: string;
  studentEmail: string;
  type: "EARN" | "SPEND" | "TRANSFER";
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
}

export async function getStudentWallet(email: string): Promise<StudentWallet> {
  const cleanEmail = email.toLowerCase().trim();

  if (!adminDb) {
    return {
      studentEmail: cleanEmail,
      balance: 350,
      totalEarned: 500,
      totalSpent: 150,
      reputationLevel: 2,
      unlockedPerks: ["Discord Builder Role", "Office Hours Access"]
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
      unlockedPerks: ["Community Member Access"]
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

export async function adjustStudentWallet(
  email: string,
  amount: number,
  type: "EARN" | "SPEND",
  reason: string,
  referenceId?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const cleanEmail = email.toLowerCase().trim();

  if (!adminDb) {
    return { success: true, newBalance: 400 };
  }

  try {
    const walletRef = adminDb.collection("student_wallets").doc(cleanEmail);
    const doc = await walletRef.get();

    let currentBalance = 100;
    let totalEarned = 100;
    let totalSpent = 0;

    if (doc.exists) {
      const data = doc.data() as StudentWallet;
      currentBalance = data.balance;
      totalEarned = data.totalEarned;
      totalSpent = data.totalSpent;
    }

    if (type === "SPEND" && currentBalance < amount) {
      return {
        success: false,
        newBalance: currentBalance,
        error: `Insufficient Botmartz Coins. You have ${currentBalance} Coins but need ${amount}.`
      };
    }

    const newBalance = type === "EARN" ? currentBalance + amount : currentBalance - amount;
    const newTotalEarned = type === "EARN" ? totalEarned + amount : totalEarned;
    const newTotalSpent = type === "SPEND" ? totalSpent + amount : totalSpent;
    const reputationLevel = Math.min(Math.floor(newTotalEarned / 300) + 1, 10);

    await walletRef.set({
      studentEmail: cleanEmail,
      balance: newBalance,
      totalEarned: newTotalEarned,
      totalSpent: newTotalSpent,
      reputationLevel,
      lastUpdated: new Date()
    }, { merge: true });

    // Record Transaction
    await adminDb.collection("wallet_transactions").add({
      studentEmail: cleanEmail,
      type,
      amount,
      reason,
      referenceId: referenceId || "",
      balanceAfter: newBalance,
      timestamp: new Date()
    });

    // Record Zero-Trust Audit Log
    await recordSecurityAuditLog({
      action: `WALLET_${type}`,
      actor: cleanEmail,
      details: { amount, reason, newBalance },
      severity: "INFO",
      status: "SUCCESS"
    });

    return { success: true, newBalance };
  } catch (err: any) {
    console.error("Wallet adjustment error:", err);
    return { success: false, newBalance: 0, error: err.message };
  }
}
