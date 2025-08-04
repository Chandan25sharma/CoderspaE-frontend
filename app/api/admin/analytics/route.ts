import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Session from '@/models/Session';
import CodeExecution from '@/models/CodeExecution';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'overview';

    switch (type) {
      case 'overview':
        // Get dashboard overview data
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ 
          lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        });
        const totalSessions = await Session.countDocuments();
        const activeSessions = await Session.countDocuments({ isActive: true });
        const totalExecutions = await CodeExecution.countDocuments();
        
        // Recent activity
        const recentUsers = await User.find()
          .sort({ joinedAt: -1 })
          .limit(10)
          .select('name email joinedAt lastActive loginCount')
          .lean();

        const recentSessions = await Session.find()
          .sort({ loginTime: -1 })
          .limit(20)
          .lean();

        const recentExecutions = await CodeExecution.find()
          .sort({ executedAt: -1 })
          .limit(20)
          .select('userEmail language status executedAt executionTime context')
          .lean();

        // Language usage stats
        const languageStats = await CodeExecution.aggregate([
          { $group: { _id: '$language', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);

        // User activity by day (last 7 days)
        const activityStats = await Session.aggregate([
          {
            $match: {
              loginTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$loginTime' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);

        return NextResponse.json({
          success: true,
          data: {
            stats: {
              totalUsers,
              activeUsers,
              totalSessions,
              activeSessions,
              totalExecutions,
            },
            recentUsers,
            recentSessions,
            recentExecutions,
            languageStats,
            activityStats,
          }
        });

      case 'users':
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search') || '';
        
        const query = search ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        } : {};

        const users = await User.find(query)
          .sort({ joinedAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        const totalUsersCount = await User.countDocuments(query);

        return NextResponse.json({
          success: true,
          data: {
            users,
            pagination: {
              page,
              limit,
              total: totalUsersCount,
              pages: Math.ceil(totalUsersCount / limit)
            }
          }
        });

      case 'sessions':
        const sessionsPage = parseInt(searchParams.get('page') || '1');
        const sessionsLimit = parseInt(searchParams.get('limit') || '50');
        
        const sessions = await Session.find()
          .sort({ loginTime: -1 })
          .skip((sessionsPage - 1) * sessionsLimit)
          .limit(sessionsLimit)
          .lean();

        const totalSessionsCount = await Session.countDocuments();

        return NextResponse.json({
          success: true,
          data: {
            sessions,
            pagination: {
              page: sessionsPage,
              limit: sessionsLimit,
              total: totalSessionsCount,
              pages: Math.ceil(totalSessionsCount / sessionsLimit)
            }
          }
        });

      case 'executions':
        const execPage = parseInt(searchParams.get('page') || '1');
        const execLimit = parseInt(searchParams.get('limit') || '50');
        const language = searchParams.get('language');
        const status = searchParams.get('status');
        
        const execQuery: any = {};
        if (language) execQuery.language = language;
        if (status) execQuery.status = status;

        const executions = await CodeExecution.find(execQuery)
          .sort({ executedAt: -1 })
          .skip((execPage - 1) * execLimit)
          .limit(execLimit)
          .select('-code') // Don't include code for privacy
          .lean();

        const totalExecutionsCount = await CodeExecution.countDocuments(execQuery);

        return NextResponse.json({
          success: true,
          data: {
            executions,
            pagination: {
              page: execPage,
              limit: execLimit,
              total: totalExecutionsCount,
              pages: Math.ceil(totalExecutionsCount / execLimit)
            }
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Admin analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin analytics' },
      { status: 500 }
    );
  }
}
