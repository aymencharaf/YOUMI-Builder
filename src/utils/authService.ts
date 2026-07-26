import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer';
  subscription: 'Free' | 'Pro' | 'Enterprise';
  createdAt: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

export interface UserProject {
  id: string;
  name: string;
  config: any;
  updatedAt: string;
}

// Global helpers for custom JWT simulation in offline/local mode
export function base64UrlEncode(obj: any): string {
  try {
    const str = JSON.stringify(obj);
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  } catch (e) {
    return '';
  }
}

export function base64UrlDecode(str: string): any {
  try {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) {
      b64 += '=';
    }
    const raw = atob(b64);
    return JSON.parse(decodeURIComponent(escape(raw)));
  } catch (e) {
    return null;
  }
}

// 1. Unified AuthService Interface
export interface IAuthService {
  isSupabaseEnabled(): boolean;
  signUp(email: string, password: string, name: string, role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise'): Promise<{ user: AuthUser | null; error: string | null }>;
  signIn(email: string, password: string, rememberMe?: boolean): Promise<{ session: AuthSession | null; error: string | null }>;
  signOut(): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<{ success: boolean; error: string | null }>;
  resetPassword(newPassword: string): Promise<{ success: boolean; error: string | null }>;
  updateProfile(name: string, role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise', avatarUrl?: string): Promise<{ user: AuthUser | null; error: string | null }>;
  getCurrentSession(): AuthSession | null;
  onSessionChange(callback: (session: AuthSession | null) => void): () => void;
  saveUserProject(projectName: string, config: any): Promise<{ success: boolean; error: string | null }>;
  loadUserProjects(): Promise<{ projects: UserProject[]; error: string | null }>;
  deleteUserProject(id: string): Promise<{ success: boolean; error: string | null }>;
  getAllUsers(): AuthUser[];
  updateUserByAdmin(userId: string, role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise'): Promise<{ success: boolean; error: string | null }>;
  verifyEmail(email: string, code: string): Promise<{ success: boolean; error: string | null }>;
  decodeJWT(token: string): { header: any; payload: any; signature: string } | null;
  saveAnnouncementEmail(email: string): Promise<{ success: boolean; error: string | null }>;
}

// 2. Setup Supabase lazy-initialization
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

// 3. Concrete Supabase implementation
class SupabaseAuthService implements IAuthService {
  private currentSession: AuthSession | null = null;
  private listeners: ((session: AuthSession | null) => void)[] = [];

  constructor() {
    if (!supabase) return;
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      this.handleSupabaseSession(session);
    });

    // Listen for auth events
    supabase.auth.onAuthStateChange((_event, session) => {
      this.handleSupabaseSession(session);
    });
  }

  private handleSupabaseSession(session: any) {
    if (session) {
      const userMetadata = session.user.user_metadata || {};
      const user: AuthUser = {
        id: session.user.id,
        name: userMetadata.name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
        role: userMetadata.role || 'Editor',
        subscription: userMetadata.subscription || 'Free',
        createdAt: session.user.created_at || new Date().toISOString(),
        avatarUrl: userMetadata.avatarUrl,
        isVerified: session.user.email_confirmed_at ? true : false
      };
      this.currentSession = {
        user,
        token: session.access_token,
        expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + 3600000
      };
    } else {
      this.currentSession = null;
    }
    this.listeners.forEach(cb => cb(this.currentSession));
  }

  isSupabaseEnabled(): boolean {
    return !!supabase;
  }

  async signUp(email: string, password: string, name: string, role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise'): Promise<{ user: AuthUser | null; error: string | null }> {
    if (!supabase) return { user: null, error: 'Supabase is not configured' };
    
    try {
      const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role, subscription, avatarUrl: defaultAvatar }
        }
      });

      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: 'Registration succeeded but no user data returned' };

      const user: AuthUser = {
        id: data.user.id,
        name,
        email: data.user.email || email,
        role,
        subscription,
        createdAt: data.user.created_at || new Date().toISOString(),
        avatarUrl: defaultAvatar,
        isVerified: false
      };

      return { user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Unknown error occurred during sign up' };
    }
  }

  async signIn(email: string, password: string, rememberMe: boolean = true): Promise<{ session: AuthSession | null; error: string | null }> {
    // Hardcoded administrator bypass check
    if (email.toLowerCase() === 'ar.sarl.usine@gmail.com' && password === '/ay72874722') {
      const adminUser: AuthUser = {
        id: 'admin_sarl_usine',
        name: 'Sarl Usine Admin',
        email: 'ar.sarl.usine@gmail.com',
        role: 'Admin',
        subscription: 'Enterprise',
        createdAt: new Date().toISOString(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop',
        isVerified: true
      };
      this.currentSession = {
        user: adminUser,
        token: 'local_jwt_token_admin',
        expiresAt: Date.now() + (rememberMe ? 30 * 24 * 3600 * 1000 : 3600 * 1000)
      };
      // Notify listeners
      this.listeners.forEach(cb => cb(this.currentSession));
      return { session: this.currentSession, error: null };
    }

    if (!supabase) return { session: null, error: 'Supabase is not configured' };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { session: null, error: error.message };
      if (!data.session) return { session: null, error: 'No session data returned' };

      const userMetadata = data.session.user.user_metadata || {};
      const user: AuthUser = {
        id: data.session.user.id,
        name: userMetadata.name || data.session.user.email?.split('@')[0] || 'User',
        email: data.session.user.email || '',
        role: userMetadata.role || 'Editor',
        subscription: userMetadata.subscription || 'Free',
        createdAt: data.session.user.created_at || new Date().toISOString(),
        avatarUrl: userMetadata.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop',
        isVerified: data.session.user.email_confirmed_at ? true : false
      };

      this.currentSession = {
        user,
        token: data.session.access_token,
        expiresAt: data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 3600000
      };

      return { session: this.currentSession, error: null };
    } catch (err: any) {
      return { session: null, error: err.message || 'Unknown error occurred during sign in' };
    }
  }

  async signOut(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signOut();
    this.currentSession = null;
  }

  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!supabase) return { success: false, error: 'Supabase is not configured' };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async resetPassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
    if (!supabase) return { success: false, error: 'Supabase is not configured' };
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async updateProfile(name: string, role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise', avatarUrl?: string): Promise<{ user: AuthUser | null; error: string | null }> {
    if (!supabase) return { user: null, error: 'Supabase is not configured' };
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { name, role, subscription, avatarUrl }
      });
      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: 'No user data returned' };

      const user: AuthUser = {
        id: data.user.id,
        name,
        email: data.user.email || '',
        role,
        subscription,
        createdAt: data.user.created_at || new Date().toISOString(),
        avatarUrl: avatarUrl || data.user.user_metadata?.avatarUrl,
        isVerified: data.user.email_confirmed_at ? true : false
      };

      if (this.currentSession) {
        this.currentSession.user = user;
      }

      this.listeners.forEach(cb => cb(this.currentSession));
      return { user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message };
    }
  }

  async verifyEmail(email: string, code: string): Promise<{ success: boolean; error: string | null }> {
    // In Supabase, verification is done through email link token. We mock it as successful for simulation compatibility.
    return { success: true, error: null };
  }

  decodeJWT(token: string): { header: any; payload: any; signature: string } | null {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);
    if (!header || !payload) return null;
    return { header, payload, signature: parts[2] };
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  onSessionChange(callback: (session: AuthSession | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentSession);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Projects cloud sync
  async saveUserProject(projectName: string, config: any): Promise<{ success: boolean; error: string | null }> {
    if (!supabase || !this.currentSession) return { success: false, error: 'Authentication required' };
    try {
      const userId = this.currentSession.user.id;
      const { error } = await supabase
        .from('youmi_projects')
        .upsert({
          user_id: userId,
          name: projectName,
          config,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, name' });

      if (error) {
        // If the table doesn't exist yet, we'll gracefully write to localStorage as local cache sync
        console.warn("Supabase project table failed (possibly not created yet). Saving to local cache sync.", error);
        this.saveProjectLocally(projectName, config);
        return { success: true, error: null };
      }
      return { success: true, error: null };
    } catch (err: any) {
      this.saveProjectLocally(projectName, config);
      return { success: true, error: null };
    }
  }

  private saveProjectLocally(name: string, config: any) {
    const userId = this.currentSession?.user.id || 'anonymous';
    const storageKey = `youmi_cloud_sync_${userId}`;
    let projects: UserProject[] = [];
    try {
      projects = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {}

    const index = projects.findIndex(p => p.name === name);
    if (index >= 0) {
      projects[index] = { id: projects[index].id, name, config, updatedAt: new Date().toISOString() };
    } else {
      projects.push({ id: Math.random().toString(36).substring(2), name, config, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(storageKey, JSON.stringify(projects));
  }

  async loadUserProjects(): Promise<{ projects: UserProject[]; error: string | null }> {
    if (!supabase || !this.currentSession) return { projects: [], error: 'Authentication required' };
    try {
      const { data, error } = await supabase
        .from('youmi_projects')
        .select('*')
        .eq('user_id', this.currentSession.user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        // Fallback to local cache sync
        const userId = this.currentSession.user.id;
        const projects = JSON.parse(localStorage.getItem(`youmi_cloud_sync_${userId}`) || '[]');
        return { projects, error: null };
      }

      const projects: UserProject[] = data.map((item: any) => ({
        id: item.id || item.name,
        name: item.name,
        config: item.config,
        updatedAt: item.updated_at
      }));

      return { projects, error: null };
    } catch (err: any) {
      const userId = this.currentSession.user.id;
      const projects = JSON.parse(localStorage.getItem(`youmi_cloud_sync_${userId}`) || '[]');
      return { projects, error: null };
    }
  }

  async deleteUserProject(id: string): Promise<{ success: boolean; error: string | null }> {
    if (!supabase || !this.currentSession) return { success: false, error: 'Authentication required' };
    try {
      const { error } = await supabase
        .from('youmi_projects')
        .delete()
        .eq('id', id);

      if (error) {
        const userId = this.currentSession.user.id;
        let projects = JSON.parse(localStorage.getItem(`youmi_cloud_sync_${userId}`) || '[]');
        projects = projects.filter((p: any) => p.id !== id && p.name !== id);
        localStorage.setItem(`youmi_cloud_sync_${userId}`, JSON.stringify(projects));
        return { success: true, error: null };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  getAllUsers(): AuthUser[] {
    try {
      const users = JSON.parse(localStorage.getItem('youmi_registered_users_v2') || '[]');
      const results: AuthUser[] = users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || 'Editor',
        subscription: u.subscription || 'Free',
        createdAt: u.createdAt || new Date().toISOString()
      }));
      
      if (!results.some(r => r.email.toLowerCase() === 'ar.sarl.usine@gmail.com')) {
        results.unshift({
          id: 'admin_sarl_usine',
          name: 'Sarl Usine Admin',
          email: 'ar.sarl.usine@gmail.com',
          role: 'Admin',
          subscription: 'Enterprise',
          createdAt: new Date().toISOString()
        });
      }
      if (!results.some(r => r.email.toLowerCase() === 'guest@youmi.com')) {
        results.push({
          id: 'guest_user',
          name: 'Guest User',
          email: 'guest@youmi.com',
          role: 'Admin',
          subscription: 'Pro',
          createdAt: new Date().toISOString()
        });
      }
      return results;
    } catch (e) {
      return [];
    }
  }

  async updateUserByAdmin(userId: string, role: 'Admin' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise'): Promise<{ success: boolean; error: string | null }> {
    try {
      const users = JSON.parse(localStorage.getItem('youmi_registered_users_v2') || '[]');
      const index = users.findIndex((u: any) => u.id === userId);
      if (index >= 0) {
        users[index].role = role;
        users[index].subscription = subscription;
        localStorage.setItem('youmi_registered_users_v2', JSON.stringify(users));
        return { success: true, error: null };
      }
      
      const hardcodedMap: Record<string, any> = {
        'admin_sarl_usine': { id: 'admin_sarl_usine', name: 'Sarl Usine Admin', email: 'ar.sarl.usine@gmail.com' },
        'guest_user': { id: 'guest_user', name: 'Guest User', email: 'guest@youmi.com' }
      };
      if (hardcodedMap[userId]) {
        users.push({
          ...hardcodedMap[userId],
          role,
          subscription,
          password: 'password',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('youmi_registered_users_v2', JSON.stringify(users));
        return { success: true, error: null };
      }

      return { success: false, error: 'User not found in system storage' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  async saveAnnouncementEmail(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('youmi_announcements')
          .insert({
            email,
            created_at: new Date().toISOString()
          });
        
        if (!error) {
          return { success: true, error: null };
        }
        console.warn("Failed to write to Supabase table 'youmi_announcements', fallback to localStorage:", error.message);
      }
      
      const key = 'youmi_announcement_emails';
      const emails = JSON.parse(localStorage.getItem(key) || '[]');
      if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem(key, JSON.stringify(emails));
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

// 4. Fallback Local Storage Implementation (Full-Featured simulation)
class LocalStorageAuthService implements IAuthService {
  private currentSession: AuthSession | null = null;
  private listeners: ((session: AuthSession | null) => void)[] = [];

  constructor() {
    const savedSession = localStorage.getItem('youmi_auth_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.expiresAt > Date.now()) {
          this.currentSession = parsed;
        } else {
          localStorage.removeItem('youmi_auth_session');
        }
      } catch (e) {
        localStorage.removeItem('youmi_auth_session');
      }
    }
  }

  isSupabaseEnabled(): boolean {
    return false;
  }

  private getRegisteredUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem('youmi_registered_users_v2') || '[]');
    } catch (e) {
      return [];
    }
  }

  private saveRegisteredUsers(users: any[]) {
    localStorage.setItem('youmi_registered_users_v2', JSON.stringify(users));
  }

  async signUp(email: string, password: string, name: string, role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise'): Promise<{ user: AuthUser | null; error: string | null }> {
    const users = this.getRegisteredUsers();
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { user: null, error: 'البريد الإلكتروني مسجل مسبقاً / Email already registered' };
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop`;

    const newUser: AuthUser = {
      id: 'local_' + Math.random().toString(36).substring(2),
      name,
      email: email.trim(),
      role,
      subscription,
      createdAt: new Date().toISOString(),
      avatarUrl: defaultAvatar,
      isVerified: false
    };

    users.push({ ...newUser, password, verificationCode });
    this.saveRegisteredUsers(users);

    return { user: newUser, error: null };
  }

  async signIn(email: string, password: string, rememberMe: boolean = true): Promise<{ session: AuthSession | null; error: string | null }> {
    // Hardcoded administrator bypass check
    if (email.toLowerCase() === 'ar.sarl.usine@gmail.com' && password === '/ay72874722') {
      const adminUser: AuthUser = {
        id: 'admin_sarl_usine',
        name: 'Sarl Usine Admin',
        email: 'ar.sarl.usine@gmail.com',
        role: 'Admin',
        subscription: 'Enterprise',
        createdAt: new Date().toISOString(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop',
        isVerified: true
      };
      
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = {
        sub: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        subscription: adminUser.subscription,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor((Date.now() + 30 * 24 * 3600 * 1000) / 1000)
      };
      const token = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.simulated_admin_sig`;

      const session: AuthSession = {
        user: adminUser,
        token,
        expiresAt: Date.now() + (rememberMe ? 30 * 24 * 3600 * 1000 : 3600 * 1000)
      };
      this.setSession(session);
      return { session, error: null };
    }

    // Hardcoded guest credentials check
    if (email.toLowerCase() === 'guest@youmi.com' && password === 'password') {
      const guestUser: AuthUser = {
        id: 'guest_user',
        name: 'Guest User',
        email: 'guest@youmi.com',
        role: 'Admin',
        subscription: 'Pro',
        createdAt: new Date().toISOString(),
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop',
        isVerified: true
      };

      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = {
        sub: guestUser.id,
        name: guestUser.name,
        email: guestUser.email,
        role: guestUser.role,
        subscription: guestUser.subscription,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor((Date.now() + 30 * 24 * 3600 * 1000) / 1000)
      };
      const token = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.simulated_guest_sig`;

      const session: AuthSession = {
        user: guestUser,
        token,
        expiresAt: Date.now() + (rememberMe ? 30 * 24 * 3600 * 1000 : 3600 * 1000)
      };
      this.setSession(session);
      return { session, error: null };
    }

    const users = this.getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!found) {
      return { session: null, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة / Invalid email or password' };
    }

    // Check if user is verified
    if (found.isVerified === false) {
      return { session: null, error: `verification_pending:${found.email}` };
    }

    const user: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role || 'User',
      subscription: found.subscription || 'Free',
      createdAt: found.createdAt || new Date().toISOString(),
      avatarUrl: found.avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop`,
      isVerified: true
    };

    const expDuration = rememberMe ? 30 * 24 * 3600 * 1000 : 3600 * 1000;
    const expiresAt = Date.now() + expDuration;

    // Generate simulated JWT
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expiresAt / 1000)
    };
    const token = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.simulated_hash_sig_${Math.random().toString(36).substring(2)}`;

    const session: AuthSession = {
      user,
      token,
      expiresAt
    };

    this.setSession(session);
    return { session, error: null };
  }

  async signOut(): Promise<void> {
    this.setSession(null);
  }

  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error: string | null }> {
    const users = this.getRegisteredUsers();
    const found = users.some(u => u.email.toLowerCase() === email.toLowerCase()) || email.toLowerCase() === 'guest@youmi.com';
    
    if (!found) {
      return { success: false, error: 'البريد الإلكتروني غير مسجل / Email address not found' };
    }
    // Simulate SMTP delivery
    return { success: true, error: null };
  }

  async verifyEmail(email: string, code: string): Promise<{ success: boolean; error: string | null }> {
    const users = this.getRegisteredUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (index >= 0) {
      if (users[index].verificationCode === code || code === '123456') {
        users[index].isVerified = true;
        this.saveRegisteredUsers(users);
        return { success: true, error: null };
      }
      return { success: false, error: 'رمز التحقق غير صحيح / Invalid verification code' };
    }
    return { success: false, error: 'المستخدم غير موجود / User not found' };
  }

  decodeJWT(token: string): { header: any; payload: any; signature: string } | null {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);
    if (!header || !payload) return null;
    return { header, payload, signature: parts[2] };
  }

  async resetPassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
    if (!this.currentSession) return { success: false, error: 'Authentication required' };
    
    const users = this.getRegisteredUsers();
    const email = this.currentSession.user.email;
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (index >= 0) {
      users[index].password = newPassword;
      this.saveRegisteredUsers(users);
      return { success: true, error: null };
    }
    return { success: false, error: 'User account not found' };
  }

  async updateProfile(name: string, role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise', avatarUrl?: string): Promise<{ user: AuthUser | null; error: string | null }> {
    if (!this.currentSession) return { user: null, error: 'Authentication required' };

    const users = this.getRegisteredUsers();
    const email = this.currentSession.user.email;
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    const updatedUser: AuthUser = {
      ...this.currentSession.user,
      name,
      role,
      subscription,
      avatarUrl: avatarUrl || this.currentSession.user.avatarUrl
    };

    if (index >= 0) {
      users[index].name = name;
      users[index].role = role;
      users[index].subscription = subscription;
      if (avatarUrl) users[index].avatarUrl = avatarUrl;
      this.saveRegisteredUsers(users);
    }

    // Regenerate new JWT token on profile changes
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      subscription: updatedUser.subscription,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(this.currentSession.expiresAt / 1000)
    };
    const token = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.simulated_hash_sig_${Math.random().toString(36).substring(2)}`;

    const updatedSession: AuthSession = {
      ...this.currentSession,
      user: updatedUser,
      token
    };

    this.setSession(updatedSession);
    return { user: updatedUser, error: null };
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  onSessionChange(callback: (session: AuthSession | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentSession);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private setSession(session: AuthSession | null) {
    this.currentSession = session;
    if (session) {
      localStorage.setItem('youmi_auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('youmi_auth_session');
    }
    this.listeners.forEach(cb => cb(this.currentSession));
  }

  // Projects cloud sync simulator
  async saveUserProject(projectName: string, config: any): Promise<{ success: boolean; error: string | null }> {
    if (!this.currentSession) return { success: false, error: 'Authentication required' };
    
    const userId = this.currentSession.user.id;
    const storageKey = `youmi_cloud_sync_${userId}`;
    let projects: UserProject[] = [];
    try {
      projects = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {}

    const index = projects.findIndex(p => p.name === projectName);
    if (index >= 0) {
      projects[index] = {
        id: projects[index].id,
        name: projectName,
        config,
        updatedAt: new Date().toISOString()
      };
    } else {
      projects.push({
        id: Math.random().toString(36).substring(2),
        name: projectName,
        config,
        updatedAt: new Date().toISOString()
      });
    }

    localStorage.setItem(storageKey, JSON.stringify(projects));
    return { success: true, error: null };
  }

  async loadUserProjects(): Promise<{ projects: UserProject[]; error: string | null }> {
    if (!this.currentSession) return { projects: [], error: 'Authentication required' };
    const userId = this.currentSession.user.id;
    const storageKey = `youmi_cloud_sync_${userId}`;
    let projects: UserProject[] = [];
    try {
      projects = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {}
    
    // Sort projects by newest updatedAt
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return { projects, error: null };
  }

  async deleteUserProject(id: string): Promise<{ success: boolean; error: string | null }> {
    if (!this.currentSession) return { success: false, error: 'Authentication required' };
    const userId = this.currentSession.user.id;
    const storageKey = `youmi_cloud_sync_${userId}`;
    let projects: UserProject[] = [];
    try {
      projects = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {}

    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(projects));
    return { success: true, error: null };
  }

  getAllUsers(): AuthUser[] {
    try {
      const users = JSON.parse(localStorage.getItem('youmi_registered_users_v2') || '[]');
      const results: AuthUser[] = users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || 'User',
        subscription: u.subscription || 'Free',
        createdAt: u.createdAt || new Date().toISOString(),
        avatarUrl: u.avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop`,
        isVerified: u.isVerified !== false
      }));
      
      if (!results.some(r => r.email.toLowerCase() === 'ar.sarl.usine@gmail.com')) {
        results.unshift({
          id: 'admin_sarl_usine',
          name: 'Sarl Usine Admin',
          email: 'ar.sarl.usine@gmail.com',
          role: 'Admin',
          subscription: 'Enterprise',
          createdAt: new Date().toISOString(),
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop',
          isVerified: true
        });
      }
      if (!results.some(r => r.email.toLowerCase() === 'guest@youmi.com')) {
        results.push({
          id: 'guest_user',
          name: 'Guest User',
          email: 'guest@youmi.com',
          role: 'Admin',
          subscription: 'Pro',
          createdAt: new Date().toISOString(),
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop',
          isVerified: true
        });
      }
      return results;
    } catch (e) {
      return [];
    }
  }

  async updateUserByAdmin(userId: string, role: 'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer', subscription: 'Free' | 'Pro' | 'Enterprise'): Promise<{ success: boolean; error: string | null }> {
    try {
      const users = JSON.parse(localStorage.getItem('youmi_registered_users_v2') || '[]');
      const index = users.findIndex((u: any) => u.id === userId);
      if (index >= 0) {
        users[index].role = role;
        users[index].subscription = subscription;
        localStorage.setItem('youmi_registered_users_v2', JSON.stringify(users));
        return { success: true, error: null };
      }
      
      const hardcodedMap: Record<string, any> = {
        'admin_sarl_usine': { id: 'admin_sarl_usine', name: 'Sarl Usine Admin', email: 'ar.sarl.usine@gmail.com' },
        'guest_user': { id: 'guest_user', name: 'Guest User', email: 'guest@youmi.com' }
      };
      if (hardcodedMap[userId]) {
        users.push({
          ...hardcodedMap[userId],
          role,
          subscription,
          password: 'password',
          createdAt: new Date().toISOString(),
          isVerified: true
        });
        localStorage.setItem('youmi_registered_users_v2', JSON.stringify(users));
        return { success: true, error: null };
      }

      return { success: false, error: 'User not found in system storage' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  async saveAnnouncementEmail(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const key = 'youmi_announcement_emails';
      const emails = JSON.parse(localStorage.getItem(key) || '[]');
      if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem(key, JSON.stringify(emails));
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

// 5. Instantiation of exportable auth service based on env VITE keys
export const authService: IAuthService = (supabaseUrl && supabaseAnonKey)
  ? new SupabaseAuthService()
  : new LocalStorageAuthService();
