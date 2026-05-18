export interface User {
  id: string;
  name: string;
  email: string;
  role: 'trainee' | 'trainer';
  status: 'active' | 'inactive';
}

export interface UserDetail extends User {
  personalInfo: {
    gender: string;
    weightKg: number;
    heightCm: number;
    age: number;
    fitnessLevel: string;
    fitnessGoal: string;
    equipment: string[];
  };
  activityLog: { type: string; timestamp: string; details: string }[];
  subscriptions: { subscriptionId: string; type: string; startDate: string; endDate: string; status: string }[];
}

export interface TrainerApplication {
  id: string;
  name: string;
  email: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  specialization: string;
  experience: string;
  reason?: string;
}

export interface OperatingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Gym {
  id: string;
  name: string;
  location: string;
  services: string[];
  operatingHours: OperatingHours;
  images: string[];
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive';
  memberCount: number;
}

export interface GymApplication {
  id: string;
  gymName: string;
  ownerName: string;
  email: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

export interface Transaction {
  transactionId: string;
  userId: string;
  userName: string;
  gymId: string;
  gymName: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'trainerPayment' | 'refund';
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'training' | 'calorieBurn' | 'commitment';
  startDate: string;
  endDate: string;
  rewards: { points: number; badges: string[] };
  participantCount: number;
}

export interface PointRule {
  activity: string;
  pointsAwarded: number;
}

export interface LevelThreshold {
  level: number;
  minPoints: number;
  title: string;
}

export interface SubscriptionPlan {
  id: string;
  gymId: string;
  name: string;
  durationDays: number;
  price: number;
  features: string[];
}

export interface GymMember {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: 'active' | 'expired' | 'cancelled';
  subscriptionEndDate: string;
  subscriptionDetails: { subscriptionId: string; planName: string; startDate: string; endDate: string; status: string }[];
  attendanceLog: { entryTime: string; exitTime: string | null }[];
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  entryTime: string;
  exitTime: string | null;
}

export interface Review {
  reviewId: string;
  memberId: string;
  memberName: string;
  rating: number;
  comment: string;
  submittedAt: string;
  response: { managerId: string; responseText: string; respondedAt: string } | null;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  role: 'admin' | 'gym' | null;
  accessToken: string | null;
  username: string | null;
  email: string | null;
  adminId?: string;
  gymManagerId?: string;
  gymId?: string;
  gymName?: string;
}

export interface MuscleGroup {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  isActive?: boolean;
}

export interface MuscleGroupPayload {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  isActive: boolean;
}

export interface Equipment {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  isActive?: boolean;
}

export interface EquipmentPayload {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  resultsPerPage: number;
  totalPages: number;
}

export interface Exercise {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  instructionsEn: string[];
  instructionsAr: string[];
  level: number | null;
  videoUrl: string;
  imageUrl: string;
  isActive: boolean;
  force: number | null;
  mechanic: number | null;
  category: number | null;
  equipmentEn: string;
  equipmentAr: string;
  primaryMuscleGroups: MuscleGroup[];
  secondaryMuscleGroups: MuscleGroup[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

export interface WorkoutDay {
  id: string;
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  daysPerWeek: number;
  days: WorkoutDay[];
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}
