import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type PlacementTrend = {
  year: string;
  percentage: number;
  avgPackage: number;
};

export type PackageGrowth = {
  year: string;
  min: number;
  avg: number;
  max: number;
};

export type BranchRate = {
  branch: string;
  rate: number;
};

export type CompanyHiring = {
  name: string;
  value: number;
};

export type UnplacedReason = {
  reason: string;
  value: number;
};

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}
