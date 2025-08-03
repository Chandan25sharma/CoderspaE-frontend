import { NextRequest, NextResponse } from 'next/server';
import { createAdmin, getAllAdmins, updateAdmin, deleteAdmin, getAdminById } from '@/lib/admin-auth';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

// GET - Get all admins
export async function GET(request: NextRequest) {
  try {
    const adminPayload = await verifyAdminToken(request);
    
    if (!adminPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admins = getAllAdmins();
    return NextResponse.json({ admins });
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new admin
export async function POST(request: NextRequest) {
  try {
    const adminPayload = await verifyAdminToken(request);
    
    if (!adminPayload || adminPayload.role !== 'super-admin') {
      return NextResponse.json({ error: 'Unauthorized - Super admin access required' }, { status: 403 });
    }

    const { email, password, name, role, permissions } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAdmin = await createAdmin({
      email,
      password,
      name,
      role: role as 'admin' | 'support-admin',
      status: 'active',
      permissions: permissions || []
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        status: newAdmin.status,
        permissions: newAdmin.permissions,
        createdAt: newAdmin.createdAt
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update admin
export async function PUT(request: NextRequest) {
  try {
    const adminPayload = await verifyAdminToken(request);
    
    if (!adminPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    // Only super-admin can update others, or admin can update themselves (limited)
    if (adminPayload.role !== 'super-admin' && adminPayload.adminId !== id) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const updatedAdmin = updateAdmin(id, updates);

    if (!updatedAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        name: updatedAdmin.name,
        role: updatedAdmin.role,
        status: updatedAdmin.status,
        permissions: updatedAdmin.permissions
      }
    });
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete admin
export async function DELETE(request: NextRequest) {
  try {
    const adminPayload = await verifyAdminToken(request);
    
    if (!adminPayload || adminPayload.role !== 'super-admin') {
      return NextResponse.json({ error: 'Unauthorized - Super admin access required' }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    const success = deleteAdmin(id);

    if (!success) {
      return NextResponse.json({ error: 'Admin not found or cannot delete super-admin' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
