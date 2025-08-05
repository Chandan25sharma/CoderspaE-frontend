'use client';

import React from 'react';
import { ArrowLeft, FileText, Scale, Users, Trophy, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '../../components/MainLayout';

export default function TermsOfServicePage() {
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
              <Scale className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-600 mt-1">Last updated: August 5, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to CoderspaE, the premier international virtual code battle arena platform. These Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) govern your use of our website, mobile application, and services (collectively, the &quot;Service&quot;) operated by CoderspaE Inc. (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service. These Terms constitute a legally binding agreement between you and CoderspaE Inc.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Service is intended for users who are at least 13 years old. By using our Service, you represent and warrant that you are at least 13 years of age and have the legal capacity to enter into this agreement. If you are under 18, you confirm that you have obtained consent from your parent or guardian to use our Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to individual coders, educational institutions, tournament organizers, sponsors, and spectators.
            </p>
          </div>

          {/* Account Registration */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Account Registration and Security
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Creation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of our Service, you must register for an account:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Accurate information: You must provide accurate, current, and complete information during registration</li>
              <li>Information updates: You must promptly update your account information when changes occur</li>
              <li>Unique accounts: Each user may maintain only one active account</li>
              <li>Username requirements: Usernames must be appropriate, non-offensive, and not impersonate others</li>
              <li>Email verification: You must verify your email address to activate your account</li>
              <li>Legal capacity: You must have the legal right to enter into this agreement</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Security</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are responsible for maintaining the security of your account:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Password security: Choose a strong, unique password and keep it confidential</li>
              <li>Account access: You are responsible for all activities that occur under your account</li>
              <li>Unauthorized use: Immediately notify us of any unauthorized use of your account</li>
              <li>Multi-factor authentication: We strongly recommend enabling additional security features</li>
              <li>Shared computers: Log out of your account when using shared or public computers</li>
              <li>Security monitoring: We may monitor account activity for security purposes</li>
            </ul>
          </div>

          {/* Platform Usage */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-blue-600" />
              Platform Usage and Conduct
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitted Uses</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may use our Service for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Code competitions: Participate in coding battles, tournaments, and challenges</li>
              <li>Skill development: Practice coding skills and learn new programming concepts</li>
              <li>Community interaction: Engage with other users through comments, forums, and social features</li>
              <li>Content creation: Share educational content, tutorials, and coding insights</li>
              <li>Educational use: Use the platform for teaching and learning programming</li>
              <li>Professional development: Build your coding portfolio and demonstrate skills</li>
              <li>Spectating: Watch live coding battles and tournaments</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The following activities are strictly prohibited:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Cheating: Using unauthorized assistance, copying solutions, or manipulating results</li>
              <li>Harassment: Bullying, threatening, or harassing other users</li>
              <li>Spam and abuse: Sending unsolicited messages or abusing communication features</li>
              <li>Impersonation: Pretending to be another person or entity</li>
              <li>Illegal content: Posting content that violates laws or regulations</li>
              <li>Malicious code: Submitting viruses, malware, or harmful code</li>
              <li>System interference: Attempting to disrupt or compromise platform security</li>
              <li>Data mining: Automated extraction of platform data without permission</li>
              <li>Account manipulation: Creating fake accounts or manipulating voting systems</li>
              <li>Commercial exploitation: Using the platform for unauthorized commercial purposes</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-blue-600" />
              Contact Information
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal and Compliance Contacts</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these Terms of Service or legal matters, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Legal Department</p>
                    <p className="text-gray-700">legal@coderspae.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Terms Questions</p>
                    <p className="text-gray-700">terms@coderspae.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-700">We will respond to legal inquiries within 5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Notice */}
          <div className="border-t border-gray-200 pt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Agreement Confirmation</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                These Terms of Service represent a binding legal agreement between you and CoderspaE Inc. Please read them carefully and contact us if you have any questions. Your continued use of our platform constitutes acceptance of these terms in their entirety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
