import { PrismaClient, OnRampStatus, TransactionStatus, AuthType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // --------------------------------------------------
  // 1. Common password
  // --------------------------------------------------

  const password = await bcrypt.hash("password123", 10);

  // --------------------------------------------------
  // 2. Users
  // --------------------------------------------------

  const alice = await prisma.user.upsert({
    where: { number: "1111111111" },
    update: {},
    create: {
      number: "1111111111",
      password,
      name: "Alice",
      email: "alice@example.com",
      Balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { number: "2222222222" },
    update: {},
    create: {
      number: "2222222222",
      password,
      name: "Bob",
      email: "bob@example.com",
      Balance: {
        create: {
          amount: 8500,
          locked: 0,
        },
      },
    },
  });

  const charlie = await prisma.user.upsert({
    where: { number: "3333333333" },
    update: {},
    create: {
      number: "3333333333",
      password,
      name: "Charlie",
      email: "charlie@example.com",
      Balance: {
        create: {
          amount: 15250,
          locked: 0,
        },
      },
    },
  });

  const david = await prisma.user.upsert({
    where: { number: "4444444444" },
    update: {},
    create: {
      number: "4444444444",
      password,
      name: "David",
      email: "david@example.com",
      Balance: {
        create: {
          amount: 3200,
          locked: 0,
        },
      },
    },
  });

  const emma = await prisma.user.upsert({
    where: { number: "5555555555" },
    update: {},
    create: {
      number: "5555555555",
      password,
      name: "Emma",
      email: "emma@example.com",
      Balance: {
        create: {
          amount: 42000,
          locked: 0,
        },
      },
    },
  });

  const frank = await prisma.user.upsert({
    where: { number: "6666666666" },
    update: {},
    create: {
      number: "6666666666",
      password,
      name: "Frank",
      email: "frank@example.com",
      Balance: {
        create: {
          amount: 7750,
          locked: 0,
        },
      },
    },
  });

  console.log("✅ Users created");

  // --------------------------------------------------
  // 3. On-Ramp Transactions
  // --------------------------------------------------

  await prisma.onRampTransaction.createMany({
    data: [
      {
        userId: alice.id,
        amount: 10000,
        status: OnRampStatus.Success,
        token: "ALICE-ONRAMP-001",
        provider: "HDFC Bank",
        startTime: new Date(Date.now() - 86400000 * 5),
      },
      {
        userId: alice.id,
        amount: 5000,
        status: OnRampStatus.Success,
        token: "ALICE-ONRAMP-002",
        provider: "ICICI Bank",
        startTime: new Date(Date.now() - 86400000 * 2),
      },
      {
        userId: bob.id,
        amount: 7000,
        status: OnRampStatus.Success,
        token: "BOB-ONRAMP-001",
        provider: "HDFC Bank",
        startTime: new Date(Date.now() - 86400000 * 4),
      },
      {
        userId: bob.id,
        amount: 2500,
        status: OnRampStatus.Failure,
        token: "BOB-ONRAMP-002",
        provider: "SBI Bank",
        startTime: new Date(Date.now() - 86400000),
      },
      {
        userId: charlie.id,
        amount: 12000,
        status: OnRampStatus.Success,
        token: "CHARLIE-ONRAMP-001",
        provider: "ICICI Bank",
        startTime: new Date(Date.now() - 86400000 * 3),
      },
      {
        userId: david.id,
        amount: 3000,
        status: OnRampStatus.Processing,
        token: "DAVID-ONRAMP-001",
        provider: "HDFC Bank",
        startTime: new Date(),
      },
      {
        userId: emma.id,
        amount: 20000,
        status: OnRampStatus.Success,
        token: "EMMA-ONRAMP-001",
        provider: "Axis Bank",
        startTime: new Date(Date.now() - 86400000 * 6),
      },
      {
        userId: frank.id,
        amount: 5000,
        status: OnRampStatus.Success,
        token: "FRANK-ONRAMP-001",
        provider: "SBI Bank",
        startTime: new Date(Date.now() - 86400000 * 2),
      },
    ],
  });

  console.log("✅ On-ramp transactions created");

  // --------------------------------------------------
  // 4. P2P Transfers
  // --------------------------------------------------

  await prisma.p2pTransfer.createMany({
    data: [
      {
        amount: 1500,
        timestamp: new Date(Date.now() - 86400000 * 4),
        fromUserId: alice.id,
        toUserId: bob.id,
      },
      {
        amount: 750,
        timestamp: new Date(Date.now() - 86400000 * 3),
        fromUserId: bob.id,
        toUserId: charlie.id,
      },
      {
        amount: 2000,
        timestamp: new Date(Date.now() - 86400000 * 2),
        fromUserId: charlie.id,
        toUserId: emma.id,
      },
      {
        amount: 500,
        timestamp: new Date(Date.now() - 86400000),
        fromUserId: david.id,
        toUserId: alice.id,
      },
      {
        amount: 1250,
        timestamp: new Date(),
        fromUserId: emma.id,
        toUserId: frank.id,
      },
      {
        amount: 300,
        timestamp: new Date(Date.now() - 3600000 * 5),
        fromUserId: frank.id,
        toUserId: bob.id,
      },
    ],
  });

  console.log("✅ P2P transfers created");

  // --------------------------------------------------
  // 5. Recent Transactions
  // --------------------------------------------------

  await prisma.recentTransaction.createMany({
    data: [
      // Alice
      {
        userId: alice.id,
        amount: 1500,
        provider: "Bob",
        status: TransactionStatus.Transfer,
        timestamp: new Date(Date.now() - 86400000 * 4),
      },
      {
        userId: alice.id,
        amount: 500,
        provider: "David",
        status: TransactionStatus.Received,
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        userId: alice.id,
        amount: 5000,
        provider: "ICICI Bank",
        status: TransactionStatus.Received,
        timestamp: new Date(Date.now() - 86400000 * 2),
      },

      // Bob
      {
        userId: bob.id,
        amount: 1500,
        provider: "Alice",
        status: TransactionStatus.Received,
        timestamp: new Date(Date.now() - 86400000 * 4),
      },
      {
        userId: bob.id,
        amount: 750,
        provider: "Charlie",
        status: TransactionStatus.Transfer,
        timestamp: new Date(Date.now() - 86400000 * 3),
      },
      {
        userId: bob.id,
        amount: 300,
        provider: "Frank",
        status: TransactionStatus.Received,
        timestamp: new Date(Date.now() - 3600000 * 5),
      },

      // Charlie
      {
        userId: charlie.id,
        amount: 750,
        provider: "Bob",
        status: TransactionStatus.Received,
        timestamp: new Date(Date.now() - 86400000 * 3),
      },
      {
        userId: charlie.id,
        amount: 2000,
        provider: "Emma",
        status: TransactionStatus.Transfer,
        timestamp: new Date(Date.now() - 86400000 * 2),
      },

      // David
      {
        userId: david.id,
        amount: 500,
        provider: "Alice",
        status: TransactionStatus.Transfer,
        timestamp: new Date(Date.now() - 86400000),
      },

      // Emma
      {
        userId: emma.id,
        amount: 2000,
        provider: "Charlie",
        status: TransactionStatus.Received,
        timestamp: new Date(Date.now() - 86400000 * 2),
      },
      {
        userId: emma.id,
        amount: 1250,
        provider: "Frank",
        status: TransactionStatus.Transfer,
        timestamp: new Date(),
      },

      // Frank
      {
        userId: frank.id,
        amount: 1250,
        provider: "Emma",
        status: TransactionStatus.Received,
        timestamp: new Date(),
      },
      {
        userId: frank.id,
        amount: 300,
        provider: "Bob",
        status: TransactionStatus.Transfer,
        timestamp: new Date(Date.now() - 3600000 * 5),
      },
    ],
  });

  console.log("✅ Recent transactions created");

  // --------------------------------------------------
  // 6. Merchants
  // --------------------------------------------------

  await prisma.merchant.upsert({
    where: {
      email: "merchant1@example.com",
    },
    update: {},
    create: {
      email: "merchant1@example.com",
      name: "Demo Store",
      auth_type: AuthType.Google,
    },
  });

  await prisma.merchant.upsert({
    where: {
      email: "merchant2@example.com",
    },
    update: {},
    create: {
      email: "merchant2@example.com",
      name: "Tech Shop",
      auth_type: AuthType.Github,
    },
  });

  console.log("✅ Merchants created");

  console.log("");
  console.log("🎉 Seed completed successfully!");
  console.log("");
  console.log("Login credentials:");
  console.log("------------------------------");
  console.log("Alice   | 1111111111 | password123");
  console.log("Bob     | 2222222222 | password123");
  console.log("Charlie | 3333333333 | password123");
  console.log("David   | 4444444444 | password123");
  console.log("Emma    | 5555555555 | password123");
  console.log("Frank   | 6666666666 | password123");
  console.log("------------------------------");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
