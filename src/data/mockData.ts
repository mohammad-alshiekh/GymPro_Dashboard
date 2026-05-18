import type {
  User, UserDetail, TrainerApplication, Gym, GymApplication,
  Transaction, Challenge, PointRule, LevelThreshold,
  SubscriptionPlan, GymMember, AttendanceRecord, Review, Offer,
  Exercise, WorkoutPlan
} from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'John Smith', email: 'john.smith@email.com', role: 'trainee', status: 'active' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'trainee', status: 'active' },
  { id: 'u3', name: 'Mike Wilson', email: 'mike.w@email.com', role: 'trainer', status: 'active' },
  { id: 'u4', name: 'Emily Davis', email: 'emily.d@email.com', role: 'trainee', status: 'inactive' },
  { id: 'u5', name: 'Chris Brown', email: 'chris.b@email.com', role: 'trainer', status: 'active' },
  { id: 'u6', name: 'Jessica Lee', email: 'jessica.l@email.com', role: 'trainee', status: 'active' },
  { id: 'u7', name: 'David Martinez', email: 'david.m@email.com', role: 'trainee', status: 'active' },
  { id: 'u8', name: 'Ashley Taylor', email: 'ashley.t@email.com', role: 'trainer', status: 'inactive' },
  { id: 'u9', name: 'Ryan Anderson', email: 'ryan.a@email.com', role: 'trainee', status: 'active' },
  { id: 'u10', name: 'Amanda White', email: 'amanda.w@email.com', role: 'trainee', status: 'active' },
  { id: 'u11', name: 'James Thomas', email: 'james.t@email.com', role: 'trainee', status: 'inactive' },
  { id: 'u12', name: 'Lisa Jackson', email: 'lisa.j@email.com', role: 'trainer', status: 'active' },
  { id: 'u13', name: 'Robert Harris', email: 'robert.h@email.com', role: 'trainee', status: 'active' },
  { id: 'u14', name: 'Megan Clark', email: 'megan.c@email.com', role: 'trainee', status: 'active' },
  { id: 'u15', name: 'Daniel Lewis', email: 'daniel.l@email.com', role: 'trainee', status: 'active' },
  { id: 'u16', name: 'Sophia Walker', email: 'sophia.w@email.com', role: 'trainee', status: 'inactive' },
  { id: 'u17', name: 'Kevin Robinson', email: 'kevin.r@email.com', role: 'trainer', status: 'active' },
  { id: 'u18', name: 'Rachel Hall', email: 'rachel.h@email.com', role: 'trainee', status: 'active' },
  { id: 'u19', name: 'Brandon Young', email: 'brandon.y@email.com', role: 'trainee', status: 'active' },
  { id: 'u20', name: 'Nicole King', email: 'nicole.k@email.com', role: 'trainee', status: 'active' },
];

export const mockUserDetails: Record<string, UserDetail> = {
  u1: {
    id: 'u1', name: 'John Smith', email: 'john.smith@email.com', role: 'trainee', status: 'active',
    personalInfo: { gender: 'Male', weightKg: 82, heightCm: 178, age: 29, fitnessLevel: 'Intermediate', fitnessGoal: 'Muscle Gain', equipment: ['Dumbbells', 'Barbell', 'Bench'] },
    activityLog: [
      { type: 'workout', timestamp: '2025-01-14T08:30:00Z', details: 'Completed Upper Body workout (45 min)' },
      { type: 'meal', timestamp: '2025-01-14T12:00:00Z', details: 'Logged lunch - Grilled chicken salad (450 kcal)' },
      { type: 'workout', timestamp: '2025-01-13T07:00:00Z', details: 'Completed Cardio session (30 min)' },
    ],
    subscriptions: [
      { subscriptionId: 'sub1', type: 'Monthly', startDate: '2025-01-01', endDate: '2025-02-01', status: 'active' },
    ],
  },
  u2: {
    id: 'u2', name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'trainee', status: 'active',
    personalInfo: { gender: 'Female', weightKg: 60, heightCm: 165, age: 26, fitnessLevel: 'Advanced', fitnessGoal: 'Endurance', equipment: ['Treadmill', 'Resistance Bands'] },
    activityLog: [
      { type: 'workout', timestamp: '2025-01-14T06:00:00Z', details: 'Completed HIIT session (40 min)' },
      { type: 'workout', timestamp: '2025-01-13T06:00:00Z', details: 'Completed Yoga session (60 min)' },
    ],
    subscriptions: [
      { subscriptionId: 'sub2', type: 'Annual', startDate: '2024-06-01', endDate: '2025-06-01', status: 'active' },
    ],
  },
};

