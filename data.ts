// Sample data for the SevakSync AI dashboard

export interface Need {
  id: string;
  area: string;
  need: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  description?: string;
}

export interface Review {
  id: string;
  volunteerId: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  volunteerId: string;
  needId: string;
  needTitle: string;
  area: string;
  completedAt: string;
  rating?: number;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  skill: string;
  area: string;
  availability: "Available" | "Busy" | "On Leave";
  phone: string;
  tasksCompleted: number;
  averageRating: number;
  reliability: number;
  lastActive: string;
  joinedAt: string;
}

export interface Assignment {
  id: string;
  needId: string;
  volunteerId: string;
  assignedAt: string;
}

export const needTypes = [
  "Medical Supplies",
  "Food Distribution", 
  "Education Support",
  "Elder Care",
  "Water Supply",
  "Clothing Donation",
  "Mental Health Support",
  "Transport Assistance",
  "Child Welfare",
  "Emergency Shelter",
];

export const areas = ["Naroda", "Maninagar", "Bopal", "Chandkheda"];

export const skills = [
  "Medical",
  "Food Service",
  "Education",
  "Elder Care",
  "Logistics",
  "Counseling",
  "Transport",
  "Child Welfare",
];

export const communityNeeds: Need[] = [
  { id: "N001", area: "Naroda", need: "Medical Supplies", type: "Medical Supplies", severity: "Critical", status: "Open", createdAt: "2024-01-15", description: "Urgent need for basic medical supplies including bandages, antiseptics, and first aid kits" },
  { id: "N002", area: "Maninagar", need: "Food Distribution", type: "Food Distribution", severity: "High", status: "In Progress", createdAt: "2024-01-14", description: "Weekly food distribution needed for 50 families" },
  { id: "N003", area: "Bopal", need: "Education Support", type: "Education Support", severity: "Medium", status: "Open", createdAt: "2024-01-13", description: "Tutoring support needed for underprivileged children" },
  { id: "N004", area: "Chandkheda", need: "Elder Care", type: "Elder Care", severity: "High", status: "Open", createdAt: "2024-01-12", description: "Daily assistance required for 10 elderly residents" },
  { id: "N005", area: "Naroda", need: "Water Supply", type: "Water Supply", severity: "Critical", status: "In Progress", createdAt: "2024-01-11", description: "Clean drinking water distribution in affected areas" },
  { id: "N006", area: "Maninagar", need: "Clothing Donation", type: "Clothing Donation", severity: "Low", status: "Resolved", createdAt: "2024-01-10", description: "Winter clothing needed for homeless shelter" },
  { id: "N007", area: "Bopal", need: "Mental Health Support", type: "Mental Health Support", severity: "Medium", status: "Open", createdAt: "2024-01-09", description: "Counseling sessions for trauma survivors" },
  { id: "N008", area: "Chandkheda", need: "Transport Assistance", type: "Transport Assistance", severity: "Low", status: "Open", createdAt: "2024-01-08", description: "Transportation for medical appointments" },
  { id: "N009", area: "Naroda", need: "Child Welfare", type: "Child Welfare", severity: "High", status: "In Progress", createdAt: "2024-01-07", description: "After-school care program for working parents" },
  { id: "N010", area: "Maninagar", need: "Emergency Shelter", type: "Emergency Shelter", severity: "Critical", status: "Open", createdAt: "2024-01-06", description: "Temporary shelter for displaced families" },
];

