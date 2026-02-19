import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Blob "mo:core/Blob";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

// Actor
actor {
  let accessControlState = AccessControl.initState();
  let storage = Storage.new();

  include MixinStorage(storage);

  // State Variables
  var legalPages = Map.empty<Text, LegalPage>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var userPreferences = Map.empty<Principal, UserPreferences>();
  var userCookieConsent = Map.empty<Principal, CookieConsent>();
  var transactions = Map.empty<Principal, [TransactionData]>();
  var expenses = Map.empty<Principal, [ExpenseItem]>();
  var contactSubmissions = Map.empty<Text, ContactSubmission>();
  var aiPredictions = Map.empty<Principal, AIPrediction>();
  var caFeaturesContent = Map.empty<Text, CharteredAccountantFeaturesContent>();
  var chatSessions = Map.empty<Text, ChatSession>();
  var quizQuestions = Map.empty<Text, QuizQuestion>();
  var budgets = Map.empty<Principal, BudgetData>();
  var subscriptions = Map.empty<Principal, [Subscription]>();
  var userQuizProgress = Map.empty<Principal, QuizProgress>();
  var quizDatabase : ?QuizDatabase = null;
  var quizInitializationLock : Bool = false;
  var aiModelPredictions = Map.empty<Principal, AIModelPrediction>();
  var aiModelTrainingData = Map.empty<Principal, AIModelTrainingData>();
  var blogPosts = Map.empty<Text, BlogPost>();
  var blogPostContents = Map.empty<Text, FinanceBlogContent>();
  var systemInitialized : Bool = false;
  let backendVersion = "2.4.2";
  var userBudgets = Map.empty<Principal, BudgetData>();
  var savingsGoals = Map.empty<Principal, [SavingsGoal]>();

  // Type Definitions
  public type UserProfile = {
    name : Text;
    email : Text;
    id : Text;
    createdAt : Int;
  };

  public type Currency = {
    #usd;
    #inr;
    #eur;
  };

  public type UserPreferences = {
    themeMode : Text;
    notificationsEnabled : Bool;
    analyticsVisible : Bool;
    currency : Currency;
    updatedAt : Int;
  };

  public type CookieConsent = {
    essential : Bool;
    analytics : Bool;
    advertising : Bool;
    functional : Bool;
    timestamp : Int;
    expiresAt : Int;
  };

  public type TransactionData = {
    id : Text;
    amount : Float;
    category : Text;
    notes : Text;
    date : Int;
    paymentType : Text;
    user : Principal;
    createdAt : Int;
    transactionType : Text;
  };

  public type ExpenseItem = {
    id : Text;
    item : Text;
    amount : Float;
    category : Text;
    recurring : Bool;
    date : Int;
    time : { hours : Nat; minutes : Nat };
    priority : PriorityLevel;
    paymentType : PaymentType;
    notes : Text;
    user : Principal;
    paymentId : ?Text;
    merchant : ?Text;
    location : ?{ latitude : Float; longitude : Float };
    tags : [Text];
    expenseType : ExpenseType;
    createdBy : Text;
    recurringFrequencyDays : ?Nat;
    spendingGoalId : ?Text;
    createdAt : Int;
  };

  public type PriorityLevel = {
    #low;
    #medium;
    #high;
    #critical;
  };

  public type PaymentType = {
    #cash;
    #creditCard;
    #debitCard;
    #netBanking;
    #upi;
  };

  public type ExpenseType = {
    #mandatory;
    #optional;
  };

  public type Budget = {
    category : Text;
    amount : Float;
    type_ : BudgetType;
  };

  public type BudgetData = {
    budgets : [Budget];
    savingsPercentage : Float;
    totalMonthlyIncome : Float;
    totalMandatoryExpenses : Float;
    totalOptionalExpenses : Float;
    totalMonthlySavings : Float;
    remainingBudget : Float;
    emergencyFundTargetMonths : Nat;
    emergencyFundTargetAmount : Float;
    currentEmergencyFundBalance : Float;
    monthlySavingsGoal : Float;
    status : BudgetStatus;
    user : Principal;
    lastUpdated : Int;
  };

  public type BudgetType = {
    #primaryNecessity;
    #discretionary;
    #seasonal;
  };

  public type BudgetStatus = {
    #good;
    #warning;
    #critical;
  };

  public type ServiceSubscription = {
    name : Text;
    amount : Float;
    frequency : Text;
    startDate : Int;
    category : Text;
  };

  public type SavingsGoal = {
    id : Text;
    name : Text;
    targetAmount : Float;
    currentAmount : Float;
    user : Principal;
    createdAt : Int;
  };

  public type ContactSubmission = {
    id : Text;
    name : Text;
    email : Text;
    message : Text;
    submittedAt : Int;
  };

  public type CategoryData = {
    category : Text;
    totalAmount : Float;
    color : Text;
  };

  public type MonthlyComparison = {
    month : Text;
    expenses : Float;
    income : Float;
    savings : Float;
  };

  public type FinancialTrend = {
    date : Int;
    balance : Float;
    expenses : Float;
    income : Float;
  };

  public type BlogPost = {
    id : Text;
    title : Text;
    content : Text;
    excerpt : Text;
    featuredImage : Text;
    publicationDate : Int;
    slug : Text;
    seoMeta : Text;
  };

  public type FinanceBlogContent = {
    title : Text;
    excerpt : Text;
    content : Text;
    featuredImage : Text;
    author : Text;
    tags : [Text];
    metaDescription : Text;
    publicationDate : Int;
  };

  public type AIPrediction = {
    user : Principal;
    futureSavings : Float;
    balancePrediction : Float;
    riskLevel : Text;
    savingsConsistency : Float;
    spendingGrowthRate : Float;
    expenseCategoryAnalysis : [(Text, Float, Float)];
    remainingGoalAmount : Float;
    disclaimer : Text;
    confidenceScore : Float;
    lastUpdated : Int;
  };

  public type CharteredAccountantFeaturesContent = {
    sections : [CASection];
    metaTitle : Text;
    metaDescription : Text;
    metaKeywords : Text;
    disclaimer : Text;
    lastUpdated : Int;
  };

  public type CASection = {
    title : Text;
    description : Text;
    points : [Text];
    icon : Text;
    color : Text;
  };

  public type ChatMessage = {
    id : Text;
    role : ChatRole;
    content : Text;
    timestamp : Int;
  };

  public type ChatRole = {
    #user;
    #assistant;
  };

  public type ChatSession = {
    id : Text;
    user : Principal;
    messages : [ChatMessage];
    createdAt : Int;
    lastMessageAt : Int;
    status : ChatSessionStatus;
  };

  public type ChatSessionStatus = {
    #active;
    #closed;
    #expired;
  };

  public type ChatbotResponse = {
    success : Bool;
    message : ?ChatMessage;
    error : ?Text;
  };

  public type MessageResponse = {
    id : Text;
    role : ChatRole;
    content : Text;
    timestamp : Int;
    disclaimer : Text;
  };

  public type ChatHistoryResponse = {
    messages : [MessageResponse];
    sessionId : Text;
    message : Text;
  };

  public type FinancialPrediction = {
    balancePrediction : Float;
    riskLevel : Text;
    futureSavings : Float;
    savingsConsistency : Float;
    spendingGrowthRate : Float;
    expenseCategoryAnalysis : [(Text, Float, Float)];
    remainingGoalAmount : Float;
    disclaimer : Text;
    confidenceScore : Float;
    lastUpdated : Int;
  };

  public type QuizQuestion = {
    id : Text;
    question : Text;
    options : [Text];
    correctAnswer : Text;
    explanation : Text;
    realLifeTip : Text;
    topic : QuizTopic;
    difficulty : QuizDifficulty;
  };

  public type QuizTopic = {
    #budgeting;
    #saving;
    #emergencyFunds;
    #salaryManagement;
    #debts;
    #loans;
    #credit;
    #spending;
    #mistakes;
    #investing;
    #digitalPayments;
  };

  public type QuizDifficulty = {
    #easy;
    #medium;
    #hard;
  };

  public type QuizProgress = {
    user : Principal;
    questionsCompleted : Nat;
    correctAnswers : Nat;
    incorrectAnswers : Nat;
    currentDifficulty : QuizDifficulty;
    askedQuestions : [Text];
    lastQuestionAt : Int;
  };

  public type QuizAnswer = {
    questionId : Text;
    userAnswer : Text;
    timestamp : Int;
  };

  public type QuizFeedback = {
    isCorrect : Bool;
    correctAnswer : Text;
    explanation : Text;
    realLifeTip : Text;
    encouragement : Text;
  };

  public type QuizStatistics = {
    totalQuestions : Nat;
    questionsCompleted : Nat;
    correctAnswers : Nat;
    incorrectAnswers : Nat;
    currentDifficulty : QuizDifficulty;
    progressPercentage : Float;
  };

  public type QuizInitResponse = {
    currentQuestion : ?QuizQuestion;
    questionsCompleted : Nat;
    correctAnswers : Nat;
    incorrectAnswers : Nat;
    progressPercentage : Float;
    currentDifficulty : QuizDifficulty;
  };

  public type QuizDatabase = {
    questions : Map.Map<Text, QuizQuestion>;
    initialized : Bool;
    totalQuestions : Nat;
  };

  public type AIModelTrainingData = {
    transactionAmountSum : Float;
    numTransactions : Nat;
    expenseCategoryDist : [(Text, Int)];
    savingsProgressSum : Float;
    savingsGoalCount : Int;
    quizCorrectAnswers : Int;
    quizNumQuestions : Int;
  };

  public type AIModelTrainRequest = {
    trainingData : AIModelTrainingData;
  };

  public type AIModelPredictRequest = {
    inputData : AIModelTrainingData;
  };

  public type AIModelPrediction = {
    balancePrediction : Float;
    riskLevel : Text;
    futureSavings : Float;
    confidenceScore : Float;
    lastUpdated : Int;
  };

  public type LegalPage = {
    title : Text;
    content : Text;
  };

  public type Result<T, E> = {
    #ok : T;
    #err : E;
  };

  public type HomepageContent = {
    title : Text;
    seoMeta : Text;
    sections : [HomepageSection];
    blogPreviews : [BlogPreview];
    lastUpdated : Int;
  };

  public type HomepageSection = {
    title : Text;
    subtitle : Text;
    content : Text;
    extraTips : [Text];
  };

  public type BlogPreview = {
    id : Text;
    title : Text;
    excerpt : Text;
    featuredImage : Text;
    publicationDate : Int;
    slug : Text;
  };

  public type RobotsTxtEntry = {
    userAgent : Text;
    allow : [Text];
    disallow : [Text];
    sitemap : Text;
    crawlDelay : ?Float;
  };

  public type RobotsMetaTag = {
    name : Text;
    content : Text;
  };

  public type SeoMetadata = {
    title : Text;
    description : Text;
    keywords : [Text];
    canonicalUrl : Text;
    ogTitle : Text;
    ogDescription : Text;
    ogImage : Text;
    robotsMeta : RobotsMetaTag;
  };

  public type SitemapEntry = {
    url : Text;
    lastModified : Int;
    changeFrequency : Text;
    priority : Float;
  };

  public type Subscription = {
    name : Text;
    startDate : Int;
    endDate : ?Int;
    price : Float;
    recurring : Bool;
    category : Text;
  };

  public type BudgetCategory = {
    id : Text;
    name : Text;
    monthlyAllocation : Float;
    priorityLevel : Nat;
    isMandatory : Bool;
    color : Text;
    icon : Text;
  };

  public type OptimalBudgetSuggestion = {
    optimizedCategoryDistribution : [(Text, Float)];
    recommendedSavingsPercent : Float;
    spendingAnalysisSummary : Text;
    budgetViabilityStatus : Text;
    customTips : [Text];
    healthScore : Float;
    alertMessage : Text;
  };

  public type BudgetCalculationSummary = {
    totalExpenses : Float;
    mandatoryExpenses : Float;
    optionalExpenses : Float;
    savingsPercent : Float;
    remainingBudget : Float;
    monthlySavingsTarget : Float;
    emergencyFundRequired : Float;
    expenseTypeAnalysis : [(Text, Float)];
    successPercent : Float;
  };

  public type BudgetForecast = {
    threeMonthBalanceProjection : Float;
    budgetConsistencyScore : Float;
    riskFactor : Text;
    criticalAlerts : [Text];
    recommendationSummary : Text;
  };

  public type BudgetResult = {
    success : Bool;
    error : ?Text;
    budgetDetails : BudgetData;
    calculationSummary : BudgetCalculationSummary;
  };

  public type CategoryDistribution = {
    category : Text;
    amount : Float;
    percentage : Float;
  };

  public type BudgetAnalysis = {
    totalIncome : Float;
    totalExpenses : Float;
    savingsAmount : Float;
    categoryBreakdown : [CategoryDistribution];
    categoryAnalysis : [(Text, CategoryDistribution)];
  };

  public type BudgetSuggestion = {
    categoryDistribution : [CategoryDistribution];
    recommendedSavings : Float;
    potentialSavings : Float;
    surplusAnalysis : Float;
    budgetRating : Text;
  };

  public type BudgetRecommendation = {
    #evilBudget;
    #student;
    #professional;
    #retired;
    #custom;
  };

  // Required authentication functions
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query func getBackendVersion() : async Text {
    backendVersion;
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User Preferences Management
  public shared ({ caller }) func saveUserPreferences(preferences : UserPreferences) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save preferences");
    };
    userPreferences.add(caller, preferences);
  };

  public query ({ caller }) func getUserPreferences() : async ?UserPreferences {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access preferences");
    };
    userPreferences.get(caller);
  };

  // Cookie Consent Management
  public shared ({ caller }) func saveCookieConsent(consent : CookieConsent) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save cookie consent");
    };
    userCookieConsent.add(caller, consent);
  };

  public query ({ caller }) func getCookieConsent() : async ?CookieConsent {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access cookie consent");
    };
    userCookieConsent.get(caller);
  };

  // Transaction Management
  public shared ({ caller }) func addTransaction(transaction : TransactionData) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };
    if (transaction.user != caller) {
      Runtime.trap("Unauthorized: Cannot add transactions for other users");
    };
    let userTransactions = switch (transactions.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    transactions.add(caller, userTransactions.concat([transaction]));
  };

  public query ({ caller }) func getTransactions() : async [TransactionData] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access transactions");
    };
    switch (transactions.get(caller)) {
      case (?userTransactions) { userTransactions };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteTransaction(transactionId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete transactions");
    };
    let userTransactions = switch (transactions.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    let filtered = userTransactions.filter(func(t) { t.id != transactionId });
    transactions.add(caller, filtered);
  };

  // Expense Management
  public shared ({ caller }) func addExpense(expense : ExpenseItem) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add expenses");
    };
    if (expense.user != caller) {
      Runtime.trap("Unauthorized: Cannot add expenses for other users");
    };
    let userExpenses = switch (expenses.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    expenses.add(caller, userExpenses.concat([expense]));
  };

  public query ({ caller }) func getExpenses() : async [ExpenseItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access expenses");
    };
    switch (expenses.get(caller)) {
      case (?userExpenses) { userExpenses };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteExpense(expenseId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete expenses");
    };
    let userExpenses = switch (expenses.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    let filtered = userExpenses.filter(func(e) { e.id != expenseId });
    expenses.add(caller, filtered);
  };

  // Budget Management Functions
  public shared ({ caller }) func saveBudgetData(budget : BudgetData) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save budget data");
    };
    if (budget.user != caller) {
      Runtime.trap("Unauthorized: Cannot save budget data for other users");
    };
    budgets.add(caller, budget);
  };

  public query ({ caller }) func getBudgetData() : async ?BudgetData {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access budget data");
    };
    budgets.get(caller);
  };

  // Savings Goals Management
  public shared ({ caller }) func addSavingsGoal(goal : SavingsGoal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add savings goals");
    };
    if (goal.user != caller) {
      Runtime.trap("Unauthorized: Cannot add savings goals for other users");
    };
    let userGoals = switch (savingsGoals.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    savingsGoals.add(caller, userGoals.concat([goal]));
  };

  public query ({ caller }) func getSavingsGoals() : async [SavingsGoal] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access savings goals");
    };
    switch (savingsGoals.get(caller)) {
      case (?userGoals) { userGoals };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updateSavingsGoal(goalId : Text, updatedGoal : SavingsGoal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update savings goals");
    };
    if (updatedGoal.user != caller) {
      Runtime.trap("Unauthorized: Cannot update savings goals for other users");
    };
    let userGoals = switch (savingsGoals.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    let updated = userGoals.map(
      func(g) {
        if (g.id == goalId) { updatedGoal } else { g };
      },
    );
    savingsGoals.add(caller, updated);
  };

  public shared ({ caller }) func deleteSavingsGoal(goalId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete savings goals");
    };
    let userGoals = switch (savingsGoals.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    let filtered = userGoals.filter(func(g) { g.id != goalId });
    savingsGoals.add(caller, filtered);
  };

  // Subscription Management
  public shared ({ caller }) func addSubscription(subscription : Subscription) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add subscriptions");
    };
    let userSubscriptions = switch (subscriptions.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    subscriptions.add(caller, userSubscriptions.concat([subscription]));
  };

  public query ({ caller }) func getSubscriptions() : async [Subscription] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access subscriptions");
    };
    switch (subscriptions.get(caller)) {
      case (?userSubscriptions) { userSubscriptions };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteSubscription(subscriptionName : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete subscriptions");
    };
    let userSubscriptions = switch (subscriptions.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    let filtered = userSubscriptions.filter(func(s) { s.name != subscriptionName });
    subscriptions.add(caller, filtered);
  };

  // AI Predictions Management
  public shared ({ caller }) func saveAIPrediction(prediction : AIPrediction) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save AI predictions");
    };
    if (prediction.user != caller) {
      Runtime.trap("Unauthorized: Cannot save AI predictions for other users");
    };
    aiPredictions.add(caller, prediction);
  };

  public query ({ caller }) func getAIPrediction() : async ?AIPrediction {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access AI predictions");
    };
    aiPredictions.get(caller);
  };

  // AI Model Management
  public shared ({ caller }) func saveAIModelPrediction(prediction : AIModelPrediction) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save AI model predictions");
    };
    aiModelPredictions.add(caller, prediction);
  };

  public query ({ caller }) func getAIModelPrediction() : async ?AIModelPrediction {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access AI model predictions");
    };
    aiModelPredictions.get(caller);
  };

  public shared ({ caller }) func saveAIModelTrainingData(data : AIModelTrainingData) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save AI model training data");
    };
    aiModelTrainingData.add(caller, data);
  };

  public query ({ caller }) func getAIModelTrainingData() : async ?AIModelTrainingData {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access AI model training data");
    };
    aiModelTrainingData.get(caller);
  };

  // Chat Session Management
  public shared ({ caller }) func createChatSession(sessionId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create chat sessions");
    };
    let session : ChatSession = {
      id = sessionId;
      user = caller;
      messages = [];
      createdAt = Time.now();
      lastMessageAt = Time.now();
      status = #active;
    };
    chatSessions.add(sessionId, session);
  };

  public shared ({ caller }) func addChatMessage(sessionId : Text, message : ChatMessage) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add chat messages");
    };
    switch (chatSessions.get(sessionId)) {
      case (?session) {
        if (session.user != caller) {
          Runtime.trap("Unauthorized: Cannot add messages to other users' chat sessions");
        };
        let updatedSession = {
          session with
          messages = session.messages.concat([message]);
          lastMessageAt = Time.now();
        };
        chatSessions.add(sessionId, updatedSession);
      };
      case (null) {
        Runtime.trap("Chat session not found");
      };
    };
  };

  public query ({ caller }) func getChatSession(sessionId : Text) : async ?ChatSession {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access chat sessions");
    };
    switch (chatSessions.get(sessionId)) {
      case (?session) {
        if (session.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot access other users' chat sessions");
        };
        ?session;
      };
      case (null) { null };
    };
  };

  // Quiz Management
  public shared ({ caller }) func initializeQuiz() : async QuizInitResponse {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can initialize quiz");
    };
    let progress = switch (userQuizProgress.get(caller)) {
      case (?existing) { existing };
      case (null) {
        let newProgress : QuizProgress = {
          user = caller;
          questionsCompleted = 0;
          correctAnswers = 0;
          incorrectAnswers = 0;
          currentDifficulty = #easy;
          askedQuestions = [];
          lastQuestionAt = Time.now();
        };
        userQuizProgress.add(caller, newProgress);
        newProgress;
      };
    };
    {
      currentQuestion = null;
      questionsCompleted = progress.questionsCompleted;
      correctAnswers = progress.correctAnswers;
      incorrectAnswers = progress.incorrectAnswers;
      progressPercentage = 0.0;
      currentDifficulty = progress.currentDifficulty;
    };
  };

  public shared ({ caller }) func submitQuizAnswer(answer : QuizAnswer) : async QuizFeedback {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit quiz answers");
    };
    {
      isCorrect = true;
      correctAnswer = "Sample Answer";
      explanation = "Sample explanation";
      realLifeTip = "Sample tip";
      encouragement = "Great job!";
    };
  };

  public query ({ caller }) func getQuizStatistics() : async QuizStatistics {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access quiz statistics");
    };
    let progress = switch (userQuizProgress.get(caller)) {
      case (?existing) { existing };
      case (null) {
        return {
          totalQuestions = 0;
          questionsCompleted = 0;
          correctAnswers = 0;
          incorrectAnswers = 0;
          currentDifficulty = #easy;
          progressPercentage = 0.0;
        };
      };
    };
    {
      totalQuestions = 100;
      questionsCompleted = progress.questionsCompleted;
      correctAnswers = progress.correctAnswers;
      incorrectAnswers = progress.incorrectAnswers;
      currentDifficulty = progress.currentDifficulty;
      progressPercentage = 0.0;
    };
  };

  // Contact Form Management (Admin only to view)
  public shared ({ caller }) func submitContactForm(submission : ContactSubmission) : async () {
    // Anyone can submit contact forms (including guests)
    contactSubmissions.add(submission.id, submission);
  };

  public query ({ caller }) func getContactSubmissions() : async [(Text, ContactSubmission)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contactSubmissions.entries().toArray();
  };

  public shared ({ caller }) func deleteContactSubmission(submissionId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete contact submissions");
    };
    contactSubmissions.remove(submissionId);
  };

  // Blog Post Management (Admin only for write operations)
  public shared ({ caller }) func createBlogPost(post : BlogPost) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func updateBlogPost(postId : Text, post : BlogPost) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    blogPosts.add(postId, post);
  };

  public shared ({ caller }) func deleteBlogPost(postId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogPosts.remove(postId);
  };

  public query func getBlogPost(postId : Text) : async ?BlogPost {
    // Public read access
    blogPosts.get(postId);
  };

  public query func getAllBlogPosts() : async [(Text, BlogPost)] {
    // Public read access
    blogPosts.entries().toArray();
  };

  // Blog Content Management (Admin only for write operations)
  public shared ({ caller }) func saveBlogContent(contentId : Text, content : FinanceBlogContent) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can save blog content");
    };
    blogPostContents.add(contentId, content);
  };

  public query func getBlogContent(contentId : Text) : async ?FinanceBlogContent {
    // Public read access
    blogPostContents.get(contentId);
  };

  // Legal Pages Management (Admin only for write operations)
  public shared ({ caller }) func saveLegalPage(pageId : Text, page : LegalPage) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can save legal pages");
    };
    legalPages.add(pageId, page);
  };

  public query func getLegalPage(pageId : Text) : async ?LegalPage {
    // Public read access
    legalPages.get(pageId);
  };

  // CA Features Content Management (Admin only for write operations)
  public shared ({ caller }) func saveCAFeaturesContent(contentId : Text, content : CharteredAccountantFeaturesContent) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can save CA features content");
    };
    caFeaturesContent.add(contentId, content);
  };

  public query func getCAFeaturesContent(contentId : Text) : async ?CharteredAccountantFeaturesContent {
    // Public read access
    caFeaturesContent.get(contentId);
  };

  // Quiz Questions Management (Admin only for write operations)
  public shared ({ caller }) func addQuizQuestion(question : QuizQuestion) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add quiz questions");
    };
    quizQuestions.add(question.id, question);
  };

  public shared ({ caller }) func updateQuizQuestion(questionId : Text, question : QuizQuestion) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update quiz questions");
    };
    quizQuestions.add(questionId, question);
  };

  public shared ({ caller }) func deleteQuizQuestion(questionId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete quiz questions");
    };
    quizQuestions.remove(questionId);
  };

  // Helper function to build default budgets for new users
  public query func getDefaultBudgetSuggestions(recommendationType : BudgetRecommendation) : async [(Text, Float)] {
    // Public read access - no authentication needed
    switch (recommendationType) {
      case (#evilBudget) {
        [
          ("Housing", 30.0),
          ("Food", 15.0),
          ("Transportation", 10.0),
          ("Utilities", 10.0),
          ("Savings", 10.0),
          ("Medical", 8.0),
          ("Entertainment", 6.0),
          ("Shopping", 3.0),
          ("Gifts", 2.0),
          ("Travel", 2.0),
        ];
      };
      case (#student) {
        [
          ("Housing", 18.0),
          ("Food", 13.0),
          ("Groceries", 12.0),
          ("Transportation", 8.0),
          ("Books", 6.0),
          ("Technology & Gadgets", 6.0),
          ("Medical", 6.0),
          ("Personal Care", 5.0),
          ("Casual Dining", 4.0),
          ("Shopping & Fashion", 3.0),
          ("Gym & Health", 2.0),
          ("Entertainment", 2.0),
          ("Gifts", 2.0),
          ("Travel", 1.0),
          ("Emergency Expenses", 2.0),
        ];
      };
      case (#professional) {
        [
          ("Housing", 18.0),
          ("Groceries", 12.0),
          ("Food", 10.0),
          ("Transportation", 10.0),
          ("Technology & Gadgets", 8.0),
          ("Savings", 7.0),
          ("Medical", 7.0),
          ("Entertainment", 6.0),
          ("Shopping", 6.0),
          ("Casual Dining", 5.0),
          ("Gifts", 3.0),
          ("Travel", 3.0),
          ("Personal Care", 2.0),
          ("Professional Expenses", 2.0),
          ("Emergency Expenses", 1.0),
        ];
      };
      case (#retired) {
        [
          ("Food", 17.0),
          ("Groceries", 16.0),
          ("Housing", 15.0),
          ("Transportation", 12.0),
          ("Medical", 12.0),
          ("Entertainment", 7.0),
          ("Personal Care", 7.0),
          ("Travel", 5.0),
          ("Utilities", 5.0),
          ("Savings", 4.0),
        ];
      };
      case (#custom) {
        [
          ("Food", 15.0),
          ("Transportation", 10.0),
          ("Utilities", 10.0),
          ("Shopping", 10.0),
          ("Gifts", 8.0),
          ("Entertainment", 8.0),
          ("Medical", 7.0),
          ("Savings", 7.0),
          ("Personal Care", 5.0),
          ("Casual Dining", 3.0),
          ("Gym & Health", 1.0),
          ("Travel", 1.0),
        ];
      };
    };
  };

  // Private helper function for budget calculations
  func calculateEnhancedBudgetDetails(
    income : Float,
    expenses : [ExpenseItem],
    budgetDistribution : [(Text, Float)],
    recurringExpenses : [ExpenseItem],
    subscriptions : [Subscription]
  ) : BudgetAnalysis {
    let totalIncome = income;
    var totalExpenses = 0.0;
    var savingsAmount = 0.0;
    let categoryMap = Map.empty<Text, CategoryDistribution>();
    let gt100 = func(x : Float) : Bool { x > 100.0 };

    for ((category, target) in budgetDistribution.values()) {
      let categoryDistribution = {
        category;
        amount = 0.0;
        percentage = target;
      };
      categoryMap.add(category, categoryDistribution);
    };

    let allExpenses = expenses.concat(recurringExpenses);

    for (expense in allExpenses.values()) {
      totalExpenses += expense.amount;

      switch (categoryMap.get(expense.category)) {
        case (?existing) {
          let updated = {
            existing with
            amount = existing.amount + expense.amount;
            percentage = (existing.amount / totalIncome) * 100.0;
          };
          categoryMap.add(expense.category, updated);
        };
        case (null) {
          let newCategory = {
            category = expense.category;
            amount = expense.amount;
            percentage = (expense.amount / totalIncome) * 100.0;
          };
          categoryMap.add(expense.category, newCategory);
        };
      };
    };

    savingsAmount := income - totalExpenses;

    let categoryBreakdown = categoryMap.entries().toArray().filter(func(tuple) { not gt100(tuple.1.percentage) });
    let finalCategoryBreakdown = categoryBreakdown.map(func(entry) { entry.1 });
    let categoryAnalysis = categoryMap.entries().toArray();

    {
      totalIncome;
      totalExpenses;
      savingsAmount;
      categoryBreakdown = finalCategoryBreakdown;
      categoryAnalysis;
    };
  };
};
