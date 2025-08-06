import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

const subscriptionTiers = [
  {
    id: 'free',
    name: 'Free Tier',
    description: 'Perfect for getting started',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Basic battles (1v1)',
      'Public tournaments',
      'Community challenges',
      '5 practice sessions/day'
    ],
    limits: {
      dailyBattles: 5,
      tournamentEntry: true,
      premiumFeatures: false
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious coders',
    price: { monthly: 9.99, yearly: 99.99 },
    features: [
      'Unlimited battles',
      'Private tournaments',
      'Advanced analytics',
      'Priority support',
      'Custom challenges'
    ],
    limits: {
      dailyBattles: -1,
      tournamentEntry: true,
      premiumFeatures: true
    }
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For organizations',
    price: { monthly: 29.99, yearly: 299.99 },
    features: [
      'Everything in Pro',
      'Team management',
      'White-label tournaments',
      'API access',
      'Dedicated support'
    ],
    limits: {
      dailyBattles: -1,
      tournamentEntry: true,
      premiumFeatures: true,
      teamFeatures: true
    }
  }
];

const getSubscriptionFeatures = (tier: string) => {
  const subscription = subscriptionTiers.find(t => t.id === tier);
  return subscription?.features || subscriptionTiers[0].features;
};

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock user subscription data for build compatibility
    const mockSubscription = { 
      tier: 'free', 
      status: 'active',
      userId: 'mock-user-id',
      startDate: new Date(),
      features: getSubscriptionFeatures('free')
    };

    return NextResponse.json({
      success: true,
      tiers: subscriptionTiers,
      currentSubscription: mockSubscription,
      features: getSubscriptionFeatures('free')
    });
  } catch (error) {
    console.error('Subscription GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    // Mock responses for subscription actions
    switch (action) {
      case 'create_checkout_session':
        return NextResponse.json({
          success: true,
          sessionUrl: 'https://checkout.stripe.com/mock-session'
        });
      
      case 'create_portal_session':
        return NextResponse.json({
          success: true,
          portalUrl: 'https://billing.stripe.com/mock-portal'
        });
      
      case 'upgrade_subscription':
        return NextResponse.json({
          success: true,
          message: 'Subscription upgraded successfully'
        });
      
      case 'cancel_subscription':
        return NextResponse.json({
          success: true,
          message: 'Subscription cancelled successfully'
        });
      
      case 'apply_coupon':
        return NextResponse.json({
          success: true,
          message: 'Coupon applied successfully'
        });
      
      case 'check_limits':
        return NextResponse.json({
          success: true,
          limits: { battles: 10, tournaments: 2, premium_features: false }
        });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Subscription POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
