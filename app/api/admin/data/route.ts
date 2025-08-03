import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Practice } from '@/models/Practice';
import { Tournament } from '@/models/Tournament';
import { BattleMode } from '@/models/BattleMode';
import { Team } from '@/models/Team';
import { Announcement } from '@/models/Announcement';
import { Advertisement } from '@/models/Advertisement';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Simple auth check - in production, you should verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    await connectDB();

    switch (type) {
      case 'practices':
        if (id) {
          const practice = await Practice.findById(id).populate('createdBy', 'name email');
          return NextResponse.json(practice);
        } else {
          const practices = await Practice.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
          return NextResponse.json(practices);
        }

      case 'tournaments':
        if (id) {
          const tournament = await Tournament.findById(id)
            .populate('createdBy', 'name email')
            .populate('challenges')
            .populate('participants.user', 'name email')
            .populate('participants.team', 'name');
          return NextResponse.json(tournament);
        } else {
          const tournaments = await Tournament.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
          return NextResponse.json(tournaments);
        }

      case 'battle-modes':
        if (id) {
          const battleMode = await BattleMode.findById(id)
            .populate('createdBy', 'name email')
            .populate('challenges');
          return NextResponse.json(battleMode);
        } else {
          const battleModes = await BattleMode.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
          return NextResponse.json(battleModes);
        }

      case 'teams':
        if (id) {
          const team = await Team.findById(id)
            .populate('captain', 'name email')
            .populate('members.user', 'name email')
            .populate('invitations.user', 'name email')
            .populate('invitations.invitedBy', 'name email');
          return NextResponse.json(team);
        } else {
          const teams = await Team.find()
            .populate('captain', 'name email')
            .populate('members.user', 'name email')
            .sort({ createdAt: -1 });
          return NextResponse.json(teams);
        }

      case 'announcements':
        if (id) {
          const announcement = await Announcement.findById(id)
            .populate('createdBy', 'name email')
            .populate('targetUsers', 'name email')
            .populate('targetTeams', 'name');
          return NextResponse.json(announcement);
        } else {
          const announcements = await Announcement.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
          return NextResponse.json(announcements);
        }

      case 'advertisements':
        if (id) {
          const advertisement = await Advertisement.findById(id)
            .populate('createdBy', 'name email')
            .populate('approval.reviewedBy', 'name email');
          return NextResponse.json(advertisement);
        } else {
          const advertisements = await Advertisement.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
          return NextResponse.json(advertisements);
        }

      case 'users':
        if (id) {
          const user = await User.findById(id);
          return NextResponse.json(user);
        } else {
          const page = parseInt(searchParams.get('page') || '1');
          const limit = parseInt(searchParams.get('limit') || '20');
          const search = searchParams.get('search');
          const role = searchParams.get('role');
          
          const query: Record<string, unknown> = {};
          if (search) {
            query.$or = [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ];
          }
          if (role && role !== 'all') {
            query.role = role;
          }

          const skip = (page - 1) * limit;
          const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
          
          const total = await User.countDocuments(query);
          
          return NextResponse.json({
            users,
            pagination: {
              total,
              page,
              pages: Math.ceil(total / limit),
              limit
            }
          });
        }

      case 'dashboard':
        const [
          totalUsers,
          totalPractices,
          totalTournaments,
          totalTeams,
          totalAnnouncements,
          totalAdvertisements,
          activeUsers,
          activeTournaments
        ] = await Promise.all([
          User.countDocuments(),
          Practice.countDocuments(),
          Tournament.countDocuments(),
          Team.countDocuments(),
          Announcement.countDocuments(),
          Advertisement.countDocuments(),
          User.countDocuments({ lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
          Tournament.countDocuments({ status: 'In Progress' })
        ]);

        return NextResponse.json({
          stats: {
            totalUsers,
            totalPractices,
            totalTournaments,
            totalTeams,
            totalAnnouncements,
            totalAdvertisements,
            activeUsers,
            activeTournaments
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Simple auth check - in production, you should verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const body = await request.json();

    await connectDB();

    // Get or create an admin user for the createdBy field
    let adminUser = await User.findOne({ email: 'chandan@coderspae.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'chandan@coderspae.com',
        role: 'admin',
        battlesWon: 0,
        battlesLost: 0,
        totalBattles: 0,
        rating: 1000,
        preferredLanguage: 'javascript'
      });
      await adminUser.save();
    }

    body.createdBy = adminUser._id;

    switch (type) {
      case 'practices':
        const practice = new Practice(body);
        await practice.save();
        await practice.populate('createdBy', 'name email');
        return NextResponse.json(practice, { status: 201 });

      case 'tournaments':
        const tournament = new Tournament(body);
        await tournament.save();
        await tournament.populate('createdBy', 'name email');
        return NextResponse.json(tournament, { status: 201 });

      case 'battle-modes':
        const battleMode = new BattleMode(body);
        await battleMode.save();
        await battleMode.populate('createdBy', 'name email');
        return NextResponse.json(battleMode, { status: 201 });

      case 'teams':
        const team = new Team(body);
        await team.save();
        await team.populate('captain', 'name email');
        return NextResponse.json(team, { status: 201 });

      case 'announcements':
        const announcement = new Announcement(body);
        await announcement.save();
        await announcement.populate('createdBy', 'name email');
        return NextResponse.json(announcement, { status: 201 });

      case 'advertisements':
        const advertisement = new Advertisement(body);
        await advertisement.save();
        await advertisement.populate('createdBy', 'name email');
        return NextResponse.json(advertisement, { status: 201 });

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Simple auth check - in production, you should verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    await connectDB();

    // Get admin user for the lastModifiedBy field
    let adminUser = await User.findOne({ email: 'chandan@coderspae.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'chandan@coderspae.com',
        role: 'admin',
        battlesWon: 0,
        battlesLost: 0,
        totalBattles: 0,
        rating: 1000,
        preferredLanguage: 'javascript'
      });
      await adminUser.save();
    }

    body.lastModifiedBy = adminUser._id;
    body.updatedAt = new Date();

    switch (type) {
      case 'practices':
        const practice = await Practice.findByIdAndUpdate(id, body, { new: true })
          .populate('createdBy', 'name email');
        if (!practice) {
          return NextResponse.json({ error: 'Practice not found' }, { status: 404 });
        }
        return NextResponse.json(practice);

      case 'tournaments':
        const tournament = await Tournament.findByIdAndUpdate(id, body, { new: true })
          .populate('createdBy', 'name email');
        if (!tournament) {
          return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
        }
        return NextResponse.json(tournament);

      case 'battle-modes':
        const battleMode = await BattleMode.findByIdAndUpdate(id, body, { new: true })
          .populate('createdBy', 'name email');
        if (!battleMode) {
          return NextResponse.json({ error: 'Battle mode not found' }, { status: 404 });
        }
        return NextResponse.json(battleMode);

      case 'teams':
        const team = await Team.findByIdAndUpdate(id, body, { new: true })
          .populate('captain', 'name email');
        if (!team) {
          return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }
        return NextResponse.json(team);

      case 'announcements':
        const announcement = await Announcement.findByIdAndUpdate(id, body, { new: true })
          .populate('createdBy', 'name email');
        if (!announcement) {
          return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
        }
        return NextResponse.json(announcement);

      case 'advertisements':
        const advertisement = await Advertisement.findByIdAndUpdate(id, body, { new: true })
          .populate('createdBy', 'name email');
        if (!advertisement) {
          return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
        }
        return NextResponse.json(advertisement);

      case 'users':
        const user = await User.findByIdAndUpdate(id, body, { new: true }).select('-password');
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Simple auth check - in production, you should verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    await connectDB();

    switch (type) {
      case 'practices':
        const practice = await Practice.findByIdAndDelete(id);
        if (!practice) {
          return NextResponse.json({ error: 'Practice not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Practice deleted successfully' });

      case 'tournaments':
        const tournament = await Tournament.findByIdAndDelete(id);
        if (!tournament) {
          return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Tournament deleted successfully' });

      case 'battle-modes':
        const battleMode = await BattleMode.findByIdAndDelete(id);
        if (!battleMode) {
          return NextResponse.json({ error: 'Battle mode not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Battle mode deleted successfully' });

      case 'teams':
        const team = await Team.findByIdAndDelete(id);
        if (!team) {
          return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Team deleted successfully' });

      case 'announcements':
        const announcement = await Announcement.findByIdAndDelete(id);
        if (!announcement) {
          return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Announcement deleted successfully' });

      case 'advertisements':
        const advertisement = await Advertisement.findByIdAndDelete(id);
        if (!advertisement) {
          return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Advertisement deleted successfully' });

      case 'users':
        // For now, allow user deletion (in production, check user role from JWT)
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' });

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
