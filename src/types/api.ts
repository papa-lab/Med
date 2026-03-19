export interface UserProfile {
  id: string;
  email: string;
  name: string;
  university?: string;
  yearOfStudy?: number;
  studyStreak: number;
  telegramLinked: boolean;
  telegramHandle?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface DashboardResponse {
  user: UserProfile;
  summary: {
    pendingQuizzes: number;
    flashcardsToReview: number;
    studyStreak: number;
    dailyGoalMinutes: number;
    todayMinutes: number;
  };
  stats: {
    weeklyStudyHours: number;
    quizAccuracy: number;
    questionsAnswered: number;
  };
  subjects: Array<{
    name: string;
    progress: number;
    total: number;
    completed: number;
  }>;
  recentDiscussions: Array<{
    id: string;
    title: string;
    author: string;
    replies: number;
    time: string;
    excerpt: string;
  }>;
  upcoming: Array<{
    title: string;
    time: string;
  }>;
}