export const mockTrainerApplications: TrainerApplication[] = [
  { id: 'ta1', name: 'Marcus Thompson', email: 'marcus.t@email.com', appliedDate: '2025-01-10', status: 'pending', specialization: 'Strength & Conditioning', experience: '8 years' },
  { id: 'ta2', name: 'Olivia Chen', email: 'olivia.c@email.com', appliedDate: '2025-01-08', status: 'pending', specialization: 'Yoga & Pilates', experience: '5 years' },
  { id: 'ta3', name: 'Tyler Brooks', email: 'tyler.b@email.com', appliedDate: '2025-01-05', status: 'pending', specialization: 'CrossFit', experience: '6 years' },
  { id: 'ta4', name: 'Hannah Reid', email: 'hannah.r@email.com', appliedDate: '2024-12-20', status: 'approved', specialization: 'Nutrition & Wellness', experience: '10 years' },
  { id: 'ta5', name: 'Derek Miles', email: 'derek.m@email.com', appliedDate: '2024-12-15', status: 'rejected', specialization: 'Bodybuilding', experience: '3 years', reason: 'Insufficient certification documentation.' },
];

export const mockGyms: Gym[] = [
  {
    id: 'g1', name: 'FitZone Downtown', location: '123 Main St, New York, NY 10001',
    services: ['Weight Training', 'Cardio', 'Swimming Pool', 'Sauna', 'Personal Training'],
    operatingHours: { monday: '5:00 AM - 11:00 PM', tuesday: '5:00 AM - 11:00 PM', wednesday: '5:00 AM - 11:00 PM', thursday: '5:00 AM - 11:00 PM', friday: '5:00 AM - 10:00 PM', saturday: '6:00 AM - 9:00 PM', sunday: '7:00 AM - 8:00 PM' },
    images: [], contactEmail: 'info@fitzone.com', contactPhone: '+1 (212) 555-0101',
    status: 'active', memberCount: 342,
  },
  {
    id: 'g2', name: 'IronWorks Gym', location: '456 Oak Ave, Los Angeles, CA 90001',
    services: ['Weight Training', 'Boxing', 'CrossFit', 'Spin Classes'],
    operatingHours: { monday: '6:00 AM - 10:00 PM', tuesday: '6:00 AM - 10:00 PM', wednesday: '6:00 AM - 10:00 PM', thursday: '6:00 AM - 10:00 PM', friday: '6:00 AM - 9:00 PM', saturday: '7:00 AM - 8:00 PM', sunday: '8:00 AM - 6:00 PM' },
    images: [], contactEmail: 'hello@ironworks.com', contactPhone: '+1 (310) 555-0202',
    status: 'active', memberCount: 215,
  },
  {
    id: 'g3', name: 'ZenFit Studio', location: '789 Elm St, Chicago, IL 60601',
    services: ['Yoga', 'Pilates', 'Meditation', 'Barre'],
    operatingHours: { monday: '6:00 AM - 9:00 PM', tuesday: '6:00 AM - 9:00 PM', wednesday: '6:00 AM - 9:00 PM', thursday: '6:00 AM - 9:00 PM', friday: '6:00 AM - 8:00 PM', saturday: '7:00 AM - 7:00 PM', sunday: '8:00 AM - 6:00 PM' },
    images: [], contactEmail: 'info@zenfit.com', contactPhone: '+1 (312) 555-0303',
    status: 'active', memberCount: 178,
  },
  {
    id: 'g4', name: 'PowerHouse Fitness', location: '321 Pine Rd, Houston, TX 77001',
    services: ['Weight Training', 'Cardio', 'Personal Training', 'Nutrition Counseling'],
    operatingHours: { monday: '5:00 AM - 11:00 PM', tuesday: '5:00 AM - 11:00 PM', wednesday: '5:00 AM - 11:00 PM', thursday: '5:00 AM - 11:00 PM', friday: '5:00 AM - 10:00 PM', saturday: '6:00 AM - 9:00 PM', sunday: '7:00 AM - 7:00 PM' },
    images: [], contactEmail: 'contact@powerhouse.com', contactPhone: '+1 (713) 555-0404',
    status: 'active', memberCount: 289,
  },
  {
    id: 'g5', name: 'AquaGym Center', location: '654 Beach Blvd, Miami, FL 33101',
    services: ['Swimming Pool', 'Water Aerobics', 'Sauna', 'Cardio', 'Weight Training'],
    operatingHours: { monday: '5:30 AM - 10:00 PM', tuesday: '5:30 AM - 10:00 PM', wednesday: '5:30 AM - 10:00 PM', thursday: '5:30 AM - 10:00 PM', friday: '5:30 AM - 9:00 PM', saturday: '6:00 AM - 8:00 PM', sunday: '7:00 AM - 7:00 PM' },
    images: [], contactEmail: 'info@aquagym.com', contactPhone: '+1 (305) 555-0505',
    status: 'inactive', memberCount: 156,
  },
];

export const mockGymApplications: GymApplication[] = [
  { id: 'ga1', gymName: 'FlexFit Arena', ownerName: 'Victor Santos', email: 'victor@flexfit.com', location: '100 Broadway, San Francisco, CA 94105', appliedDate: '2025-01-12', status: 'pending' },
  { id: 'ga2', gymName: 'Peak Performance Gym', ownerName: 'Diana Foster', email: 'diana@peakperf.com', location: '200 Sunset Blvd, Phoenix, AZ 85001', appliedDate: '2025-01-09', status: 'pending' },
  { id: 'ga3', gymName: 'Urban Fitness Hub', ownerName: 'Nathan Cross', email: 'nathan@urbanfit.com', location: '350 Market St, Seattle, WA 98101', appliedDate: '2025-01-03', status: 'pending' },
];

