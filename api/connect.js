import sql from "mssql/msnodesqlv8.js";

const config = {
  server: ".\\SQLEXPRESS",
  database: "db_project",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server successfully!");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed! Details:", err);
    throw err;
  });

export const db = {
  query: async (queryString, values = []) => {
    const pool = await poolPromise;
    const request = pool.request();

    let paramIndex = 0;
    const convertedQuery = queryString.replace(/\?/g, () => {
      const paramName = `param${paramIndex}`;
      request.input(paramName, values[paramIndex]);
      paramIndex++;
      return `@${paramName}`;
    });
console.log("Running query:", convertedQuery);
console.log("Values:", values);
    return await request.query(convertedQuery);
  },
  pool: poolPromise,
};