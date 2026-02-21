export interface Company {
  id: string;
  name: string;
  industry: string;
  employee_count: number;
  annual_revenue: number | null;
  website: string | null;
  city: string | null;
  state: string | null;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  seniority: string;
  company_id: string;
}

export interface Deal {
  id: string;
  name: string;
  stage: "closedwon" | "closedlost";
  amount: number;
  close_date: string;
  create_date: string;
  pipeline: string;
  deal_source: string;
  loss_reason: string | null;
  competitor: string | null;
  company_id: string;
  contact_id: string;
  cycle_days: number;
  objections: string[];
  company?: Company;
  contact?: Contact;
}

export interface OverviewMetrics {
  total_deals: number;
  won_deals: number;
  lost_deals: number;
  win_rate: number;
  total_revenue: number;
  avg_deal_size: number;
  avg_cycle_won: number;
  avg_cycle_lost: number;
}

export interface BreakdownItem {
  category: string;
  total: number;
  won: number;
  lost: number;
  win_rate: number;
  avg_deal_size: number;
  total_revenue: number;
}

export interface CompetitorMetrics {
  competitor: string;
  deals_faced: number;
  wins: number;
  losses: number;
  win_rate: number;
  avg_deal_size: number;
  top_loss_reasons: string[];
  industries: string[];
}

export interface ObjectionTheme {
  objection: string;
  frequency: number;
  percentage: number;
  industries: string[];
  win_rate_when_raised: number;
}

export interface ICPProfile {
  industries: string[];
  employee_range: string;
  deal_size_range: string;
  buyer_titles: string[];
  preferred_sources: string[];
  avg_cycle_days: number;
  win_rate: number;
  confidence: number;
}

export interface AIInsightResponse {
  content: string;
  prompt_type: string;
  cached: boolean;
}

export interface AskAIMessage {
  role: "user" | "assistant";
  content: string;
}
