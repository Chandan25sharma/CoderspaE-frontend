'use client';

import React, { useState } from 'react';
import { ArrowLeft, Cookie, Settings, Shield, Eye, Info } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '../../components/MainLayout';

export default function CookiePolicyPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Cannot be disabled
    analytics: true,
    marketing: false,
    personalization: true,
    social: false
  });

  const handlePreferenceChange = (category: string, enabled: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const savePreferences = () => {
    // Save preferences to localStorage and backend
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    // TODO: Send to backend API
    alert('Cookie preferences saved successfully!');
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <Cookie className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
                <p className="text-gray-600 mt-1">Last updated: August 5, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Cookie Preference Center */}
        <div className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Cookie Preference Center
          </h2>
          <p className="text-blue-800 mb-6">
            Customize your cookie preferences below. You can change these settings at any time.
          </p>
          
          <div className="space-y-4">
            {[
              {
                id: 'essential',
                name: 'Essential Cookies',
                description: 'Required for basic website functionality, security, and user authentication.',
                enabled: cookiePreferences.essential,
                disabled: true,
                icon: Shield
              },
              {
                id: 'analytics',
                name: 'Analytics Cookies',
                description: 'Help us understand how users interact with our platform to improve performance.',
                enabled: cookiePreferences.analytics,
                disabled: false,
                icon: Eye
              },
              {
                id: 'marketing',
                name: 'Marketing Cookies',
                description: 'Used to track visitors across websites for advertising and promotional purposes.',
                enabled: cookiePreferences.marketing,
                disabled: false,
                icon: Info
              },
              {
                id: 'personalization',
                name: 'Personalization Cookies',
                description: 'Remember your preferences and provide customized content and features.',
                enabled: cookiePreferences.personalization,
                disabled: false,
                icon: Settings
              },
              {
                id: 'social',
                name: 'Social Media Cookies',
                description: 'Enable social media sharing and integration with social platforms.',
                enabled: cookiePreferences.social,
                disabled: false,
                icon: Info
              }
            ].map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-3 flex-1">
                    <IconComponent className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handlePreferenceChange(category.id, !category.enabled)}
                      disabled={category.disabled}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        category.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      } ${category.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    {category.disabled && (
                      <span className="ml-2 text-xs text-gray-500">Required</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={savePreferences}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Preferences
            </button>
            <button
              onClick={() => setCookiePreferences({
                essential: true,
                analytics: false,
                marketing: false,
                personalization: false,
                social: false
              })}
              className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Essential Only
            </button>
            <button
              onClick={() => setCookiePreferences({
                essential: true,
                analytics: true,
                marketing: true,
                personalization: true,
                social: true
              })}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Accept All
            </button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Cookie className="w-6 h-6 mr-2 text-blue-600" />
              What Are Cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better, faster, and more secure experience on CoderspaE. Cookies contain information about your preferences and allow us to remember your settings and improve our services.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use both first-party cookies (set by CoderspaE) and third-party cookies (set by external services) to enhance your experience, analyze platform usage, and provide personalized content. This Cookie Policy explains what cookies we use, why we use them, and how you can control them.
            </p>
          </div>

          {/* Types of Cookies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Essential Cookies (Required)
                </h3>
                <p className="text-gray-700 mb-4">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Authentication and session management</li>
                  <li>Security features and fraud prevention</li>
                  <li>Load balancing and performance optimization</li>
                  <li>Essential website functionality</li>
                </ul>
                <div className="mt-4 bg-green-50 p-3 rounded">
                  <p className="text-green-800 text-sm">
                    <strong>Duration:</strong> Session cookies (deleted when browser closes) or up to 1 year for persistent cookies
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Analytics Cookies (Optional)
                </h3>
                <p className="text-gray-700 mb-4">
                  Help us understand how users interact with our platform to improve performance and user experience.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Google Analytics for website usage statistics</li>
                  <li>Performance monitoring and error tracking</li>
                  <li>User behavior analysis and heat mapping</li>
                  <li>Feature usage metrics and A/B testing</li>
                </ul>
                <div className="mt-4 bg-blue-50 p-3 rounded">
                  <p className="text-blue-800 text-sm">
                    <strong>Duration:</strong> Up to 2 years | <strong>Third parties:</strong> Google Analytics, Mixpanel
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-600" />
                  Personalization Cookies (Optional)
                </h3>
                <p className="text-gray-700 mb-4">
                  Remember your preferences and provide customized content and features.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Language and theme preferences</li>
                  <li>Customized dashboard layouts</li>
                  <li>Coding environment settings</li>
                  <li>Notification preferences</li>
                </ul>
                <div className="mt-4 bg-purple-50 p-3 rounded">
                  <p className="text-purple-800 text-sm">
                    <strong>Duration:</strong> Up to 1 year | <strong>Purpose:</strong> Enhanced user experience
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-orange-600" />
                  Marketing Cookies (Optional)
                </h3>
                <p className="text-gray-700 mb-4">
                  Used to track visitors across websites for advertising and promotional purposes.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Targeted advertising and retargeting</li>
                  <li>Social media advertising pixels</li>
                  <li>Email marketing optimization</li>
                  <li>Campaign performance tracking</li>
                </ul>
                <div className="mt-4 bg-orange-50 p-3 rounded">
                  <p className="text-orange-800 text-sm">
                    <strong>Duration:</strong> Up to 1 year | <strong>Third parties:</strong> Facebook, Google Ads, LinkedIn
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform Controls</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Use the Cookie Preference Center above to customize your settings</li>
              <li>Access cookie settings through your account dashboard</li>
              <li>Update preferences at any time without affecting essential functionality</li>
              <li>Receive notifications when cookie policies are updated</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser Controls</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Configure your browser to block or delete cookies</li>
              <li>Set up automatic cookie deletion when closing your browser</li>
              <li>Use private/incognito browsing modes</li>
              <li>Install browser extensions for enhanced cookie control</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Opt-Out</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Opt-out browser add-on</a></li>
              <li>Facebook: <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-600 hover:underline">Ad preferences settings</a></li>
              <li>Network Advertising Initiative: <a href="http://www.networkadvertising.org/choices/" className="text-blue-600 hover:underline">Opt-out tool</a></li>
              <li>Digital Advertising Alliance: <a href="http://www.aboutads.info/choices/" className="text-blue-600 hover:underline">Consumer choice page</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us About Cookies</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> cookies@coderspae.com
                </p>
                <p className="text-gray-700">
                  <strong>Privacy Team:</strong> privacy@coderspae.com
                </p>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="border-t border-gray-200 pt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Policy Updates</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                We may update this Cookie Policy from time to time. When we make changes, we&apos;ll notify you through our platform and update the &quot;Last updated&quot; date. Your continued use of CoderspaE after any changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
