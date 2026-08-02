import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { RiskLevel } from "@/types/trip.types";

export const RISK_CONFIG: Record<RiskLevel, { label: string; icon: typeof ShieldCheck; color: string }> = {
  LOW: { label: "Low risk", icon: ShieldCheck, color: "#0ca30c" },
  MEDIUM: { label: "Medium risk", icon: ShieldAlert, color: "#fab219" },
  HIGH: { label: "High risk", icon: ShieldX, color: "#d03b3b" },
};
