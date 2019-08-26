var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

	var electionInstance;
	var voteCount;

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

	it("throws an exception for invalid candidates", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.vote(3, { from: accounts[1] });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "invalid candidate id");
			return electionInstance.candidates(1);
		}).then(function(candidate1) {
			voteCount = candidate1[2];
			assert.equal(voteCount, 0, "candidate1 vote count shouldn't change");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			voteCount = candidate2[2];
			assert.equal(voteCount, 0, "candidate2 vote count shouldn't change");
		});
	});

	it("throws an exception for double voting", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			candidateId = 2;
			electionInstance.vote(candidateId, { from: accounts[1] });
			return electionInstance.candidates(candidateId);
		}).then(function(candidate) {
			voteCount = candidate[2];
			assert.equal(voteCount, 1, "candidate2's vote count incremented");

			// try to vote again
			return electionInstance.vote(candidateId, { from: accounts[1] });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "cannot vote twice");
			return electionInstance.candidates(1);
		}).then(function(candidate1) {
			voteCount = candidate1[2];
			assert.equal(voteCount, 0, "candidate1 voteCount doesn't increment");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			voteCount = candidate2[2];
			assert.equal(voteCount, 1, "candidate2 voteCount doesn't increase");
		});
	});

	it("allows a voter to cast a vote", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, { from: accounts[0] });
		}).then(function(receipt) {
			return electionInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted, "voter marked as voted");
			return electionInstance.candidates(candidateId);
		}).then(function(vCount) {
			voteCount = vCount[2];
			assert.equal(voteCount, 1, "increments candidate's vote count");
		});
	});
});