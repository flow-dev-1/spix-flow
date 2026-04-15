export interface Job {
  id: string;
  title: string;
  department: string;
  reportsTo: string;
  salary: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  competencies: string[];
  experience: string;
  education: string;
}

export const jobs: Job[] = [
  {
    id: "accountant",
    title: "Accountant",
    department: "Finance",
    reportsTo: "General Manager",
    salary: "Competitive",
    overview: "Manages hotel financial operations, ensuring accuracy in accounting records, budgeting, and regulatory compliance.",
    responsibilities: [
      "Maintain accurate financial records",
      "Prepare financial statements and reconciliations",
      "Manage budgets, forecasts, payables, and receivables",
      "Ensure tax and regulatory compliance",
      "Support audits and payroll processing",
      "Track expenses and identify cost-saving opportunities"
    ],
    requirements: [
      "Minimum of 3 years' accounting experience (hospitality preferred)",
      "HND/BSc in Accounting, Finance, or related field",
      "ICAN/ACCA qualification is an advantage"
    ],
    competencies: [
      "Attention to detail",
      "Financial analysis",
      "Integrity",
      "Problem-solving",
      "Organizational skills",
      "Intermediate MS Excel proficiency"
    ],
    experience: "3+ years",
    education: "HND/BSc"
  },
  {
    id: "auditor",
    title: "Auditor",
    department: "Finance",
    reportsTo: "Board",
    salary: "Competitive",
    overview: "Ensures financial accuracy, compliance, and operational efficiency through regular internal audits.",
    responsibilities: [
      "Conduct internal audits across hotel operations",
      "Review internal controls and risk management",
      "Prepare audit reports and recommendations",
      "Follow up on corrective actions",
      "Liaise with external auditors"
    ],
    requirements: [
      "3–5 years' auditing experience (hospitality preferred)",
      "HND/BSc in Accounting, Finance, or related field",
      "Auditing certification is an advantage"
    ],
    competencies: [
      "Analytical skills",
      "Integrity",
      "Attention to detail",
      "Problem-solving",
      "Reporting skills",
      "Basic knowledge of POS systems",
      "Intermediate MS Excel proficiency"
    ],
    experience: "3-5 years",
    education: "HND/BSc"
  },
  {
    id: "chef-fb-manager",
    title: "Chef / F&B Manager",
    department: "Food & Beverage",
    reportsTo: "General Manager",
    salary: "Competitive",
    overview: "Oversees all food and beverage operations, ensuring quality service, cost control, hygiene, and guest satisfaction.",
    responsibilities: [
      "Plan, direct, and oversee all food and beverage operations",
      "Develop menus, pricing, and seasonal specials",
      "Maintain kitchen hygiene and safety",
      "Manage inventory, supplies, and food costs",
      "Recruit, train, and supervise kitchen and F&B staff",
      "Coordinate with departments for smooth service",
      "Handle guest feedback on food and beverage",
      "Ensure compliance with health and food safety regulations"
    ],
    requirements: [
      "Minimum 5 years in professional kitchen/F&B management",
      "HND or Degree in Culinary Arts, Hospitality, or related field"
    ],
    competencies: [
      "Creativity",
      "Leadership",
      "Customer Service",
      "Time Management",
      "Hygiene & Safety Awareness",
      "Basic knowledge of POS systems",
      "Computer literacy"
    ],
    experience: "5+ years",
    education: "HND/Degree"
  },
  {
    id: "housekeeping-manager",
    title: "Housekeeping Manager",
    department: "Housekeeping",
    reportsTo: "General Manager",
    salary: "Competitive",
    overview: "Ensures cleanliness, comfort, and high housekeeping standards across rooms and public areas.",
    responsibilities: [
      "Manage daily housekeeping operations for rooms and public areas",
      "Develop cleaning schedules and quality standards",
      "Recruit, train, and supervise housekeeping staff",
      "Monitor inventory of cleaning supplies and linens",
      "Ensure compliance with hygiene and safety regulations",
      "Inspect rooms and facilities for quality control",
      "Handle guest complaints related to cleanliness"
    ],
    requirements: [
      "3–5 years' housekeeping management experience",
      "Diploma or Degree in Hotel Management or Hospitality"
    ],
    competencies: [
      "Attention to detail",
      "Leadership",
      "Time Management",
      "Customer Service",
      "Organization"
    ],
    experience: "3-5 years",
    education: "Diploma/Degree"
  },
  {
    id: "club-manager",
    title: "Garden/Lounge Manager",
    department: "Entertainment",
    reportsTo: "General Manager",
    salary: "Competitive",
    overview: "Manages the hotel's nightclub/lounge to enhance guest experience, safety, and revenue.",
    responsibilities: [
      "Manage bar staff, DJs, and security teams",
      "Oversee pool operations, sanitation, and safety",
      "Drive revenue through events and promotions",
      "Monitor stock and prevent pilferage",
      "Ensure compliance with safety and local regulations"
    ],
    requirements: [
      "Minimum 4 years' experience managing a club, bar, or lounge",
      "HND or Degree in Business Administration or related field"
    ],
    competencies: [
      "Creativity and aesthetic sense",
      "Strong leadership and conflict-management skills",
      "Ability to work late hours",
      "Safety awareness/compliance"
    ],
    experience: "4+ years",
    education: "HND/Degree"
  },
  {
    id: "maintenance-officer",
    title: "Maintenance Officer",
    department: "Maintenance",
    reportsTo: "Admin Manager",
    salary: "Competitive",
    overview: "Responsible for routine maintenance and repair of hotel facilities, with a strong focus on generator operation and power supply management.",
    responsibilities: [
      "Operate and maintain hotel generators and manage power changeover",
      "Conduct routine inspections, servicing, and troubleshooting",
      "Maintain records of generator usage, servicing, and fuel consumption",
      "Perform basic electrical, mechanical, and facility maintenance",
      "Respond promptly to maintenance requests and emergencies",
      "Ensure compliance with safety standards and maintenance policies"
    ],
    requirements: [
      "Minimum 2 years' experience in generator operation and facility maintenance (hotel preferred)",
      "OND or Technical Certificate in Electrical, Mechanical, or related field"
    ],
    competencies: [
      "Technical skills",
      "Problem-solving",
      "Attention to detail",
      "Time management",
      "Safety awareness"
    ],
    experience: "2+ years",
    education: "OND/Technical Certificate"
  },
  {
    id: "truck-driver",
    title: "Truck Driver",
    department: "Logistics",
    reportsTo: "Admin Manager",
    salary: "Competitive",
    overview: "Responsible for safe and timely transportation of hotel supplies and equipment.",
    responsibilities: [
      "Transport goods and staff safely and efficiently",
      "Conduct routine vehicle inspections",
      "Maintain delivery logs and records",
      "Comply with road safety regulations"
    ],
    requirements: [
      "Minimum 2 years' professional driving experience",
      "Valid driver's license",
      "Minimum secondary school certificate"
    ],
    competencies: [
      "Safe driving skills",
      "Time management",
      "Reliability",
      "Communication skills"
    ],
    experience: "2+ years",
    education: "Secondary School Certificate"
  }
];

export const departments = [...new Set(jobs.map(job => job.department))];