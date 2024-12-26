"use server";

import { db } from "~/db";

export async function GetProjectIDs() {
  return await db.query.postsTable.findMany({
    columns: {
      id: true,
    },
  });
}