export const volunteers: Volunteer[] = [
  { id: "V001", name: "Priya Sharma", email: "priya.sharma@email.com", skill: "Medical", area: "Naroda", availability: "Available", phone: "+91 98765 43210", tasksCompleted: 15, averageRating: 4.8, reliability: 95, lastActive: "2024-01-15", joinedAt: "2023-06-15" },
  { id: "V002", name: "Raj Patel", email: "raj.patel@email.com", skill: "Food Service", area: "Maninagar", availability: "Available", phone: "+91 98765 43211", tasksCompleted: 22, averageRating: 4.6, reliability: 92, lastActive: "2024-01-14", joinedAt: "2023-04-20" },
  { id: "V003", name: "Anita Desai", email: "anita.desai@email.com", skill: "Education", area: "Bopal", availability: "Busy", phone: "+91 98765 43212", tasksCompleted: 18, averageRating: 4.9, reliability: 98, lastActive: "2024-01-13", joinedAt: "2023-05-10" },
  { id: "V004", name: "Vijay Kumar", email: "vijay.kumar@email.com", skill: "Elder Care", area: "Chandkheda", availability: "Available", phone: "+91 98765 43213", tasksCompleted: 12, averageRating: 4.5, reliability: 88, lastActive: "2024-01-12", joinedAt: "2023-08-01" },
  { id: "V005", name: "Meera Shah", email: "meera.shah@email.com", skill: "Medical", area: "Naroda", availability: "Available", phone: "+91 98765 43214", tasksCompleted: 28, averageRating: 4.9, reliability: 97, lastActive: "2024-01-15", joinedAt: "2023-02-28" },
  { id: "V006", name: "Amit Joshi", email: "amit.joshi@email.com", skill: "Logistics", area: "Maninagar", availability: "On Leave", phone: "+91 98765 43215", tasksCompleted: 9, averageRating: 4.2, reliability: 82, lastActive: "2024-01-05", joinedAt: "2023-09-15" },
  { id: "V007", name: "Neha Gupta", email: "neha.gupta@email.com", skill: "Counseling", area: "Bopal", availability: "Available", phone: "+91 98765 43216", tasksCompleted: 14, averageRating: 4.7, reliability: 90, lastActive: "2024-01-14", joinedAt: "2023-07-20" },
  { id: "V008", name: "Ravi Singh", email: "ravi.singh@email.com", skill: "Transport", area: "Chandkheda", availability: "Available", phone: "+91 98765 43217", tasksCompleted: 20, averageRating: 4.4, reliability: 85, lastActive: "2024-01-11", joinedAt: "2023-03-05" },
  { id: "V009", name: "Sonal Mehta", email: "sonal.mehta@email.com", skill: "Child Welfare", area: "Naroda", availability: "Busy", phone: "+91 98765 43218", tasksCompleted: 16, averageRating: 4.8, reliability: 94, lastActive: "2024-01-10", joinedAt: "2023-05-25" },
  { id: "V010", name: "Kiran Reddy", email: "kiran.reddy@email.com", skill: "Food Service", area: "Maninagar", availability: "Available", phone: "+91 98765 43219", tasksCompleted: 11, averageRating: 4.3, reliability: 86, lastActive: "2024-01-09", joinedAt: "2023-10-10" },
];

export const taskHistory: TaskHistory[] = [
  { id: "TH001", volunteerId: "V001", needId: "N001", needTitle: "Medical Camp Setup", area: "Naroda", completedAt: "2024-01-10", rating: 5 },
  { id: "TH002", volunteerId: "V001", needId: "N005", needTitle: "First Aid Training", area: "Naroda", completedAt: "2024-01-05", rating: 5 },
  { id: "TH003", volunteerId: "V002", needId: "N002", needTitle: "Food Distribution Drive", area: "Maninagar", completedAt: "2024-01-12", rating: 4 },
  { id: "TH004", volunteerId: "V003", needId: "N003", needTitle: "Tutoring Session", area: "Bopal", completedAt: "2024-01-08", rating: 5 },
  { id: "TH005", volunteerId: "V005", needId: "N001", needTitle: "Emergency Medical Response", area: "Naroda", completedAt: "2024-01-14", rating: 5 },
  { id: "TH006", volunteerId: "V007", needId: "N007", needTitle: "Counseling Workshop", area: "Bopal", completedAt: "2024-01-11", rating: 5 },
  { id: "TH007", volunteerId: "V008", needId: "N008", needTitle: "Patient Transportation", area: "Chandkheda", completedAt: "2024-01-09", rating: 4 },
  { id: "TH008", volunteerId: "V004", needId: "N004", needTitle: "Elder Home Visit", area: "Chandkheda", completedAt: "2024-01-07", rating: 5 },
];

