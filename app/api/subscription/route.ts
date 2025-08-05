import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb-client';
import Stripe from 'stripe';
import { ObjectId, Db } from 'mongodb';
import { User, SubscriptionTier, Subscription } from '@/types/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Tier',
    description: 'Perfect for getting started',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Basic battles (1v1)',
      'Public tournaments',
      'Standard challenges',
      '5 AI insights per day',
      'Community support'
    ],
    limits: {
      battleParticipants: 2,
      tournamentEntries: 3,
      aiInsightsPerDay: 5,
      customChallenges: 0,
      prioritySupport: false
    },
    stripeProductId: '',
    stripePriceIds: { monthly: '', yearly: '' }
  },
  {
    id: 'pro',
    name: 'Pro Coder',
    description: 'For serious competitive programmers',
    price: { monthly: 9.99, yearly: 99.99 },
    features: [
      'Multi-player battles (up to 8 players)',
      'Unlimited tournaments',
      'Advanced challenges',
      '50 AI insights per day',
      'Custom challenge creation',
      'Battle analytics',
      'Priority matchmaking',
      'Email support'
    ],
    limits: {
      battleParticipants: 8,
      tournamentEntries: 999,
      aiInsightsPerDay: 50,
      customChallenges: 10,
      prioritySupport: false
    },
    stripeProductId: process.env.STRIPE_PRO_PRODUCT_ID!,
    stripePriceIds: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!
    }
  },
  {
    id: 'elite',
    name: 'Elite Master',
    description: 'Maximum competitive advantage',
    price: { monthly: 19.99, yearly: 199.99 },
    features: [
      'Massive battles (up to 50 players)',
      'Private tournaments',
      'Expert-level challenges',
      'Unlimited AI insights',
      'Unlimited custom challenges',
      'Advanced analytics dashboard',
      'Real-time coaching',
      'Priority support',
      'Exclusive events',
      'Early feature access'
    ],
    limits: {
      battleParticipants: 50,
      tournamentEntries: 999,
      aiInsightsPerDay: 999,
      customChallenges: 999,
      prioritySupport: true
    },
    stripeProductId: process.env.STRIPE_ELITE_PRODUCT_ID!,
    stripePriceIds: {
      monthly: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID!,
      yearly: process.env.STRIPE_ELITE_YEARLY_PRICE_ID!
    }
  }
];

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('coderspae');

    // Get user's current subscription
    const user = await db.collection<User>('users').findOne({ email: session.user.email });
    const subscription = await db.collection<Subscription>('subscriptions').findOne({ userId: user?._id });

    return NextResponse.json({
      success: true,
      tiers: subscriptionTiers,
      currentSubscription: subscription || { tier: 'free', status: 'active' },
      features: getSubscriptionFeatures(subscription?.tier || 'free')
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, tierId, billingCycle, couponCode } = await request.json();
    const client = await clientPromise;
    const db = client.db('coderspae');

    const user = await db.collection<User>('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'create_checkout_session':
        return await createCheckoutSession(user, tierId, billingCycle, couponCode);
      
      case 'create_portal_session':
        return await createPortalSession(user);
      
      case 'upgrade_subscription':
        return await upgradeSubscription(db, user._id, tierId);
      
      case 'cancel_subscription':
        return await cancelSubscription(db, user._id);
      
      case 'apply_coupon':
        return await applyCoupon(db, user._id, couponCode);
      
      case 'check_limits':
        return await checkSubscriptionLimits(db, user._id);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Subscription action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createCheckoutSession(user: User, tierId: string, billingCycle: 'monthly' | 'yearly', couponCode?: string) {
  const tier = subscriptionTiers.find(t => t.id === tierId);
  
  if (!tier || tier.id === 'free') {
    return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
  }

  const priceId = tier.stripePriceIds[billingCycle];
  
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer_email: user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/subscription/cancelled`,
    metadata: {
      userId: user._id.toString(),
      tierId,
      billingCycle
    },
  };

  // Apply coupon if provided
  if (couponCode) {
    try {
      const coupons = await stripe.coupons.list({ limit: 100 });
      const validCoupon = coupons.data.find(c => c.name === couponCode && c.valid);
      
      if (validCoupon) {
        sessionParams.discounts = [{ coupon: validCoupon.id }];
      }
    } catch (error) {
      console.error('Coupon error:', error);
    }
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({
    success: true,
    sessionId: session.id,
    url: session.url
  });
}

async function createPortalSession(user: User) {
  // Find the customer in Stripe
  const customers = await stripe.customers.list({
    email: user.email,
    limit: 1
  });

  if (customers.data.length === 0) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customers.data[0].id,
    return_url: `${process.env.NEXTAUTH_URL}/subscription`,
  });

  return NextResponse.json({
    success: true,
    url: session.url
  });
}

async function upgradeSubscription(db: Db, userId: ObjectId, newTierId: string) {
  const currentSubscription = await db.collection<Subscription>('subscriptions').findOne({ userId });
  
  if (!currentSubscription) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
  }

  const newTier = subscriptionTiers.find(t => t.id === newTierId);
  if (!newTier) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  // Update subscription in database
  await db.collection('subscriptions').updateOne(
    { userId },
    {
      $set: {
        tier: newTierId,
        updatedAt: new Date(),
        upgradeAt: new Date()
      }
    }
  );

  // Log activity
  await db.collection('user_activities').insertOne({
    userId,
    type: 'subscription_upgrade',
    title: `Upgraded to ${newTier.name}`,
    description: `Subscription upgraded from ${currentSubscription.tier} to ${newTierId}`,
    timestamp: new Date()
  });

  return NextResponse.json({
    success: true,
    message: `Successfully upgraded to ${newTier.name}`
  });
}

async function cancelSubscription(db: Db, userId: ObjectId) {
  const subscription = await db.collection<Subscription>('subscriptions').findOne({ userId });
  
  if (!subscription) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
  }

  // Mark subscription as cancelled (but keep active until period ends)
  await db.collection('subscriptions').updateOne(
    { userId },
    {
      $set: {
        status: 'cancelled',
        cancelledAt: new Date(),
        willCancelAt: subscription.currentPeriodEnd || new Date()
      }
    }
  );

  return NextResponse.json({
    success: true,
    message: 'Subscription will be cancelled at the end of the current billing period'
  });
}

async function applyCoupon(db: Db, userId: ObjectId, couponCode: string) {
  // Validate coupon
  const coupon = await db.collection('coupons').findOne({ 
    code: couponCode,
    active: true,
    expiresAt: { $gt: new Date() }
  });

  if (!coupon) {
    return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });
  }

  // Check if user already used this coupon
  const usage = await db.collection('coupon_usage').findOne({ 
    userId, 
    couponId: coupon._id 
  });

  if (usage) {
    return NextResponse.json({ error: 'Coupon already used' }, { status: 400 });
  }

  // Apply coupon benefits
  const benefits = {
    discountPercent: coupon.discountPercent || 0,
    discountAmount: coupon.discountAmount || 0,
    freeTrialDays: coupon.freeTrialDays || 0,
    bonusFeatures: coupon.bonusFeatures || []
  };

  // Record coupon usage
  await db.collection('coupon_usage').insertOne({
    userId,
    couponId: coupon._id,
    couponCode,
    appliedAt: new Date(),
    benefits
  });

  return NextResponse.json({
    success: true,
    benefits,
    message: 'Coupon applied successfully!'
  });
}

async function checkSubscriptionLimits(db: Db, userId: ObjectId) {
  const subscription = await db.collection<Subscription>('subscriptions').findOne({ userId });
  const tier = subscription?.tier || 'free';
  const limits = getSubscriptionLimits(tier);

  // Get current usage
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await db.collection('usage_tracking').findOne({
    userId,
    date: today
  });

  const currentUsage = {
    aiInsights: usage?.aiInsights || 0,
    customChallenges: usage?.customChallenges || 0,
    battleParticipants: usage?.battleParticipants || 0,
    tournamentEntries: usage?.tournamentEntries || 0
  };

  return NextResponse.json({
    success: true,
    limits,
    usage: currentUsage,
    canUse: {
      aiInsights: currentUsage.aiInsights < (limits.aiInsightsPerDay || 999),
      customChallenges: currentUsage.customChallenges < (limits.customChallenges || 999),
      battleParticipants: currentUsage.battleParticipants < (limits.battleParticipants || 999),
      tournamentEntries: currentUsage.tournamentEntries < (limits.tournamentEntries || 999)
    }
  });
}

// Webhook handler for Stripe events
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;
    
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('coderspae');

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(db, event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(db, event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(db, event.data.object as Stripe.Subscription);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(db: Db, session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  if (!metadata) return;
  
  const { userId, tierId, billingCycle } = metadata;
  
  // Create or update subscription
  await db.collection('subscriptions').updateOne(
    { userId: new ObjectId(userId) },
    {
      $set: {
        tier: tierId,
        status: 'active',
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        billingCycle,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );

  // Award subscription benefits
  await awardSubscriptionBenefits(db, userId, tierId);
}

async function handlePaymentSucceeded(db: Db, invoice: Stripe.Invoice) {
  // Log successful payment
  await db.collection('payment_history').insertOne({
    stripeInvoiceId: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    paidAt: new Date(),
    customerId: invoice.customer
  });
}

async function handleSubscriptionCancelled(db: Db, subscription: Stripe.Subscription) {
  // Update subscription status
  await db.collection('subscriptions').updateOne(
    { stripeSubscriptionId: subscription.id },
    {
      $set: {
        status: 'cancelled',
        cancelledAt: new Date(),
        tier: 'free'
      }
    }
  );
}

async function awardSubscriptionBenefits(db: Db, userId: string, tierId: string) {
  const tier = subscriptionTiers.find(t => t.id === tierId);
  if (!tier) return;

  // Award bonus XP for subscribing
  const bonusXP = tierId === 'pro' ? 1000 : tierId === 'elite' ? 2500 : 0;
  
  if (bonusXP > 0) {
    await db.collection('user_stats').updateOne(
      { userId: new ObjectId(userId) },
      { $inc: { xp: bonusXP } },
      { upsert: true }
    );
  }

  // Grant subscription-exclusive titles
  const exclusiveTitle = tierId === 'pro' ? 'Pro Coder' : tierId === 'elite' ? 'Elite Master' : null;
  
  if (exclusiveTitle) {
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { availableTitles: exclusiveTitle } }
    );
  }
}

function getSubscriptionFeatures(tierId: string) {
  const tier = subscriptionTiers.find(t => t.id === tierId);
  return tier?.features || subscriptionTiers[0].features;
}

function getSubscriptionLimits(tierId: string) {
  const tier = subscriptionTiers.find(t => t.id === tierId);
  return tier?.limits || subscriptionTiers[0].limits;
}
