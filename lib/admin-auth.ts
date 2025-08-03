import bcrypt from 'bcryptjs';

export interface AdminUser {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: 'super-admin' | 'admin' | 'support-admin';
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
}

// Default admin users (in production, these should be stored in a secure database)
const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'admin-001',
    email: 'chandan@coderspae.com',
    password: '$2b$12$HWNX7WF4XLCZEH7SWELVu.aURtWi0aDfg9JTzIZQ1ElpHc/uUr4Uu', // C@me311001
    name: 'Chandan Sharma',
    role: 'super-admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    permissions: [
      'user-management',
      'tournament-management',
      'challenge-management',
      'battle-mode-management',
      'team-management',
      'announcement-management',
      'advertisement-management',
      'system-settings',
      'admin-management'
    ]
  }
];

// Simulate a database for admin users
const adminUsers: AdminUser[] = [...DEFAULT_ADMINS];

export async function validateAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  const admin = adminUsers.find(user => user.email === email && user.status === 'active');
  
  if (!admin) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  
  if (isValidPassword) {
    // Update last login
    admin.lastLogin = new Date().toISOString();
    return admin;
  }
  
  return null;
}

export function getAdminById(id: string): AdminUser | null {
  return adminUsers.find(admin => admin.id === id) || null;
}

export function getAdminByEmail(email: string): AdminUser | null {
  return adminUsers.find(admin => admin.email === email) || null;
}

export async function createAdmin(adminData: Omit<AdminUser, 'id' | 'createdAt' | 'password'> & { password: string }): Promise<AdminUser> {
  const hashedPassword = await bcrypt.hash(adminData.password, 12);
  
  const newAdmin: AdminUser = {
    ...adminData,
    id: `admin-${Date.now()}`,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  adminUsers.push(newAdmin);
  return newAdmin;
}

export function updateAdmin(id: string, updates: Partial<AdminUser>): AdminUser | null {
  const adminIndex = adminUsers.findIndex(admin => admin.id === id);
  
  if (adminIndex === -1) {
    return null;
  }
  
  adminUsers[adminIndex] = { ...adminUsers[adminIndex], ...updates };
  return adminUsers[adminIndex];
}

export function deleteAdmin(id: string): boolean {
  const adminIndex = adminUsers.findIndex(admin => admin.id === id);
  
  if (adminIndex === -1 || adminUsers[adminIndex].role === 'super-admin') {
    return false; // Cannot delete super-admin
  }
  
  adminUsers.splice(adminIndex, 1);
  return true;
}

export function getAllAdmins(): AdminUser[] {
  return adminUsers.map(admin => ({
    ...admin,
    password: '[HIDDEN]' // Never expose passwords
  })) as AdminUser[];
}

export function hasPermission(admin: AdminUser, permission: string): boolean {
  return admin.permissions.includes(permission) || admin.role === 'super-admin';
}

// Helper function to hash password for initial setup
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Initialize default admin password hash (for reference)
export async function initializeDefaultAdminPassword() {
  const defaultPassword = 'C@me311001';
  const hashedPassword = await hashPassword(defaultPassword);
  console.log('Default admin password hash:', hashedPassword);
  return hashedPassword;
}
