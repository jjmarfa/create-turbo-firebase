/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import type { IUser } from "@repo/common";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest(
  { region: "asia-east1" },
  (request, response) => {
    const user: IUser = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    };
    logger.info("Hello logs!!!", { structuredData: true, user });

    response.send(`Hello from Firebase!! ${user.name}`);
  }
);
