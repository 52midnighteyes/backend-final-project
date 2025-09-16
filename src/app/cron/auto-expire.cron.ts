// import cron from "node-cron";
// import prisma from "../lib/prisma";

// cron.schedule("* * * * *", async () => {
//   console.log("cronjob jalan cuy");
//   try {
//     const now = new Date();

//     const expiredTransaction = await prisma.transaction.updateMany({
//       where: {
//         status: "WAITING_FOR_PAYMENT",
//         expired_at: {
//           lte: now,
//         },
//       },
//       data: {
//         status: "EXPIRED",
//       },
//     });

//     console.log(`${expiredTransaction.count} have expired`);
//   } catch (err) {
//     console.error("cronjob error:", err);
//   }
// });
