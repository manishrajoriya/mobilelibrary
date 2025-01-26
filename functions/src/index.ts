// /**
//  * Import function triggers from their respective submodules:
//  *
//  * import {onCall} from "firebase-functions/v2/https";
//  * import {onDocumentWritten} from "firebase-functions/v2/firestore";
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// // export const helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });



// import { onSchedule } from "firebase-functions/v2/scheduler";


// // Schedule the function to run every day at midnight
// export const checkExpiredMembers = onSchedule(
//   {
//     schedule: "0 0 * * *", // Cron expression for midnight every day
//     timeZone: "UTC", // Set the timezone
//   },
//   async (event) => {
//     try {
      
//       console.log("Expired members check completed successfully.");
//     } catch (error) {
//       console.error("Error in expired members check:", error);
//     }
//   }
// );
