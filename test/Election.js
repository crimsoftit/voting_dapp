var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

	var electionInstance;

	it("initializes with 2 candidates", function() {
		return Election.deployed().then(function(instance) {
			return instance.candidatesCount();
		}).then(function(count) {
			assert.equal(count.toNumber(), 2, "should have 2 candidates");
		});
	});

	it("initializes the candidates with the correct values", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.candidates(1);
		}).then(function(candidate1) {
			assert.equal(candidate1[0], 1, "candidate1 contains the correct id");
			assert.equal(candidate1[1], "Emmanuel", "contains the correct name");
			assert.equal(candidate1[2], 0, "contains the correct vote count");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			assert.equal(candidate2[0], 2, "candidate2 contains the correct id");
			assert.equal(candidate2[1], "Billy", "candidate2 has correct name");
			assert.equal(candidate2[2], 0, "candidate2 has correct vote count");
		});
	});
});