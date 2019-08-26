pragma solidity ^0.5.0;

contract Election {

	// model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}
	
	// store candidates
	mapping (uint => Candidate) public candidates;
	
	// store candidates count
	uint public candidatesCount;

	constructor () public {
		addCandidate("Emmanuel");
		addCandidate("Billy");
	}

	// add candidate
	function addCandidate (string _name) private {
		candidatesCount ++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}
	
}
