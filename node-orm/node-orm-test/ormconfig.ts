import { ConnectionOptions } from "typeorm";

export const db_config: ConnectionOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "node_user",
  password: "cyx19941116",
  database: "node_test",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  // migrations: ["src/migration/**/*.ts"],
  // subscribers: ["src/subscriber/**/*.ts"],
  // cli: {
  //   entitiesDir: "src/entity",
  //   migrationsDir: "src/migration",
  //   subscribersDir: "src/subscriber",
  // },
};
