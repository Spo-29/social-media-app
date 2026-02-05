import Express from "express";
import { db } from "./connect.js";

const app = Express();

app.listen(8800, async () => {
  console.log("API working!");

  try {
    // Query system tables to get a list of all user-created tables
    const result = await db.query("SELECT name FROM sys.tables");

    console.log("Tables found in database:");
    console.table(result.recordset);

    // For each table, get all columns using parameterized query
    for (const table of result.recordset) {
      const tableName = table.name;
      const columns = await db.query(
        `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_NAME = ?`,
        [tableName],
      );

      console.log(`\nColumns in table '${tableName}':`);
      console.table(columns.recordset);
    }
  } catch (err) {
    console.error("Query failed:", err);
  }
});

// yarn add express mssql msnodesqlv8 nodemon