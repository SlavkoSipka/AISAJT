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
    };
  };
}
