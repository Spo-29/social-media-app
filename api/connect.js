import sql from "mssql/msnodesqlv8.js"; // distinct import for Windows Auth

const config = {
  server: "LAPTOP-JLC52F7F\\SQLEXPRESS", // Double backslash \\ is required in JS strings
  database: "db_project",
  driver: "msnodesqlv8", // Required for Integrated Security
  options: {
    trustedConnection: true, // This maps to "Integrated Security=True"
    trustServerCertificate: true, // This maps to "TrustServerCertificate=True"
  },
};

// Create and export the connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server successfully!");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed! Details: ", err);
  });

export const db = {
  query: async (queryString, values) => {
    const pool = await poolPromise;
    const request = pool.request();

    // If values array is provided, convert ? placeholders to named parameters
    if (values && Array.isArray(values)) {
      let paramIndex = 0;
      const convertedQuery = queryString.replace(/\?/g, () => {
        const paramName = `param${paramIndex}`;
        request.input(paramName, values[paramIndex]);
        paramIndex++;
        return `@${paramName}`;
      });
      return request.query(convertedQuery);
    }

    return request.query(queryString);
  },
  pool: poolPromise,
};
