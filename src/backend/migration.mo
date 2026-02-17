import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type UserProfile = {
    name : Text;
    email : Text;
    id : Text;
    createdAt : Int;
  };

  type TransactionData = {
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

  type SavingsGoal = {
    id : Text;
    name : Text;
    targetAmount : Float;
    currentAmount : Float;
    user : Principal;
    createdAt : Int;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    transactions : Map.Map<Principal, [TransactionData]>;
    userSavingsGoals : Map.Map<Principal, [SavingsGoal]>;
    // ... other state ...
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    transactions : Map.Map<Principal, [TransactionData]>;
    // ... other state ...
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      transactions = old.transactions;
    };
  };
};
