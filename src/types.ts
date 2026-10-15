export interface Lead {
  id: string;
  type: 'buyer' | 'investor';
  leadName: string;
  contactPerson: string;
  phone: string;
  email: string;
  companyType: string;
  targetBuilding: string;
  requiredArea: string;
  budgetPKR: string;
  budgetUSD: string;
  intentUrgency: string;
  purpose: string;
  specialRequirements: string;
  source: string;
  sourceUrl?: string;
  tags: string[];
  verifiedDate: string;
  status: 'Verified Hot' | 'Active Pipeline' | 'In Discussion' | 'Follow Up' | 'Closed';
  notes?: string;
}

export interface BuildingInfo {
  name: string;
  address: string;
  grade: string;
  avgPricePerSqftPKR: number;
  rentalPerSqftMonthPKR: number;
  rentalYieldEst: string;
  occupancyRate: string;
  backupPower: string;
  parking: string;
  keyTenants: string;
  highlights: string;
}

export interface QualificationResult {
  matchScore: number;
  recommendation: string;
  rentalYieldGross: string;
  paybackPeriodYears: number;
  keySellingPoints: string[];
  potentialObjections: string[];
  closingStrategy: string;
}

export interface OutreachContent {
  whatsappEnglish: string;
  whatsappRomanUrdu: string;
  formalEmail: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface SearchLeadsResponse {
  success: boolean;
  text?: string;
  sources?: GroundingSource[];
  error?: string;
  timestamp?: string;
}
