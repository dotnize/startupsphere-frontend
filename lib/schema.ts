import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { LocationData } from "./InteractiveMapContext";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),

  coordinates: jsonb("coordinates"),
  avatarUrl: text("avatar_url"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  location: text("location").notNull(),
  investor: boolean("investor").notNull().default(false),
  moderator: boolean("moderator").notNull().default(false),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const startups = pgTable("startups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  coordinates: jsonb("coordinates").$type<LocationData>(),
  description: text("description"),
  location: text("location").notNull(),
  founderName: text("founder_name"),
  websiteUrl: text("website_url"),
  logoUrl: text("logo_url"),
  industry: text("industry").notNull(),
  stage: text("stage"),
  employees: text("employees"), // <- unnecessary?
  foundedDate: timestamp("founded_date"),
  contactInfo: text("contact_info"),

  // analytics
  likes: bigint("likes", { mode: "number" }).notNull().default(0),
  favorites: bigint("favorites", { mode: "number" }).notNull().default(0),
  views: bigint("views", { mode: "number" }).notNull().default(0),
});

export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    startupId: integer("startup_id")
      .notNull()
      .references(() => startups.id),

    // composite primary key
  },
  (table) => ({ pk: primaryKey({ columns: [table.userId, table.startupId] }) })
);

export const likes = pgTable(
  "likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    startupId: integer("startup_id")
      .notNull()
      .references(() => startups.id),

    // composite primary key
  },
  (table) => ({ pk: primaryKey({ columns: [table.userId, table.startupId] }) })
);

export type UserWithPassword = typeof users.$inferInsert;
export type User = Omit<UserWithPassword, "hashedPassword">;
export type Startup = typeof startups.$inferInsert;