export const reviews: Review[] = [
  { id: "R001", volunteerId: "V001", rating: 5, comment: "Priya is extremely dedicated and professional. Great medical support!", reviewerName: "NGO Coordinator", createdAt: "2024-01-12" },
  { id: "R002", volunteerId: "V001", rating: 5, comment: "Always punctual and helpful. Highly recommended.", reviewerName: "Community Leader", createdAt: "2024-01-08" },
  { id: "R003", volunteerId: "V002", rating: 4, comment: "Raj does excellent work in food distribution.", reviewerName: "Program Manager", createdAt: "2024-01-10" },
  { id: "R004", volunteerId: "V003", rating: 5, comment: "Anita is amazing with children. Very patient teacher.", reviewerName: "School Principal", createdAt: "2024-01-06" },
  { id: "R005", volunteerId: "V005", rating: 5, comment: "Meera is our most reliable medical volunteer.", reviewerName: "Health Officer", createdAt: "2024-01-14" },
  { id: "R006", volunteerId: "V007", rating: 5, comment: "Excellent counselor with great empathy.", reviewerName: "Mental Health Coord.", createdAt: "2024-01-09" },
];

export const mapLocations = [
  { name: "Naroda", lat: 23.0707, lng: 72.6516, needs: 3, volunteers: 3 },
  { name: "Maninagar", lat: 22.9958, lng: 72.6141, needs: 3, volunteers: 3 },
  { name: "Bopal", lat: 23.0313, lng: 72.4682, needs: 2, volunteers: 2 },
  { name: "Chandkheda", lat: 23.1104, lng: 72.5847, needs: 2, volunteers: 2 },
];

export const analyticsData = {
  needsByArea: [
    { area: "Naroda", count: 3 },
    { area: "Maninagar", count: 3 },
    { area: "Bopal", count: 2 },
    { area: "Chandkheda", count: 2 },
  ],
  needsBySeverity: [
    { severity: "Critical", count: 3, fill: "var(--chart-1)" },
    { severity: "High", count: 3, fill: "var(--chart-2)" },
    { severity: "Medium", count: 2, fill: "var(--chart-3)" },
    { severity: "Low", count: 2, fill: "var(--chart-4)" },
  ],
  monthlyTrends: [
    { month: "Aug", needs: 45, resolved: 38 },
    { month: "Sep", needs: 52, resolved: 44 },
    { month: "Oct", needs: 48, resolved: 42 },
    { month: "Nov", needs: 61, resolved: 55 },
    { month: "Dec", needs: 55, resolved: 48 },
    { month: "Jan", needs: 67, resolved: 52 },
  ],
  volunteerActivity: [
    { day: "Mon", hours: 24 },
    { day: "Tue", hours: 32 },
    { day: "Wed", hours: 28 },
    { day: "Thu", hours: 35 },
    { day: "Fri", hours: 30 },
    { day: "Sat", hours: 45 },
    { day: "Sun", hours: 20 },
  ],
};

export const alerts = [
  { id: 1, type: "critical", message: "Medical supplies critically low in Naroda area", time: "5 mins ago" },
  { id: 2, type: "warning", message: "Volunteer shortage expected this weekend", time: "1 hour ago" },
  { id: 3, type: "info", message: "New batch of supplies arriving tomorrow", time: "2 hours ago" },
];

export const aiSuggestions = [
  { id: 1, suggestion: "Medical demand rising in East Ahmedabad. Consider deploying 3 additional medical volunteers to Naroda.", confidence: 92 },
  { id: 2, suggestion: "Pattern detected: Food distribution needs peak on weekends. Pre-position resources in Maninagar.", confidence: 87 },
  { id: 3, suggestion: "Elder care requests increasing in Chandkheda. Recommend partnership with local healthcare center.", confidence: 85 },
];

// Skill to Need mapping for auto-assignment
export const skillNeedMapping: Record<string, string[]> = {
  "Medical": ["Medical Supplies", "Elder Care", "Emergency Shelter"],
  "Food Service": ["Food Distribution"],
  "Education": ["Education Support", "Child Welfare"],
  "Elder Care": ["Elder Care"],
  "Logistics": ["Water Supply", "Clothing Donation", "Transport Assistance"],
  "Counseling": ["Mental Health Support"],
  "Transport": ["Transport Assistance", "Emergency Shelter"],
  "Child Welfare": ["Child Welfare", "Education Support"],
};
