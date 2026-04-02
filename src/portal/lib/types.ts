export type Role = 'admin' | 'client';
export type ProjectStatus = 'active' | 'paused' | 'completed';
export type StepStatus = 'pending' | 'active' | 'done';

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  domain: string | null;
  netlify_preview_url: string | null;
  status: ProjectStatus;
  package_name: string | null;
  package_price: number | null;
  created_at: string;
}

export interface ProjectStep {
  id: string;
  project_id: string;
  position: number;
  title: string;
  description: string | null;
  status: StepStatus;
  completed_at: string | null;
  estimated_date: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  uploaded_by: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  created_at: string;
  uploader?: Profile;
}

export interface ProjectDeploy {
  id: string;
  project_id: string;
  deploy_id: string | null;
  deploy_url: string | null;
  commit_message: string | null;
  admin_summary: string | null;
  is_visible: boolean;
  deployed_at: string;
  created_at: string;
}

export interface ProjectWithClient extends Project {
  client: Profile;
  steps: ProjectStep[];
  unread_count?: number;
}

// ── SEO types ──────────────────────────────────────────────────────────────

export type SeoTaskStatus = 'done' | 'wip' | 'next' | 'planned';

export interface SeoProject {
  id: string;
  client_id: string;
  domain: string;
  package_name: string | null;
  package_price: number | null;
  renewal_date: string | null;
  // Google Search Console
  gsc_property_id: string | null;
  gsc_auto_update: boolean;
  created_at: string;
}

export interface SeoMetrics {
  id: string;
  seo_project_id: string;
  month: string; // ISO date, first day of month: YYYY-MM-01
  organic_visits: number;
  clicks: number;       // from GSC
  impressions: number;  // from GSC
  avg_position: number | null;
  new_backlinks: number;
  total_backlinks: number;
  is_gsc_synced: boolean;
  created_at: string;
}

export interface SeoKeyword {
  id: string;
  seo_project_id: string;
  keyword: string;
  current_position: number | null;
  previous_position: number | null;
  created_at: string;
}

export interface SeoTask {
  id: string;
  seo_project_id: string;
  title: string;
  subtitle: string | null;
  status: SeoTaskStatus;
  position: number;
  created_at: string;
}

export interface SeoProgress {
  id: string;
  seo_project_id: string;
  category: string;
  percentage: number;
  color: string; // 'cyan' | 'green' | 'amber' | 'purple' | 'red'
  position: number;
}

export interface SeoAlert {
  id: string;
  seo_project_id: string;
  message: string;
  created_at: string;
}

export interface SeoProjectWithClient extends SeoProject {
  client: Profile;
  latest_metrics?: SeoMetrics | null;
}

// ── Database ────────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Project>;
      };
      project_steps: {
        Row: ProjectStep;
        Insert: Omit<ProjectStep, 'id' | 'created_at'> & { id?: string };
        Update: Partial<ProjectStep>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'is_read'> & { id?: string };
        Update: Partial<Message>;
      };
      project_files: {
        Row: ProjectFile;
        Insert: Omit<ProjectFile, 'id' | 'created_at'> & { id?: string };
        Update: Partial<ProjectFile>;
      };
      project_deploys: {
        Row: ProjectDeploy;
        Insert: Omit<ProjectDeploy, 'id' | 'created_at'> & { id?: string };
        Update: Partial<ProjectDeploy>;
      };
      seo_projects: {
        Row: SeoProject;
        Insert: Omit<SeoProject, 'id' | 'created_at'> & { id?: string };
        Update: Partial<SeoProject>;
      };
      seo_metrics: {
        Row: SeoMetrics;
        Insert: Omit<SeoMetrics, 'id' | 'created_at'> & { id?: string };
        Update: Partial<SeoMetrics>;
      };
      seo_keywords: {
        Row: SeoKeyword;
        Insert: Omit<SeoKeyword, 'id' | 'created_at'> & { id?: string };
        Update: Partial<SeoKeyword>;
      };
      seo_tasks: {
        Row: SeoTask;
        Insert: Omit<SeoTask, 'id' | 'created_at'> & { id?: string };
        Update: Partial<SeoTask>;
      };
      seo_progress: {
        Row: SeoProgress;
        Insert: Omit<SeoProgress, 'id'> & { id?: string };
        Update: Partial<SeoProgress>;
      };
      seo_alerts: {
        Row: SeoAlert;
        Insert: Omit<SeoAlert, 'id' | 'created_at'> & { id?: string };
        Update: Partial<SeoAlert>;
      };
    };
  };
}
