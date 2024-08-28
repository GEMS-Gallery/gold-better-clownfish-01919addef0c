import Func "mo:base/Func";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  stable var taxPayerEntries : [(Nat, TaxPayer)] = [];

  // Create a HashMap to store TaxPayer records
  var taxPayers = HashMap.HashMap<Nat, TaxPayer>(0, Nat.equal, Nat.hash);

  // Create a mutable variable to keep track of the next available TID
  var nextTid : Nat = 1;

  // Function to add a new TaxPayer record
  public func addTaxPayer(firstName: Text, lastName: Text, address: Text) : async Result.Result<Nat, Text> {
    let newTaxPayer : TaxPayer = {
      tid = nextTid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayers.put(nextTid, newTaxPayer);
    let currentTid = nextTid;
    nextTid += 1;
    #ok(currentTid)
  };

  // Function to get all TaxPayer records
  public query func getTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Function to search for a TaxPayer by TID
  public query func searchTaxPayer(tid: Nat) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Upgrade hook to handle stable storage
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Nat, TaxPayer>(taxPayerEntries.vals(), 0, Nat.equal, Nat.hash);
    nextTid := taxPayerEntries.size() + 1;
  };
}
