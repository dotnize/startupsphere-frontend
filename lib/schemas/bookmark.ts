/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * StartupSphere API
 * API documentation for StartupSphere, the 3D mapping platform for startup ecosystems.
 * OpenAPI spec version: 1.0
 */
import type { Startup } from "./startup";
import type { User } from "./user";

export interface Bookmark {
  id: number;
  startup: Startup;
  timestamp: string;
  user: User;
}
