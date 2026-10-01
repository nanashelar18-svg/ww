const bcrypt = require('bcryptjs');
const db = require('./database');

async function seed() {
  console.log('--- Seeding NexusAI Enterprise Database ---');

  const defaultPassword = await bcrypt.hash('password123', 10);

  // Clear existing if needed
  const state = db.getState();
  state.users = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'admin@nexus.ai',
      password: defaultPassword,
      role: 'admin',
      department: 'Operations',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Alex Rivera',
      email: 'tech@nexus.ai',
      password: defaultPassword,
      role: 'manager',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Elena Rostova',
      email: 'hr@nexus.ai',
      password: defaultPassword,
      role: 'manager',
      department: 'Human Resources',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Marcus Vance',
      email: 'legal@nexus.ai',
      password: defaultPassword,
      role: 'manager',
      department: 'Legal & Compliance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Priya Sharma',
      email: 'support@nexus.ai',
      password: defaultPassword,
      role: 'member',
      department: 'Customer Support',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: new Date().toISOString()
    }
  ];

  state.departments = [
    { id: 1, name: 'Engineering', lead_email: 'tech@nexus.ai', description: 'Core platform engineering, infrastructure, security, and cloud architectures.' },
    { id: 2, name: 'Human Resources', lead_email: 'hr@nexus.ai', description: 'People operations, talent acquisition, onboarding, and employee benefits.' },
    { id: 3, name: 'Legal & Compliance', lead_email: 'legal@nexus.ai', description: 'Corporate contracts, regulatory compliance (GDPR/SOC2/HIPAA), and risk mitigation.' },
    { id: 4, name: 'Customer Support', lead_email: 'support@nexus.ai', description: 'Client escalations, enterprise SLA tracking, and frontline customer success.' },
    { id: 5, name: 'Operations', lead_email: 'admin@nexus.ai', description: 'Cross-department coordination, resource planning, and executive operations.' }
  ];

  state.documents = [
    {
      id: 1,
      title: 'SOC-2 Type II Security & Access Control Policy',
      category: 'policy',
      department: 'Engineering',
      content: 'This document outlines mandatory zero-trust access controls, multi-factor authentication (MFA) requirements, and cryptographic standards across all enterprise services. All employees must use hardware or TOTP MFA. Secrets must be stored in HashiCorp Vault or AWS Secrets Manager. Plaintext passwords or API tokens in code repositories are strictly forbidden. Session tokens must have an expiration not exceeding 15 minutes for access tokens and 7 days for refresh tokens stored in HttpOnly cookies.',
      summary: 'Mandatory zero-trust security standards, MFA requirements, secret management, and session token lifetimes.',
      tags: 'security, soc2, mfa, tokens, zero-trust',
      author: 'Alex Rivera',
      version: '2.4',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Enterprise Employee Onboarding & Equipment SLA',
      category: 'sop',
      department: 'Human Resources',
      content: 'Standard Onboarding Protocol: When a new employee contract is signed, HR triggers the Automated Onboarding Workflow at least 5 business days prior to start date. Steps: 1. IT provisions corporate email, SSO access, and GitHub/Jira credentials. 2. Hardware procurement dispatches pre-configured M3 MacBook Pro. 3. Legal obtains signed Non-Disclosure Agreement (NDA). 4. People Ops assigns workplace buddy and schedules orientation.',
      summary: 'Protocol for new hire equipment dispatch, identity provisioning, and Day 1 orientation.',
      tags: 'onboarding, hr, equipment, provisioning, nda',
      author: 'Elena Rostova',
      version: '3.1',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Master Services Agreement (MSA) Vendor Risk Guidelines',
      category: 'legal',
      department: 'Legal & Compliance',
      content: 'All vendor contracts exceeding $25,000 ARR must include: 1. Standard mutual indemnification clause capped at 2x annual contract value. 2. Data processing addendum (DPA) compliant with GDPR Article 28. 3. 30-day termination for convenience notice without penalty. 4. Annual SOC-2 Type II audit report submission clause.',
      summary: 'Standard liability limits, DPA requirements, and termination clauses for third-party vendors.',
      tags: 'contracts, legal, vendor, indemnification, gdpr',
      author: 'Marcus Vance',
      version: '1.8',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Cross-Department Critical Incident Response Plan (SEV-1)',
      category: 'sop',
      department: 'Operations',
      content: 'In the event of a SEV-1 incident impacting customer data or core production uptime: 1. Incident Commander initiates war room within 10 minutes. 2. Engineering identifies root cause and engages rollback runbook. 3. Support updates customer status page every 20 minutes. 4. Legal is notified immediately if data confidentiality was compromised. 5. Post-mortem must be published within 48 hours.',
      summary: 'Roles, escalation paths, customer communication intervals, and post-mortem SLAs for critical outages.',
      tags: 'incident, sev1, devops, support, sla',
      author: 'Sarah Chen',
      version: '4.0',
      created_at: new Date().toISOString()
    }
  ];

  state.tickets = [
    {
      id: 1,
      title: 'Vendor Security Review for New Analytics SDK',
      description: 'Product analytics team wants to integrate Mixpanel/Datadog vendor SDK. Need Legal & Security review on data privacy compliance before prod deployment.',
      category: 'Compliance',
      priority: 'high',
      status: 'open',
      requester_id: 2,
      requester_name: 'Alex Rivera',
      requester_email: 'tech@nexus.ai',
      target_department: 'Legal & Compliance',
      assigned_to_email: 'legal@nexus.ai',
      ai_sentiment: 'neutral',
      ai_suggested_priority: 'high',
      ai_suggested_response: 'Based on the MSA Vendor Guidelines (Doc #3), we require a signed DPA under GDPR Art 28 and mutual indemnification before approving the SDK integration.',
      ai_cross_dept_action: 'Auto-scheduled cross-review between Legal Counsel and IT Security Lead.',
      sla_hours: 16,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Expedited Laptop & SSO Provisioning for Senior AI Architect',
      description: 'Senior AI Architect starting next Monday (in 3 days). Needs expedited M3 Max workstation, VPN credentials, and access to internal Model Registry.',
      category: 'Onboarding',
      priority: 'urgent',
      status: 'in_progress',
      requester_id: 3,
      requester_name: 'Elena Rostova',
      requester_email: 'hr@nexus.ai',
      target_department: 'Engineering',
      assigned_to_email: 'tech@nexus.ai',
      ai_sentiment: 'urgent',
      ai_suggested_priority: 'urgent',
      ai_suggested_response: 'According to SOP #2, expedited onboarding requires immediate IT ticket generation for SSO provisioning and priority hardware courier delivery.',
      ai_cross_dept_action: 'Triggered automated New Hire Onboarding Workflow #1.',
      sla_hours: 8,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Enterprise Client Requesting Custom SLA & Data Retention Clause',
      description: 'Tier-1 Fintech enterprise client requesting 99.99% uptime SLA and 90-day custom data deletion guarantee in renewal agreement.',
      category: 'Legal Review',
      priority: 'high',
      status: 'open',
      requester_id: 5,
      requester_name: 'Priya Sharma',
      requester_email: 'support@nexus.ai',
      target_department: 'Legal & Compliance',
      assigned_to_email: 'legal@nexus.ai',
      ai_sentiment: 'positive',
      ai_suggested_priority: 'high',
      ai_suggested_response: 'Standard terms support 99.9% uptime. Custom 99.99% requires VP of Engineering approval for multi-region active-active cluster failover.',
      ai_cross_dept_action: 'Dispatched notification to Engineering Lead Alex Rivera for infrastructure feasibility sign-off.',
      sla_hours: 24,
      created_at: new Date(Date.now() - 3600000 * 7).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Database Connection Pool Exhaustion during Morning Peak',
      description: 'Observing intermittent HTTP 504 gateway timeouts due to connection pool limits in the billing microservice. Need infra assistance.',
      category: 'Infrastructure',
      priority: 'urgent',
      status: 'in_progress',
      requester_id: 2,
      requester_name: 'Alex Rivera',
      requester_email: 'tech@nexus.ai',
      target_department: 'Engineering',
      assigned_to_email: 'tech@nexus.ai',
      ai_sentiment: 'critical',
      ai_suggested_priority: 'urgent',
      ai_suggested_response: 'SEV-1 incident protocol triggered. Recommended scaling max pool size from 50 to 150 and recycling idle connections older than 60s.',
      ai_cross_dept_action: 'Notified Customer Support to monitor customer inquiries.',
      sla_hours: 4,
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  state.workflows = [
    {
      id: 1,
      name: 'Autonomous New Hire Cross-Department Onboarding',
      description: 'Automates identity creation in Google Workspace/SSO, provisions GitHub & Slack seats, dispatches hardware, and drafts customized welcome packets.',
      trigger_event: 'HR marks candidate contract as SIGNED',
      involved_departments: ['Human Resources', 'Engineering', 'Operations', 'Legal & Compliance'],
      steps: [
        { order: 1, department: 'Human Resources', action: 'Verify signed Offer Letter & Background Verification', automated: true },
        { order: 2, department: 'Legal & Compliance', action: 'Issue Non-Disclosure Agreement (NDA) & IP Assignment via DocuSign', automated: true },
        { order: 3, department: 'Engineering', action: 'Provision SSO identity, MFA seed, and GitHub Enterprise access', automated: true },
        { order: 4, department: 'Operations', action: 'Generate courier tracking for encrypted MacBook Pro workstation', automated: true },
        { order: 5, department: 'Human Resources', action: 'Schedule Day 1 orientation and pair with designated Mentor', automated: true }
      ],
      execution_count: 14,
      active: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Vendor Contract Risk & Compliance Audit',
      description: 'Scans uploaded MSA / SOW documents against internal SOC-2 standards, flags liability discrepancies, and routes for legal sign-off.',
      trigger_event: 'Procurement uploads new vendor agreement',
      involved_departments: ['Legal & Compliance', 'Engineering', 'Operations'],
      steps: [
        { order: 1, department: 'Operations', action: 'Extract contract metadata, contract value, and payment terms', automated: true },
        { order: 2, department: 'Engineering', action: 'Verify vendor SOC-2 Type II report and Cloud Security posture', automated: true },
        { order: 3, department: 'Legal & Compliance', action: 'AI Redline indemnification, liability caps, and GDPR compliance', automated: true },
        { order: 4, department: 'Legal & Compliance', action: 'Generate final approval brief for General Counsel sign-off', automated: true }
      ],
      execution_count: 8,
      active: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'SEV-1 Incident Cross-Team Rapid Triage',
      description: 'Synchronizes Engineering, Support, and Legal during critical outages to preserve customer trust and meet contractual SLAs.',
      trigger_event: 'Monitoring detects SLA breach or system outage',
      involved_departments: ['Engineering', 'Customer Support', 'Operations'],
      steps: [
        { order: 1, department: 'Engineering', action: 'Spin up Incident War Room bridge and page on-call engineers', automated: true },
        { order: 2, department: 'Customer Support', action: 'AI generates drafted customer status update and incident banner', automated: true },
        { order: 3, department: 'Operations', action: 'Log audit trail and track recovery against customer SLA guarantees', automated: true },
        { order: 4, department: 'Engineering', action: 'AI compiles root cause timeline for executive post-mortem review', automated: true }
      ],
      execution_count: 5,
      active: 1,
      created_at: new Date().toISOString()
    }
  ];

  state.audit_logs = [
    { id: 1, user_email: 'admin@nexus.ai', action: 'PLATFORM_INITIALIZATION', details: 'NexusAI Enterprise operational environment seeded and active', department: 'Operations', created_at: new Date().toISOString() },
    { id: 2, user_email: 'hr@nexus.ai', action: 'WORKFLOW_TRIGGERED', details: 'Triggered New Hire Onboarding Workflow for Alex Dev (Candidate #1094)', department: 'Human Resources', created_at: new Date().toISOString() },
    { id: 3, user_email: 'tech@nexus.ai', action: 'AI_TRIAGE_RUN', details: 'AI Auto-triaged Ticket #4 as Critical SEV-1 and generated connection pool recommendation', department: 'Engineering', created_at: new Date().toISOString() }
  ];

  db.save();
  console.log('✅ NexusAI Enterprise Database successfully seeded with 5 users, 4 docs, 4 tickets, and 3 workflows!');
}

seed().catch(console.error);
