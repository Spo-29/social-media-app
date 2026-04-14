# System Architecture Diagram (Mermaid Source)

```mermaid
flowchart LR
  U[Users]
  FE[React Frontend\nRouting + React Query + Context API]
  API[Express API Server\nAuth + Posts + Comments + Likes + Stories + Users + Relationships]
  DB[(SQL Server\ndb_project)]
  FS[(Local Upload Storage\nclient/public/upload)]

  U --> FE
  FE -->|Axios + Cookies| API
  API -->|SQL Queries via mssql/msnodesqlv8| DB
  API -->|Multer Upload| FS
  FE -->|Reads Uploaded Images| FS
```
