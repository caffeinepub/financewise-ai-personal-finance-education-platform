import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  let storage = Storage.new();

  include MixinStorage(storage);

  var legalPages = Map.empty<Text, LegalPage>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var userPreferences = Map.empty<Principal, UserPreferences>();
  var userCookieConsent = Map.empty<Principal, CookieConsent>();
  var transactions = Map.empty<Principal, [TransactionData]>();
  var userSavingsGoals = Map.empty<Principal, [SavingsGoal]>();
  var contactSubmissions = Map.empty<Text, ContactSubmission>();
  var aiPredictions = Map.empty<Principal, AIPrediction>();
  var caFeaturesContent = Map.empty<Text, CharteredAccountantFeaturesContent>();
  var chatSessions = Map.empty<Text, ChatSession>();
  var quizQuestions = Map.empty<Text, QuizQuestion>();
  var userQuizProgress = Map.empty<Principal, QuizProgress>();
  var quizDatabase : ?QuizDatabase = null;
  var quizInitializationLock : Bool = false;
  var aiModelPredictions = Map.empty<Principal, AIModelPrediction>();
  var aiModelTrainingData = Map.empty<Principal, AIModelTrainingData>();
  var blogPosts = Map.empty<Text, BlogPost>();
  var blogPostContents = Map.empty<Text, FinanceBlogContent>();
  var systemInitialized : Bool = false;
  let backendVersion = "2.4.2";

  // TYPES

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
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getBackendVersion() : async Text {
    backendVersion;
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
