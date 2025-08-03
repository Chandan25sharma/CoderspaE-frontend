'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { Check, Crown, Building, Trophy } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  stripePriceId: string;
  icon: React.ReactNode;
  color: string;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with coding battles',
    features: [
      'Basic battles',
      'Profile & stats',
      'Leaderboard access',
      'Community support',
      'Standard challenges',
    ],
    stripePriceId: '',
    icon: <Check className="w-6 h-6" />,
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$5',
    period: 'month',
    description: 'Unlock advanced features and AI-powered challenges',
    features: [
      'All Free features',
      'AI-generated challenges',
      'Team mode battles',
      'Premium themes',
      'Priority queue',
      'Private stats',
      'Advanced analytics',
      'Monthly tournaments',
    ],
    popular: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
    icon: <Crown className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-700',
  },
  {
    id: 'company',
    name: 'Company',
    price: '$500',
    period: 'post',
    description: 'Access top developer profiles for recruitment',
    features: [
      'Job board access',
      'Top developer profiles',
      'Detailed candidate analytics',
      'Direct contact information',
      'Skill assessments',
      'Recruitment dashboard',
      'Priority support',
      'Custom branding',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_COMPANY_PRICE_ID!,
    icon: <Building className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'tournament',
    name: 'Tournament',
    price: '$5,000',
    period: 'event',
    description: 'Sponsor branded tournaments and competitions',
    features: [
      'Branded tournament page',
      'Live sponsor feed',
      'Custom challenges',
      'Prize pool management',
      'Real-time analytics',
      'Social media integration',
      'Press coverage',
      'Exclusive access',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_TOURNAMENT_PRICE_ID!,
    icon: <Trophy className="w-6 h-6" />,
    color: 'from-gold-500 to-gold-700',
  },
];

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isEarlyBird, setIsEarlyBird] = useState(false);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.id === 'free') return;
    
    setLoading(plan.id);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          planType: plan.id,
        }),
      });

      const { sessionId, url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const checkEarlyBird = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/early-bird/check`);
      const data = await response.json();
      setIsEarlyBird(data.eligible);
    } catch (error) {
      console.error('Error checking early bird:', error);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      checkEarlyBird();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Choose Your Plan
            </h2>
            {isEarlyBird && (
              <div className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg inline-block">
                🎉 Early Bird Special: First 100 users get 1 year Premium FREE!
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative rounded-lg border-2 p-6 ${
                  plan.popular 
                    ? 'border-purple-500 scale-105 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700'
                }
                ${plan.id === 'free' ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id || plan.id === 'free'}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                  ${plan.id === 'free'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                  }
                  ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {loading === plan.id ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </div>
                ) : plan.id === 'free' ? (
                  'Current Plan'
                ) : (
                  `Get ${plan.name}`
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            All plans include 30-day money-back guarantee • Cancel anytime • Secure payments by Stripe
          </p>
          
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              💰 Battle Registration: $10 per premium battle (Winner takes $18, $2 platform fee)
            </p>
            <p className="text-xs text-gray-500">
              🏆 August 2025: Free battles and registration for early adopters!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