export const mockTransactions: Transaction[] = [
  { transactionId: 't1', userId: 'u1', userName: 'John Smith', gymId: 'g1', gymName: 'FitZone Downtown', amount: 49.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-14T10:30:00Z', status: 'completed' },
  { transactionId: 't2', userId: 'u2', userName: 'Sarah Johnson', gymId: 'g1', gymName: 'FitZone Downtown', amount: 399.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-13T14:20:00Z', status: 'completed' },
  { transactionId: 't3', userId: 'u3', userName: 'Mike Wilson', gymId: 'g2', gymName: 'IronWorks Gym', amount: 75.00, currency: 'USD', type: 'trainerPayment', timestamp: '2025-01-12T09:00:00Z', status: 'completed' },
  { transactionId: 't4', userId: 'u6', userName: 'Jessica Lee', gymId: 'g1', gymName: 'FitZone Downtown', amount: 49.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-11T16:45:00Z', status: 'completed' },
  { transactionId: 't5', userId: 'u7', userName: 'David Martinez', gymId: 'g3', gymName: 'ZenFit Studio', amount: 89.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-10T11:15:00Z', status: 'pending' },
  { transactionId: 't6', userId: 'u5', userName: 'Chris Brown', gymId: 'g4', gymName: 'PowerHouse Fitness', amount: 120.00, currency: 'USD', type: 'trainerPayment', timestamp: '2025-01-09T08:30:00Z', status: 'completed' },
  { transactionId: 't7', userId: 'u4', userName: 'Emily Davis', gymId: 'g1', gymName: 'FitZone Downtown', amount: 49.99, currency: 'USD', type: 'refund', timestamp: '2025-01-08T13:00:00Z', status: 'completed' },
  { transactionId: 't8', userId: 'u9', userName: 'Ryan Anderson', gymId: 'g2', gymName: 'IronWorks Gym', amount: 59.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-07T10:00:00Z', status: 'completed' },
  { transactionId: 't9', userId: 'u10', userName: 'Amanda White', gymId: 'g4', gymName: 'PowerHouse Fitness', amount: 199.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-06T15:30:00Z', status: 'completed' },
  { transactionId: 't10', userId: 'u12', userName: 'Lisa Jackson', gymId: 'g3', gymName: 'ZenFit Studio', amount: 95.00, currency: 'USD', type: 'trainerPayment', timestamp: '2025-01-05T09:45:00Z', status: 'pending' },
  { transactionId: 't11', userId: 'u13', userName: 'Robert Harris', gymId: 'g1', gymName: 'FitZone Downtown', amount: 49.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-04T12:00:00Z', status: 'completed' },
  { transactionId: 't12', userId: 'u14', userName: 'Megan Clark', gymId: 'g5', gymName: 'AquaGym Center', amount: 69.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-03T14:30:00Z', status: 'failed' },
  { transactionId: 't13', userId: 'u15', userName: 'Daniel Lewis', gymId: 'g2', gymName: 'IronWorks Gym', amount: 49.99, currency: 'USD', type: 'subscription', timestamp: '2025-01-02T08:00:00Z', status: 'completed' },
  { transactionId: 't14', userId: 'u17', userName: 'Kevin Robinson', gymId: 'g4', gymName: 'PowerHouse Fitness', amount: 150.00, currency: 'USD', type: 'trainerPayment', timestamp: '2025-01-01T10:00:00Z', status: 'completed' },
  { transactionId: 't15', userId: 'u18', userName: 'Rachel Hall', gymId: 'g1', gymName: 'FitZone Downtown', amount: 399.99, currency: 'USD', type: 'subscription', timestamp: '2024-12-30T11:00:00Z', status: 'completed' },
];

export const mockChallenges: Challenge[] = [
  { id: 'ch1', name: '30-Day Push-Up Challenge', description: 'Complete 100 push-ups daily for 30 days to build upper body strength and endurance.', type: 'training', startDate: '2025-01-01', endDate: '2025-01-30', rewards: { points: 500, badges: ['Push-Up Master'] }, participantCount: 128 },
  { id: 'ch2', name: 'Calorie Burn Blitz', description: 'Burn at least 500 calories per day through any exercise activity.', type: 'calorieBurn', startDate: '2025-01-10', endDate: '2025-02-10', rewards: { points: 750, badges: ['Calorie Crusher', 'Blitz Runner'] }, participantCount: 95 },
  { id: 'ch3', name: 'Consistency King', description: 'Visit the gym at least 5 days a week for 4 consecutive weeks.', type: 'commitment', startDate: '2025-01-15', endDate: '2025-02-12', rewards: { points: 1000, badges: ['Consistency King'] }, participantCount: 67 },
  { id: 'ch4', name: 'Marathon Prep', description: 'Run a total of 100 miles over 30 days in preparation for marathon season.', type: 'training', startDate: '2024-12-01', endDate: '2024-12-31', rewards: { points: 600, badges: ['Road Warrior'] }, participantCount: 210 },
  { id: 'ch5', name: 'Holiday Burn', description: 'Maintain your workout routine during the holiday season. Minimum 3 sessions per week.', type: 'commitment', startDate: '2024-12-15', endDate: '2025-01-05', rewards: { points: 400, badges: ['Holiday Hero'] }, participantCount: 156 },
];

export const mockPointRules: PointRule[] = [
  { activity: 'Complete Workout', pointsAwarded: 50 },
  { activity: 'Log Meal', pointsAwarded: 10 },
  { activity: 'Hit Step Goal', pointsAwarded: 25 },
  { activity: 'Complete Challenge', pointsAwarded: 200 },
  { activity: 'Attend Class', pointsAwarded: 75 },
  { activity: 'Refer a Friend', pointsAwarded: 150 },
];

export const mockLevelThresholds: LevelThreshold[] = [
  { level: 1, minPoints: 0, title: 'Beginner' },
  { level: 2, minPoints: 500, title: 'Novice' },
  { level: 3, minPoints: 1500, title: 'Intermediate' },
  { level: 4, minPoints: 3000, title: 'Advanced' },
  { level: 5, minPoints: 6000, title: 'Expert' },
  { level: 6, minPoints: 10000, title: 'Master' },
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  { id: 'sp1', gymId: 'g1', name: 'Basic Monthly', durationDays: 30, price: 49.99, features: ['Gym Access', 'Locker Room', 'Basic Equipment'] },
  { id: 'sp2', gymId: 'g1', name: 'Premium Monthly', durationDays: 30, price: 79.99, features: ['Full Gym Access', 'Group Classes', 'Sauna & Pool', 'Locker Room'] },
  { id: 'sp3', gymId: 'g1', name: 'Annual Plan', durationDays: 365, price: 399.99, features: ['Full Gym Access', 'All Classes', 'Pool & Sauna', 'Personal Trainer (2 sessions)', 'Priority Booking'] },
  { id: 'sp4', gymId: 'g1', name: 'VIP Pass', durationDays: 90, price: 199.99, features: ['Unlimited Access', 'All Classes', 'Pool & Sauna', 'Personal Trainer (4 sessions)', 'Nutrition Plan', 'Priority Support'] },
  { id: 'sp5', gymId: 'g2', name: 'Monthly', durationDays: 30, price: 39.99, features: ['Gym Access', 'Locker Room'] },
  { id: 'sp6', gymId: 'g2', name: 'Premium', durationDays: 30, price: 69.99, features: ['Full Access', 'Classes', 'Spinning'] },
];

export const mockMembers: GymMember[] = [
  { id: 'u1', name: 'John Smith', email: 'john.smith@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-02-01', subscriptionDetails: [{ subscriptionId: 'sub1', planName: 'Premium Monthly', startDate: '2025-01-01', endDate: '2025-02-01', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-14T08:30:00Z', exitTime: '2025-01-14T10:15:00Z' }, { entryTime: '2025-01-13T07:00:00Z', exitTime: '2025-01-13T08:30:00Z' }] },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah.j@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-06-01', subscriptionDetails: [{ subscriptionId: 'sub2', planName: 'Annual Plan', startDate: '2024-06-01', endDate: '2025-06-01', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-14T06:00:00Z', exitTime: '2025-01-14T07:30:00Z' }, { entryTime: '2025-01-12T06:00:00Z', exitTime: '2025-01-12T07:00:00Z' }] },
  { id: 'u6', name: 'Jessica Lee', email: 'jessica.l@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-02-10', subscriptionDetails: [{ subscriptionId: 'sub3', planName: 'Basic Monthly', startDate: '2025-01-10', endDate: '2025-02-10', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-13T17:00:00Z', exitTime: '2025-01-13T18:30:00Z' }] },
  { id: 'u7', name: 'David Martinez', email: 'david.m@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-02-15', subscriptionDetails: [{ subscriptionId: 'sub4', planName: 'VIP Pass', startDate: '2024-11-15', endDate: '2025-02-15', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-14T09:00:00Z', exitTime: null }] },
  { id: 'u9', name: 'Ryan Anderson', email: 'ryan.a@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-01-20', subscriptionDetails: [{ subscriptionId: 'sub5', planName: 'Basic Monthly', startDate: '2024-12-20', endDate: '2025-01-20', status: 'active' }], attendanceLog: [] },
  { id: 'u10', name: 'Amanda White', email: 'amanda.w@email.com', subscriptionStatus: 'expired', subscriptionEndDate: '2024-12-31', subscriptionDetails: [{ subscriptionId: 'sub6', planName: 'Premium Monthly', startDate: '2024-12-01', endDate: '2024-12-31', status: 'expired' }], attendanceLog: [{ entryTime: '2024-12-28T10:00:00Z', exitTime: '2024-12-28T11:30:00Z' }] },
  { id: 'u13', name: 'Robert Harris', email: 'robert.h@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-01-25', subscriptionDetails: [{ subscriptionId: 'sub7', planName: 'Basic Monthly', startDate: '2024-12-25', endDate: '2025-01-25', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-14T06:30:00Z', exitTime: '2025-01-14T08:00:00Z' }] },
  { id: 'u14', name: 'Megan Clark', email: 'megan.c@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-03-01', subscriptionDetails: [{ subscriptionId: 'sub8', planName: 'Annual Plan', startDate: '2024-03-01', endDate: '2025-03-01', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-13T18:00:00Z', exitTime: '2025-01-13T19:30:00Z' }] },
  { id: 'u15', name: 'Daniel Lewis', email: 'daniel.l@email.com', subscriptionStatus: 'cancelled', subscriptionEndDate: '2024-11-15', subscriptionDetails: [{ subscriptionId: 'sub9', planName: 'Premium Monthly', startDate: '2024-10-15', endDate: '2024-11-15', status: 'cancelled' }], attendanceLog: [] },
  { id: 'u18', name: 'Rachel Hall', email: 'rachel.h@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-12-30', subscriptionDetails: [{ subscriptionId: 'sub10', planName: 'Annual Plan', startDate: '2024-12-30', endDate: '2025-12-30', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-14T07:00:00Z', exitTime: '2025-01-14T08:45:00Z' }] },
  { id: 'u19', name: 'Brandon Young', email: 'brandon.y@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-02-05', subscriptionDetails: [{ subscriptionId: 'sub11', planName: 'Basic Monthly', startDate: '2025-01-05', endDate: '2025-02-05', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-14T16:00:00Z', exitTime: null }] },
  { id: 'u20', name: 'Nicole King', email: 'nicole.k@email.com', subscriptionStatus: 'active', subscriptionEndDate: '2025-04-01', subscriptionDetails: [{ subscriptionId: 'sub12', planName: 'VIP Pass', startDate: '2025-01-01', endDate: '2025-04-01', status: 'active' }], attendanceLog: [{ entryTime: '2025-01-13T08:00:00Z', exitTime: '2025-01-13T09:30:00Z' }] },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 'att1', memberId: 'u1', memberName: 'John Smith', entryTime: '2025-01-14T08:30:00Z', exitTime: '2025-01-14T10:15:00Z' },
  { id: 'att2', memberId: 'u2', memberName: 'Sarah Johnson', entryTime: '2025-01-14T06:00:00Z', exitTime: '2025-01-14T07:30:00Z' },
  { id: 'att3', memberId: 'u7', memberName: 'David Martinez', entryTime: '2025-01-14T09:00:00Z', exitTime: null },
  { id: 'att4', memberId: 'u13', memberName: 'Robert Harris', entryTime: '2025-01-14T06:30:00Z', exitTime: '2025-01-14T08:00:00Z' },
  { id: 'att5', memberId: 'u18', memberName: 'Rachel Hall', entryTime: '2025-01-14T07:00:00Z', exitTime: '2025-01-14T08:45:00Z' },
  { id: 'att6', memberId: 'u19', memberName: 'Brandon Young', entryTime: '2025-01-14T16:00:00Z', exitTime: null },
  { id: 'att7', memberId: 'u1', memberName: 'John Smith', entryTime: '2025-01-13T07:00:00Z', exitTime: '2025-01-13T08:30:00Z' },
  { id: 'att8', memberId: 'u2', memberName: 'Sarah Johnson', entryTime: '2025-01-12T06:00:00Z', exitTime: '2025-01-12T07:00:00Z' },
  { id: 'att9', memberId: 'u6', memberName: 'Jessica Lee', entryTime: '2025-01-13T17:00:00Z', exitTime: '2025-01-13T18:30:00Z' },
  { id: 'att10', memberId: 'u14', memberName: 'Megan Clark', entryTime: '2025-01-13T18:00:00Z', exitTime: '2025-01-13T19:30:00Z' },
  { id: 'att11', memberId: 'u20', memberName: 'Nicole King', entryTime: '2025-01-13T08:00:00Z', exitTime: '2025-01-13T09:30:00Z' },
  { id: 'att12', memberId: 'u1', memberName: 'John Smith', entryTime: '2025-01-12T08:00:00Z', exitTime: '2025-01-12T09:30:00Z' },
  { id: 'att13', memberId: 'u7', memberName: 'David Martinez', entryTime: '2025-01-12T10:00:00Z', exitTime: '2025-01-12T12:00:00Z' },
  { id: 'att14', memberId: 'u18', memberName: 'Rachel Hall', entryTime: '2025-01-12T07:00:00Z', exitTime: '2025-01-12T08:00:00Z' },
  { id: 'att15', memberId: 'u13', memberName: 'Robert Harris', entryTime: '2025-01-11T06:30:00Z', exitTime: '2025-01-11T08:00:00Z' },
];

export const mockReviews: Review[] = [
  { reviewId: 'r1', memberId: 'u1', memberName: 'John Smith', rating: 5, comment: 'Amazing gym! The equipment is top-notch and the staff is incredibly friendly. The pool area is always clean and well-maintained.', submittedAt: '2025-01-13T10:00:00Z', response: null },
  { reviewId: 'r2', memberId: 'u2', memberName: 'Sarah Johnson', rating: 4, comment: 'Great atmosphere and variety of classes. Would love to see more yoga sessions in the evening schedule.', submittedAt: '2025-01-12T14:30:00Z', response: { managerId: 'gm-1', responseText: 'Thank you for the feedback, Sarah! We\'re adding two more evening yoga sessions starting next month.', respondedAt: '2025-01-12T16:00:00Z' } },
  { reviewId: 'r3', memberId: 'u6', memberName: 'Jessica Lee', rating: 5, comment: 'Best gym in the area. The personal trainers are very knowledgeable and the facilities are always spotless.', submittedAt: '2025-01-11T09:00:00Z', response: null },
  { reviewId: 'r4', memberId: 'u9', memberName: 'Ryan Anderson', rating: 3, comment: 'Decent gym but can get very crowded during peak hours. Sometimes have to wait for machines.', submittedAt: '2025-01-10T11:00:00Z', response: { managerId: 'gm-1', responseText: 'We appreciate your honest feedback, Ryan. We\'re looking into expanding our floor space and adding more equipment to reduce wait times.', respondedAt: '2025-01-10T14:00:00Z' } },
  { reviewId: 'r5', memberId: 'u13', memberName: 'Robert Harris', rating: 4, comment: 'Really enjoy the early morning hours. The sauna is a great bonus after a tough workout.', submittedAt: '2025-01-09T08:00:00Z', response: null },
  { reviewId: 'r6', memberId: 'u14', memberName: 'Megan Clark', rating: 2, comment: 'The locker rooms could be cleaner. Also, some of the cardio machines need maintenance.', submittedAt: '2025-01-08T16:00:00Z', response: null },
  { reviewId: 'r7', memberId: 'u18', memberName: 'Rachel Hall', rating: 5, comment: 'Love the community feel at this gym. The group classes are fantastic and the instructors are motivating!', submittedAt: '2025-01-07T12:00:00Z', response: { managerId: 'gm-1', responseText: 'Thank you Rachel! We love having you as part of our community!', respondedAt: '2025-01-07T13:30:00Z' } },
  { reviewId: 'r8', memberId: 'u20', memberName: 'Nicole King', rating: 4, comment: 'Great value for the VIP pass. The nutrition plan included is very helpful.', submittedAt: '2025-01-06T10:00:00Z', response: null },
];

export const mockOffers: Offer[] = [
  { id: 'of1', title: 'New Year Special', description: 'Start your fitness journey with 20% off all annual plans!', discountPercentage: 20, startDate: '2025-01-01', endDate: '2025-01-31' },
  { id: 'of2', title: 'Bring a Friend', description: 'Refer a friend and both get 15% off next month\'s subscription.', discountPercentage: 15, startDate: '2025-01-15', endDate: '2025-02-15' },
  { id: 'of3', title: 'Summer Prep', description: 'Get summer-ready with 10% off premium memberships.', discountPercentage: 10, startDate: '2025-03-01', endDate: '2025-04-30' },
];

export const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    nameEn: 'Barbell Back Squat',
    nameAr: 'سكوات خلفي بالبار',
    descriptionEn: 'The king of lower body exercises. A compound movement that targets multiple muscle groups simultaneously.',
    descriptionAr: 'ملك تمارين الجزء السفلي من الجسم. حركة مركبة تستهدف مجموعات عضلية متعددة في آن واحد.',
    instructionsEn: [
      'Position barbell on upper traps, grip outside shoulders',
      'Unrack and step back, feet shoulder-width apart, toes slightly out',
      'Brace core, initiate descent by pushing hips back and bending knees',
      'Lower until thighs are parallel to the ground or below',
      'Drive through midfoot to return to standing position',
    ],
    instructionsAr: [
      'ضع البار على العضلات العلوية للظهر، وامسك به من الخارج',
      'ارفع البار وتراجع للخلف، اجعل قدميك بعرض الكتفين',
      'شد عضلات البطن، ابدأ النزول بدفع الوركين للخلف وثني الركبتين',
      'انزل حتى تصبح الفخذين موازية للأرض أو أقل',
      'ادفع بمنتصف القدم للعودة لوضعية الوقوف',
    ],
    level: 2,
    videoUrl: 'https://example.com/squat-video',
    imageUrl: 'https://example.com/squat-image',
    isActive: true,
    force: 1,
    mechanic: 1,
    category: 1,
    equipmentEn: 'Barbell, Squat Rack',
    equipmentAr: 'بار، حامل سكوات',
    primaryMuscleGroups: [
      { id: 'mg1', nameEn: 'Quadriceps', nameAr: 'عضلة الفخذ الأمامية' },
      { id: 'mg2', nameEn: 'Glutes', nameAr: 'عضلات المؤخرة' }
    ],
    secondaryMuscleGroups: [
      { id: 'mg3', nameEn: 'Hamstrings', nameAr: 'عضلة الفخذ الخلفية' },
      { id: 'mg4', nameEn: 'Core', nameAr: 'عضلات البطن' }
    ],
  },
  {
    id: 'ex2',
    nameEn: 'Bench Press',
    nameAr: 'بنش برس',
    descriptionEn: 'A fundamental upper body pressing exercise that builds chest, shoulder, and tricep strength.',
    descriptionAr: 'تمرين أساسي لضغط الجزء العلوي من الجسم يبني قوة الصدر والكتف والترايسبس.',
    instructionsEn: [
      'Lie flat on bench, grip barbell slightly wider than shoulder width',
      'Unrack the bar with arms locked over the chest',
      'Lower the bar to mid-chest, keeping elbows at 45 degrees',
      'Press the bar back up to starting position',
      'Keep feet flat on floor and maintain a slight arch in lower back',
    ],
    instructionsAr: [
      'استلقِ بشكل مسطح على المقعد، امسك البار بعرض أكبر قليلاً من عرض الكتفين',
      'ارفع البار مع قفل الذراعين فوق الصدر',
      'اخفض البار إلى منتصف الصدر، مع الحفاظ على المرفقين بزاوية 45 درجة',
      'اضغط على البار مرة أخرى إلى وضع البداية',
      'حافظ على قدميك مسطحة على الأرض وحافظ على قوس طفيف في أسفل الظهر',
    ],
    level: 2,
    videoUrl: 'https://example.com/bench-video',
    imageUrl: 'https://example.com/bench-image',
    isActive: true,
    force: 1,
    mechanic: 1,
    category: 1,
    equipmentEn: 'Barbell, Bench',
    equipmentAr: 'بار، بنش',
    primaryMuscleGroups: [
      { id: 'mg5', nameEn: 'Chest', nameAr: 'الصدر' }
    ],
    secondaryMuscleGroups: [
      { id: 'mg6', nameEn: 'Triceps', nameAr: 'ترايسبس' },
      { id: 'mg7', nameEn: 'Anterior Deltoids', nameAr: 'الأكتاف الأمامية' }
    ],
  },
  {
    id: 'ex3',
    nameEn: 'Deadlift',
    nameAr: 'ديدليفت',
    descriptionEn: 'The ultimate full-body compound lift. Develops posterior chain strength and total body power.',
    descriptionAr: 'تمرين مركب لكامل الجسم. يطور قوة السلسلة الخلفية وقوة الجسم الإجمالية.',
    instructionsEn: [
      'Stand with feet hip-width apart, barbell over midfoot',
      'Hinge at hips, bend knees slightly, grip bar just outside knees',
      'Drop hips, lift chest, engage lats — create tension',
      'Drive through the floor, keeping bar close to body',
      'Lock out by standing tall with hips extended. Reverse to lower.',
    ],
    instructionsAr: [
      'قف مع جعل القدمين بعرض الوركين، والبار فوق منتصف القدم',
      'انحنِ عند الوركين، واثنِ الركبتين قليلاً، وأمسك البار خارج الركبتين مباشرة',
      'اخفض الوركين، وارفع الصدر، وشغل عضلات الظهر - اخلق توتراً',
      'ادفع من خلال الأرض، مع الحفاظ على البار قريباً من الجسم',
      'اقفل الحركة بالوقوف طويلاً مع تمديد الوركين. اعكس الحركة للنزول.',
    ],
    level: 3,
    videoUrl: 'https://example.com/deadlift-video',
    imageUrl: 'https://example.com/deadlift-image',
    isActive: true,
    force: 1,
    mechanic: 1,
    category: 1,
    equipmentEn: 'Barbell',
    equipmentAr: 'بار',
    primaryMuscleGroups: [
      { id: 'mg3', nameEn: 'Hamstrings', nameAr: 'عضلة الفخذ الخلفية' },
      { id: 'mg2', nameEn: 'Glutes', nameAr: 'عضلات المؤخرة' }
    ],
    secondaryMuscleGroups: [
      { id: 'mg8', nameEn: 'Erector Spinae', nameAr: 'عضلات أسفل الظهر' },
      { id: 'mg9', nameEn: 'Traps', nameAr: 'الترابيس' }
    ],
  },
];

export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'wp1',
    name: 'Full Body Strength Builder',
    description: 'A comprehensive full body program designed to build overall strength and muscle. Suitable for intermediate lifters who can train 3 days per week.',
    level: 'intermediate',
    goal: 'Strength & Muscle Gain',
    daysPerWeek: 3,
    status: 'active',
    createdAt: '2024-08-01',
    updatedAt: '2025-01-10',
    days: [
      {
        id: 'wd1',
        day: 'Tuesday',
        focus: 'Full Body',
        exercises: [
          { id: 'we1', name: 'Barbell Step Ups', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we2', name: 'Deadlift with Bands', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we3', name: 'Reverse Band Deadlift', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we4', name: 'Barbell Deadlift', sets: '3', reps: '10-12', rest: '60s' },
        ],
      },
      {
        id: 'wd2',
        day: 'Thursday',
        focus: 'Full Body',
        exercises: [
          { id: 'we5', name: 'Barbell Deadlift', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we6', name: 'Standing Palms-Up Barbell Behind The Back Wrist Curl', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we7', name: 'Sumo Deadlift with Bands', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we8', name: 'Dumbbell Step Ups', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we9', name: 'Reverse Band Sumo Deadlift', sets: '3', reps: '10-12', rest: '60s' },
        ],
      },
      {
        id: 'wd3',
        day: 'Sunday',
        focus: 'Full Body',
        exercises: [
          { id: 'we10', name: 'Dumbbell Step Ups', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we11', name: 'Reverse Band Sumo Deadlift', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we12', name: 'Barbell Step Ups', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we13', name: 'Deadlift with Bands', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we14', name: 'Reverse Band Deadlift', sets: '3', reps: '10-12', rest: '60s' },
        ],
      },
    ],
  },
  {
    id: 'wp2',
    name: 'Push Pull Legs (PPL)',
    description: 'A classic 6-day PPL split that targets all muscle groups with optimal frequency. Best for advanced lifters seeking maximum hypertrophy.',
    level: 'advanced',
    goal: 'Hypertrophy',
    daysPerWeek: 6,
    status: 'active',
    createdAt: '2024-07-15',
    updatedAt: '2025-01-05',
    days: [
      {
        id: 'wd4',
        day: 'Monday',
        focus: 'Push (Chest, Shoulders, Triceps)',
        exercises: [
          { id: 'we15', name: 'Barbell Bench Press', sets: '4', reps: '6-8', rest: '120s' },
          { id: 'we16', name: 'Incline Dumbbell Press', sets: '3', reps: '10-12', rest: '90s' },
          { id: 'we17', name: 'Overhead Press', sets: '3', reps: '8-10', rest: '90s' },
          { id: 'we18', name: 'Cable Flyes', sets: '3', reps: '12-15', rest: '60s' },
          { id: 'we19', name: 'Tricep Pushdowns', sets: '3', reps: '12-15', rest: '60s' },
          { id: 'we20', name: 'Lateral Raises', sets: '4', reps: '12-15', rest: '45s' },
        ],
      },
      {
        id: 'wd5',
        day: 'Tuesday',
        focus: 'Pull (Back, Biceps)',
        exercises: [
          { id: 'we21', name: 'Barbell Row', sets: '4', reps: '6-8', rest: '120s' },
          { id: 'we22', name: 'Weighted Pull-Ups', sets: '4', reps: '6-8', rest: '120s' },
          { id: 'we23', name: 'Cable Face Pulls', sets: '3', reps: '15-20', rest: '60s' },
          { id: 'we24', name: 'Barbell Curls', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we25', name: 'Hammer Curls', sets: '3', reps: '10-12', rest: '60s' },
        ],
      },
      {
        id: 'wd6',
        day: 'Wednesday',
        focus: 'Legs',
        exercises: [
          { id: 'we26', name: 'Barbell Back Squat', sets: '4', reps: '6-8', rest: '180s' },
          { id: 'we27', name: 'Romanian Deadlift', sets: '3', reps: '10-12', rest: '90s' },
          { id: 'we28', name: 'Leg Press', sets: '3', reps: '12-15', rest: '90s' },
          { id: 'we29', name: 'Leg Curls', sets: '3', reps: '12-15', rest: '60s' },
          { id: 'we30', name: 'Calf Raises', sets: '4', reps: '15-20', rest: '45s' },
        ],
      },
      {
        id: 'wd7',
        day: 'Thursday',
        focus: 'Push (Chest, Shoulders, Triceps)',
        exercises: [
          { id: 'we31', name: 'Dumbbell Bench Press', sets: '4', reps: '8-10', rest: '90s' },
          { id: 'we32', name: 'Dip (Weighted)', sets: '3', reps: '8-10', rest: '90s' },
          { id: 'we33', name: 'Arnold Press', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we34', name: 'Pec Deck Flyes', sets: '3', reps: '12-15', rest: '60s' },
          { id: 'we35', name: 'Overhead Tricep Extension', sets: '3', reps: '12-15', rest: '60s' },
        ],
      },
      {
        id: 'wd8',
        day: 'Friday',
        focus: 'Pull (Back, Biceps)',
        exercises: [
          { id: 'we36', name: 'Deadlift', sets: '4', reps: '5', rest: '180s' },
          { id: 'we37', name: 'Cable Row', sets: '3', reps: '10-12', rest: '90s' },
          { id: 'we38', name: 'Lat Pulldown', sets: '3', reps: '10-12', rest: '90s' },
          { id: 'we39', name: 'Preacher Curls', sets: '3', reps: '10-12', rest: '60s' },
          { id: 'we40', name: 'Concentration Curls', sets: '3', reps: '12-15', rest: '60s' },
        ],
      },
      {
        id: 'wd9',
        day: 'Saturday',
        focus: 'Legs',
        exercises: [
          { id: 'we41', name: 'Leg Extensions', sets: '3', reps: '15-20', rest: '60s' },
          { id: 'we42', name: 'Stiff Leg Deadlift', sets: '3', reps: '10-12', rest: '90s' },
          { id: 'we43', name: 'Hack Squat', sets: '3', reps: '10-12', rest: '120s' },
          { id: 'we44', name: 'Seated Calf Raises', sets: '4', reps: '15-20', rest: '45s' },
        ],
      },
    ],
  },
];
