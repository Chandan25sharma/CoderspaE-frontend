'use client';

import React from 'react';
import { ArrowLeft, Shield, Lock, Database, Users, Globe, FileText, AlertTriangle, Mail } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '../../components/MainLayout';

export default function DataProtectionPage() {
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
                <h1 className="text-3xl font-bold text-gray-900">Data Protection Policy</h1>
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
              <Database className="w-6 h-6 mr-2 text-blue-600" />
              Our Commitment to Data Protection
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At CoderspaE, we take data protection seriously and are committed to safeguarding your personal information in accordance with the highest industry standards. This Data Protection Policy outlines our comprehensive approach to protecting your privacy, securing your data, and ensuring compliance with international data protection regulations including GDPR, CCPA, and other applicable laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement robust technical and organizational measures to protect against unauthorized access, data breaches, and misuse of personal information. Our data protection framework is designed to give you control over your data while enabling us to provide you with exceptional coding battle experiences.
            </p>
          </div>

          {/* Data Protection Principles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection Principles</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-green-600" />
                  Lawfulness & Transparency
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We process personal data lawfully, fairly, and transparently. We clearly communicate what data we collect, why we collect it, and how we use it through our privacy notices and terms of service.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Purpose Limitation
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Personal data is collected for specific, explicit, and legitimate purposes only. We do not process data for purposes incompatible with those for which it was originally collected.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-purple-600" />
                  Data Minimization
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We collect only the minimum amount of personal data necessary to achieve our stated purposes. We regularly review data collection practices to ensure continued necessity.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Security & Integrity
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We implement appropriate technical and organizational measures to ensure data security, integrity, and protection against unauthorized processing, loss, or damage.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Safeguards */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Safeguards</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Encryption</h3>
                <ul className="list-disc list-inside text-blue-800 space-y-2">
                  <li>End-to-end encryption for all data transmission using TLS 1.3</li>
                  <li>AES-256 encryption for data at rest in our databases</li>
                  <li>Encrypted backups with separate key management systems</li>
                  <li>Client-side encryption for sensitive user data</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-3">Access Controls</h3>
                <ul className="list-disc list-inside text-green-800 space-y-2">
                  <li>Multi-factor authentication for all administrative access</li>
                  <li>Role-based access control (RBAC) with least privilege principles</li>
                  <li>Regular access reviews and automated de-provisioning</li>
                  <li>Zero-trust security model for internal systems</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-3">Monitoring & Detection</h3>
                <ul className="list-disc list-inside text-purple-800 space-y-2">
                  <li>24/7 security monitoring and threat detection</li>
                  <li>Automated anomaly detection for unusual data access patterns</li>
                  <li>Real-time alerting for potential security incidents</li>
                  <li>Comprehensive audit logging and forensic capabilities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Organizational Measures */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizational Measures</h2>
            
            <div className="space-y-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Staff Training & Awareness
                </h3>
                <p className="text-gray-700 mb-4">
                  All CoderspaE employees receive comprehensive data protection training as part of their onboarding process and through regular refresher sessions.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Mandatory annual data protection training for all staff</li>
                  <li>Specialized training for roles handling sensitive data</li>
                  <li>Regular security awareness updates and phishing simulations</li>
                  <li>Clear data handling procedures and incident response protocols</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  Vendor Management
                </h3>
                <p className="text-gray-700 mb-4">
                  We carefully select and monitor third-party vendors to ensure they meet our data protection standards.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Due diligence assessments for all data processing vendors</li>
                  <li>Contractual data protection obligations and audit rights</li>
                  <li>Regular vendor security assessments and compliance monitoring</li>
                  <li>Data Processing Agreements (DPAs) with all relevant suppliers</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Documentation & Records
                </h3>
                <p className="text-gray-700 mb-4">
                  We maintain comprehensive documentation of our data processing activities and protection measures.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Records of processing activities (ROPA) as required by GDPR</li>
                  <li>Data flow mappings and privacy impact assessments</li>
                  <li>Incident response documentation and breach registers</li>
                  <li>Regular compliance audits and improvement planning</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Subject Rights */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Data Protection Rights</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                As a data subject, you have several rights regarding your personal data. We provide easy-to-use tools and processes to help you exercise these rights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Right of Access</h4>
                  <p className="text-gray-700 text-sm">Request copies of your personal data and information about how it&apos;s processed.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Right to Rectification</h4>
                  <p className="text-gray-700 text-sm">Request correction of inaccurate or incomplete personal data.</p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Right to Erasure</h4>
                  <p className="text-gray-700 text-sm">Request deletion of your personal data under certain circumstances.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Right to Restrict Processing</h4>
                  <p className="text-gray-700 text-sm">Request limitation of how we process your personal data.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Right to Data Portability</h4>
                  <p className="text-gray-700 text-sm">Request transfer of your data to another service provider.</p>
                </div>
                
                <div className="border-l-4 border-teal-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Right to Object</h4>
                  <p className="text-gray-700 text-sm">Object to processing based on legitimate interests or direct marketing.</p>
                </div>
                
                <div className="border-l-4 border-pink-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Rights Related to Automated Decision-Making</h4>
                  <p className="text-gray-700 text-sm">Rights regarding automated processing and profiling activities.</p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Right to Withdraw Consent</h4>
                  <p className="text-gray-700 text-sm">Withdraw consent for processing at any time where applicable.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
              Data Breach Response
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              We have established comprehensive incident response procedures to quickly identify, contain, and respond to any data security incidents.
            </p>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Immediate Response (0-24 hours)</h3>
                <ul className="list-disc list-inside text-red-800 space-y-1">
                  <li>Incident detection and initial assessment</li>
                  <li>Containment measures to prevent further exposure</li>
                  <li>Internal incident response team activation</li>
                  <li>Preliminary impact assessment and evidence preservation</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">Investigation Phase (24-72 hours)</h3>
                <ul className="list-disc list-inside text-orange-800 space-y-1">
                  <li>Detailed forensic analysis and root cause investigation</li>
                  <li>Full scope assessment of affected data and individuals</li>
                  <li>Risk assessment for affected data subjects</li>
                  <li>Notification to relevant authorities (within 72 hours if required)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Communication & Recovery</h3>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>Notification to affected individuals (without undue delay)</li>
                  <li>Public disclosure if required by law or risk assessment</li>
                  <li>Implementation of additional security measures</li>
                  <li>Post-incident review and improvement planning</li>
                </ul>
              </div>
            </div>
          </div>

          {/* International Transfers */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              When we transfer personal data internationally, we ensure appropriate safeguards are in place to protect your information.
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">European Union to Third Countries</h4>
                <p className="text-gray-700 text-sm">
                  We use Standard Contractual Clauses (SCCs) approved by the European Commission and conduct Transfer Impact Assessments where required.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">US Data Transfers</h4>
                <p className="text-gray-700 text-sm">
                  We comply with state-specific requirements including the California Consumer Privacy Act (CCPA) and other applicable US privacy laws.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Other Jurisdictions</h4>
                <p className="text-gray-700 text-sm">
                  We maintain compliance with local data protection laws in all jurisdictions where we operate or process personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-blue-600" />
              Data Protection Contact
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about our data protection practices or wish to exercise your rights, please contact our Data Protection Officer:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Data Protection Officer:</strong> dpo@coderspae.com
                </p>
                <p className="text-gray-700">
                  <strong>Privacy Team:</strong> privacy@coderspae.com
                </p>
                <p className="text-gray-700">
                  <strong>General Support:</strong> support@coderspae.com
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> We aim to respond to all data protection inquiries within 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="border-t border-gray-200 pt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Policy Updates</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                We regularly review and update our data protection practices to ensure continued compliance with evolving regulations and best practices. Material changes to this policy will be communicated through our platform with appropriate notice periods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
