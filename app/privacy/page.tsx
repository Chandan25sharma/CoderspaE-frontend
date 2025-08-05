'use client';

import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '../../components/MainLayout';

export default function PrivacyPolicyPage() {
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
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
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
              <Eye className="w-6 h-6 mr-2 text-blue-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to CoderspaE, the premier international virtual code battle arena platform. At CoderspaE, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and protect information about you when you use our platform, services, and website.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using CoderspaE, you agree to the collection and use of information in accordance with this Privacy Policy. This policy applies to all users of our platform, including competitors, spectators, content creators, and administrators.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We understand that your privacy is important to you, and we want to be transparent about our practices. This policy covers our data handling practices across all CoderspaE services, including our main platform, mobile applications, API services, and any related tools or features.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-600" />
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect personal information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Account information: Username, email address, password (encrypted), display name, and profile picture</li>
              <li>Profile details: Bio, programming language preferences, skill level, experience, and social media links</li>
              <li>Contact information: Email address, and any additional contact details you choose to provide</li>
              <li>Payment information: Billing details, payment method information (processed securely through third-party providers)</li>
              <li>Identity verification: For tournament participation and prize distribution, we may collect government-issued ID information</li>
              <li>Communication data: Messages sent through our platform, support tickets, and feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We automatically collect information about how you use our platform:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Battle performance: Code submissions, completion times, test results, ranking data, and competition history</li>
              <li>Platform activity: Pages viewed, features used, time spent on platform, click patterns, and navigation behavior</li>
              <li>Device information: IP address, browser type, operating system, device identifiers, and hardware specifications</li>
              <li>Log data: Server logs, error reports, crash data, and system performance metrics</li>
              <li>Cookies and tracking: Session data, preferences, authentication tokens, and analytics information</li>
              <li>Interaction data: Comments, likes, shares, follows, and other social interactions on the platform</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Code and Content Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a coding platform, we collect and store:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Source code: All code submissions, solutions, and programming work submitted through our platform</li>
              <li>Execution data: Runtime performance, memory usage, execution logs, and debugging information</li>
              <li>Version history: All versions and iterations of your code submissions for historical tracking</li>
              <li>Collaboration data: Shared code, team project contributions, and peer review interactions</li>
              <li>Educational content: Tutorials created, learning progress, and educational material interactions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may receive information from third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Social login data: Information from GitHub, Google, LinkedIn, or other OAuth providers</li>
              <li>Payment processors: Transaction data, payment status, and billing information</li>
              <li>Analytics services: Aggregate usage statistics and performance metrics</li>
              <li>Security services: Fraud detection, bot prevention, and security scanning results</li>
              <li>Integration partners: Data from connected development tools and platforms</li>
            </ul>
          </div>

          {/* How We Use Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-600" />
              How We Use Your Information
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform Operations</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to operate and improve our platform:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Account management: Creating, maintaining, and securing your user account</li>
              <li>Service delivery: Providing core platform features, code execution, and battle functionality</li>
              <li>Performance optimization: Improving platform speed, reliability, and user experience</li>
              <li>Feature development: Developing new features based on user behavior and feedback</li>
              <li>Technical support: Troubleshooting issues, providing customer support, and resolving technical problems</li>
              <li>Security measures: Protecting against fraud, abuse, and unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Competition and Gaming</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              For our core gaming and competition features:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Matchmaking: Pairing users with appropriate skill levels for fair competition</li>
              <li>Leaderboards: Calculating rankings, statistics, and competitive standings</li>
              <li>Tournament organization: Managing registrations, brackets, and prize distributions</li>
              <li>Skill assessment: Evaluating coding abilities and providing personalized challenges</li>
              <li>Achievement tracking: Monitoring progress, unlocking badges, and recognizing accomplishments</li>
              <li>Spectator features: Enabling live viewing, streaming, and social features around competitions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Communication and Marketing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may use your information for communication purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Platform notifications: Updates about battles, tournaments, and platform activities</li>
              <li>Educational content: Personalized learning recommendations and coding tips</li>
              <li>Marketing communications: Information about new features, events, and promotional offers</li>
              <li>Community updates: News about platform developments and community highlights</li>
              <li>Transactional emails: Purchase confirmations, account changes, and security alerts</li>
              <li>Surveys and feedback: Requests for user input on platform improvements</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics and Research</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We analyze data to improve our services:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Usage analytics: Understanding how users interact with our platform</li>
              <li>Performance metrics: Measuring platform efficiency and identifying bottlenecks</li>
              <li>Educational research: Studying coding learning patterns and educational effectiveness</li>
              <li>Market research: Understanding industry trends and user preferences</li>
              <li>A/B testing: Experimenting with new features and interface improvements</li>
              <li>Predictive modeling: Anticipating user needs and preventing technical issues</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-blue-600" />
              Contact Us
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Questions and Requests</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-700">privacy@coderspae.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Data Protection Officer</p>
                    <p className="text-gray-700">dpo@coderspae.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-700">We will respond to privacy requests within 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Notice */}
          <div className="border-t border-gray-200 pt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Privacy Matters</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                At CoderspaE, protecting your privacy is fundamental to our mission. We are committed to transparency, security, and giving you control over your personal information. If you have any questions or concerns about our privacy practices, please don&apos;t hesitate to contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
