'use client';

import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, CheckCircle, Users, Database, Globe, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '../../components/MainLayout';

export default function SecurityPolicyPage() {
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
              <Lock className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Security Policy</h1>
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
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              Our Commitment to Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At CoderspaE, security is not just a feature—it&apos;s the foundation of everything we do. As a platform that handles sensitive code, personal data, and competitive programming contests, we understand the critical importance of maintaining the highest security standards to protect our users and their intellectual property.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This Security Policy outlines our comprehensive approach to securing the CoderspaE platform, including our infrastructure, data protection measures, incident response procedures, and the shared responsibility model with our users. We are committed to transparency in our security practices and continuous improvement of our security posture.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our security program is designed to meet and exceed industry standards, including compliance with SOC 2 Type II, ISO 27001, and other relevant security frameworks. We regularly undergo third-party security audits and penetration testing to validate our security controls and identify areas for improvement.
            </p>
          </div>

          {/* Infrastructure Security */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-600" />
              Infrastructure Security
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Cloud Security Architecture</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform is built on enterprise-grade cloud infrastructure with multiple layers of security:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Multi-region deployment with automatic failover capabilities for high availability</li>
              <li>Virtual Private Cloud (VPC) isolation with strict network segmentation</li>
              <li>Web Application Firewall (WAF) protection against common web attacks</li>
              <li>Distributed Denial of Service (DDoS) protection at multiple network layers</li>
              <li>Content Delivery Network (CDN) with edge security for global performance</li>
              <li>Intrusion Detection and Prevention Systems (IDS/IPS) monitoring all network traffic</li>
              <li>24/7 Security Operations Center (SOC) monitoring and incident response</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Code Execution Security</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Given the nature of our platform, we implement specialized security for code execution:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Sandboxed execution environments for all user-submitted code</li>
              <li>Resource limits and timeout controls to prevent abuse</li>
              <li>Static code analysis to detect potentially malicious code patterns</li>
              <li>Dynamic analysis and behavioral monitoring during code execution</li>
              <li>Isolated execution contexts preventing cross-user interference</li>
              <li>Automated malware detection and quarantine procedures</li>
              <li>Secure disposal of execution environments after use</li>
            </ul>
          </div>

          {/* Data Protection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-600" />
              Data Protection and Encryption
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Encryption Standards</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We employ industry-leading encryption to protect data at all stages:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>AES-256 encryption for data at rest with regular key rotation</li>
              <li>TLS 1.3 encryption for all data in transit</li>
              <li>End-to-end encryption for sensitive communications</li>
              <li>Hardware Security Modules (HSMs) for cryptographic key management</li>
              <li>Perfect Forward Secrecy (PFS) for ephemeral key exchanges</li>
              <li>Certificate transparency and pinning for enhanced HTTPS security</li>
              <li>Encrypted database connections with certificate validation</li>
            </ul>
          </div>

          {/* Access Control */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Access Control and Authentication
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Factor Authentication</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement comprehensive authentication measures:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Multi-factor authentication (MFA) required for all user accounts</li>
              <li>Support for TOTP, SMS, email, and hardware security keys</li>
              <li>Risk-based authentication with behavioral analysis</li>
              <li>Single Sign-On (SSO) integration with enterprise identity providers</li>
              <li>Passwordless authentication options including biometrics</li>
              <li>Account lockout protection against brute force attacks</li>
              <li>Session management with automatic timeout and concurrent session limits</li>
            </ul>
          </div>

          {/* Monitoring */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-blue-600" />
              Security Monitoring and Threat Detection
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Security Monitoring</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our security monitoring capabilities include:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Security Information and Event Management (SIEM) system aggregating logs</li>
              <li>Real-time threat intelligence feeds and indicator matching</li>
              <li>Machine learning-based anomaly detection and behavioral analysis</li>
              <li>User and Entity Behavior Analytics (UEBA) for insider threat detection</li>
              <li>Network traffic analysis and protocol inspection</li>
              <li>Endpoint detection and response (EDR) on all systems</li>
              <li>24/7 Security Operations Center (SOC) with human analysts</li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-blue-600" />
              Compliance and Auditing
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Security Certifications</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              CoderspaE maintains the following security certifications and compliance standards:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>SOC 2 Type II certification for security, availability, and confidentiality</li>
              <li>ISO 27001 certification for information security management</li>
              <li>GDPR compliance for European Union data protection requirements</li>
              <li>CCPA compliance for California consumer privacy protection</li>
              <li>COPPA compliance for children&apos;s online privacy protection</li>
              <li>PIPEDA compliance for Canadian personal information protection</li>
              <li>Regular third-party security audits and assessments</li>
            </ul>
          </div>

          {/* Responsible Disclosure */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-blue-600" />
              Responsible Disclosure Program
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Bug Bounty Program</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We maintain an active bug bounty program to encourage security research:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Rewards for qualifying security vulnerabilities based on severity</li>
              <li>Clear scope and rules of engagement for security researchers</li>
              <li>Legal safe harbor for good faith security research</li>
              <li>Expedited response and remediation for critical vulnerabilities</li>
              <li>Public recognition for researchers (with their consent)</li>
              <li>Regular communication and updates on reported issues</li>
              <li>Hall of fame for responsible security researchers</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-blue-600" />
              Security Contact Information
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Team Contacts</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For security-related inquiries, vulnerabilities, or incidents, please contact our security team:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Security Team</p>
                    <p className="text-gray-700">security@coderspae.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-700">Critical issues: &lt;1 hour | Standard issues: &lt;24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Notice */}
          <div className="border-t border-gray-200 pt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Continuous Security Improvement</h3>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                Security is an ongoing journey, not a destination. We are committed to continuously improving our security posture through investment in people, processes, and technology. Our security team works around the clock to protect your data and ensure the integrity of the CoderspaE platform.
              </p>
              <p className="text-blue-800 text-sm leading-relaxed">
                If you have questions about our security practices or suggestions for improvement, please don&apos;t hesitate to contact our security team. Together, we can build a more secure platform for the global coding community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
