import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Budget {
    type: BudgetType;
    category: string;
    amount: number;
}
export interface UserPreferences {
    notificationsEnabled: boolean;
    themeMode: string;
    updatedAt: bigint;
    currency: Currency;
    analyticsVisible: boolean;
}
export interface QuizAnswer {
    userAnswer: string;
    timestamp: bigint;
    questionId: string;
}
export interface ContactSubmission {
    id: string;
    name: string;
    submittedAt: bigint;
    email: string;
    message: string;
}
export interface QuizQuestion {
    id: string;
    topic: QuizTopic;
    question: string;
    difficulty: QuizDifficulty;
    explanation: string;
    correctAnswer: string;
    realLifeTip: string;
    options: Array<string>;
}
export interface QuizStatistics {
    currentDifficulty: QuizDifficulty;
    progressPercentage: number;
    incorrectAnswers: bigint;
    questionsCompleted: bigint;
    totalQuestions: bigint;
    correctAnswers: bigint;
}
export interface CASection {
    title: string;
    icon: string;
    color: string;
    description: string;
    points: Array<string>;
}
export interface BudgetData {
    savingsPercentage: number;
    status: BudgetStatus;
    totalMandatoryExpenses: number;
    monthlySavingsGoal: number;
    remainingBudget: number;
    emergencyFundTargetMonths: bigint;
    totalMonthlyIncome: number;
    emergencyFundTargetAmount: number;
    user: Principal;
    lastUpdated: bigint;
    budgets: Array<Budget>;
    currentEmergencyFundBalance: number;
    totalOptionalExpenses: number;
    totalMonthlySavings: number;
}
export interface Subscription {
    endDate?: bigint;
    name: string;
    recurring: boolean;
    category: string;
    price: number;
    startDate: bigint;
}
export interface LegalPage {
    title: string;
    content: string;
}
export interface CharteredAccountantFeaturesContent {
    metaDescription: string;
    metaKeywords: string;
    lastUpdated: bigint;
    metaTitle: string;
    disclaimer: string;
    sections: Array<CASection>;
}
export interface AIModelPrediction {
    futureSavings: number;
    lastUpdated: bigint;
    confidenceScore: number;
    balancePrediction: number;
    riskLevel: string;
}
export interface QuizInitResponse {
    currentDifficulty: QuizDifficulty;
    progressPercentage: number;
    incorrectAnswers: bigint;
    questionsCompleted: bigint;
    correctAnswers: bigint;
    currentQuestion?: QuizQuestion;
}
export interface ChatMessage {
    id: string;
    content: string;
    role: ChatRole;
    timestamp: bigint;
}
export interface CookieConsent {
    expiresAt: bigint;
    advertising: boolean;
    analytics: boolean;
    essential: boolean;
    timestamp: bigint;
    functional: boolean;
}
export interface SavingsGoal {
    id: string;
    name: string;
    createdAt: bigint;
    user: Principal;
    targetAmount: number;
    currentAmount: number;
}
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    seoMeta: string;
    featuredImage: string;
    slug: string;
    publicationDate: bigint;
    excerpt: string;
}
export interface QuizFeedback {
    encouragement: string;
    explanation: string;
    correctAnswer: string;
    isCorrect: boolean;
    realLifeTip: string;
}
export interface FinanceBlogContent {
    metaDescription: string;
    title: string;
    content: string;
    featuredImage: string;
    tags: Array<string>;
    author: string;
    publicationDate: bigint;
    excerpt: string;
}
export interface ExpenseItem {
    id: string;
    expenseType: ExpenseType;
    date: bigint;
    item: string;
    createdAt: bigint;
    createdBy: string;
    recurring: boolean;
    tags: Array<string>;
    time: {
        hours: bigint;
        minutes: bigint;
    };
    user: Principal;
    merchant?: string;
    notes: string;
    paymentId?: string;
    category: string;
    paymentType: PaymentType;
    priority: PriorityLevel;
    spendingGoalId?: string;
    recurringFrequencyDays?: bigint;
    amount: number;
    location?: {
        latitude: number;
        longitude: number;
    };
}
export interface AIPrediction {
    futureSavings: number;
    remainingGoalAmount: number;
    user: Principal;
    lastUpdated: bigint;
    expenseCategoryAnalysis: Array<[string, number, number]>;
    confidenceScore: number;
    savingsConsistency: number;
    balancePrediction: number;
    modelVersion: string;
    disclaimer: string;
    spendingGrowthRate: number;
    riskLevel: string;
}
export interface ChatSession {
    id: string;
    status: ChatSessionStatus;
    lastMessageAt: bigint;
    messages: Array<ChatMessage>;
    createdAt: bigint;
    user: Principal;
}
export interface AIModelTrainingData {
    quizNumQuestions: bigint;
    numTransactions: bigint;
    expenseCategoryDist: Array<[string, bigint]>;
    transactionAmountSum: number;
    savingsProgressSum: number;
    savingsGoalCount: bigint;
    quizCorrectAnswers: bigint;
}
export interface UserProfile {
    id: string;
    name: string;
    createdAt: bigint;
    email: string;
}
export interface TransactionData {
    id: string;
    transactionType: string;
    date: bigint;
    createdAt: bigint;
    user: Principal;
    notes: string;
    category: string;
    paymentType: string;
    amount: number;
}
export enum BudgetRecommendation {
    evilBudget = "evilBudget",
    custom = "custom",
    professional = "professional",
    student = "student",
    retired = "retired"
}
export enum BudgetStatus {
    warning = "warning",
    good = "good",
    critical = "critical"
}
export enum BudgetType {
    primaryNecessity = "primaryNecessity",
    seasonal = "seasonal",
    discretionary = "discretionary"
}
export enum ChatRole {
    user = "user",
    assistant = "assistant"
}
export enum ChatSessionStatus {
    closed = "closed",
    active = "active",
    expired = "expired"
}
export enum Currency {
    eur = "eur",
    inr = "inr",
    usd = "usd"
}
export enum ExpenseType {
    optional = "optional",
    mandatory = "mandatory"
}
export enum PaymentType {
    upi = "upi",
    creditCard = "creditCard",
    cash = "cash",
    debitCard = "debitCard",
    netBanking = "netBanking"
}
export enum PriorityLevel {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum QuizDifficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum QuizTopic {
    emergencyFunds = "emergencyFunds",
    saving = "saving",
    investing = "investing",
    digitalPayments = "digitalPayments",
    salaryManagement = "salaryManagement",
    mistakes = "mistakes",
    loans = "loans",
    credit = "credit",
    budgeting = "budgeting",
    debts = "debts",
    spending = "spending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChatMessage(sessionId: string, message: ChatMessage): Promise<void>;
    addExpense(expense: ExpenseItem): Promise<void>;
    addQuizQuestion(question: QuizQuestion): Promise<void>;
    addSavingsGoal(goal: SavingsGoal): Promise<void>;
    addSubscription(subscription: Subscription): Promise<void>;
    addTransaction(transaction: TransactionData): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(post: BlogPost): Promise<void>;
    createChatSession(sessionId: string): Promise<void>;
    deleteBlogPost(postId: string): Promise<void>;
    deleteContactSubmission(submissionId: string): Promise<void>;
    deleteExpense(expenseId: string): Promise<void>;
    deleteQuizQuestion(questionId: string): Promise<void>;
    deleteSavingsGoal(goalId: string): Promise<void>;
    deleteSubscription(subscriptionName: string): Promise<void>;
    deleteTransaction(transactionId: string): Promise<void>;
    getAIModelPrediction(): Promise<AIModelPrediction | null>;
    getAIModelTrainingData(): Promise<AIModelTrainingData | null>;
    getAIPrediction(): Promise<AIPrediction | null>;
    getAllBlogPosts(): Promise<Array<[string, BlogPost]>>;
    getBackendVersion(): Promise<string>;
    getBlogContent(contentId: string): Promise<FinanceBlogContent | null>;
    getBlogPost(postId: string): Promise<BlogPost | null>;
    getBudgetData(): Promise<BudgetData | null>;
    getCAFeaturesContent(contentId: string): Promise<CharteredAccountantFeaturesContent | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatSession(sessionId: string): Promise<ChatSession | null>;
    getContactSubmissions(): Promise<Array<[string, ContactSubmission]>>;
    getCookieConsent(): Promise<CookieConsent | null>;
    getDefaultBudgetSuggestions(recommendationType: BudgetRecommendation): Promise<Array<[string, number]>>;
    getExpenses(): Promise<Array<ExpenseItem>>;
    getLegalPage(pageId: string): Promise<LegalPage | null>;
    getQuizStatistics(): Promise<QuizStatistics>;
    getSavingsGoals(): Promise<Array<SavingsGoal>>;
    getSubscriptions(): Promise<Array<Subscription>>;
    getTransactions(): Promise<Array<TransactionData>>;
    getUserPreferences(): Promise<UserPreferences | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    initializeQuiz(): Promise<QuizInitResponse>;
    isCallerAdmin(): Promise<boolean>;
    saveAIModelPrediction(prediction: AIModelPrediction): Promise<void>;
    saveAIModelTrainingData(data: AIModelTrainingData): Promise<void>;
    saveAIPrediction(prediction: AIPrediction): Promise<void>;
    saveBlogContent(contentId: string, content: FinanceBlogContent): Promise<void>;
    saveBudgetData(budget: BudgetData): Promise<void>;
    saveCAFeaturesContent(contentId: string, content: CharteredAccountantFeaturesContent): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCookieConsent(consent: CookieConsent): Promise<void>;
    saveLegalPage(pageId: string, page: LegalPage): Promise<void>;
    saveUserPreferences(preferences: UserPreferences): Promise<void>;
    submitContactForm(submission: ContactSubmission): Promise<void>;
    submitQuizAnswer(answer: QuizAnswer): Promise<QuizFeedback>;
    updateBlogPost(postId: string, post: BlogPost): Promise<void>;
    updateQuizQuestion(questionId: string, question: QuizQuestion): Promise<void>;
    updateSavingsGoal(goalId: string, updatedGoal: SavingsGoal): Promise<void>;
}
