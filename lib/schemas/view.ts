/**
 * Generated by orval v6.29.1 🍺
 * Do not edit manually.
 * StartupSphere API
 * API documentation for StartupSphere, the 3D mapping platform for startup ecosystems.
 * OpenAPI spec version: 1.0
 */
import type { Startup } from "./startup";

export interface View {
  id: number;
  startup: Startup;
  timestamp: string;
  /** @nullable */
  user_id: number | null;
}
