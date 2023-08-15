const Web3 = require("web3");
const solc = require("solc");
const fs = require("fs");

const PROVIDER_URL = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));

async function main() {
	const accounts = await web3.eth.getAccounts();
	console.log(accounts);
	const privateKey = "7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";
	const contractAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

	let compiledContract, ABI, BYTECODE;

	function compileContract(fileName, contractName) {
		const contractCode = fs.readFileSync(fileName).toString();

		let standardCompilerInput = {
			language: "Solidity",
			sources: {
				contract: {
					content: contractCode,
				},
			},
			settings: {
				outputSelection: {
					"*": {
						"*": ["abi", "evm.bytecode"],
					},
				},
			},
		};

		standardCompilerInput = JSON.stringify(standardCompilerInput);
		const output = solc.compile(standardCompilerInput);
		compiledContract = JSON.parse(output).contracts.contract[contractName];
		return compiledContract;
	}

	console.log(compileContract("./ArrayOfFacts.sol", "ArrayOfFacts"));

	function deployContract() {
		web3.eth.accounts.wallet.add(privateKey);
		ABI = compiledContract.abi;
		BYTECODE = "0x" + compiledContract.evm.bytecode.object;

		// ==================== Comment out deploy code =================
		let contract = new web3.eth.Contract(ABI, null, {
			data: BYTECODE,
			from: web3.eth.accounts.wallet[0].address,
			gas: 4600000,
		});

		return contract
			.deploy()
			.send()
			.then((contractInstance) => {
				console.log(
					"Contract created at https://ropsten.etherscan.io/address/" +
						contractInstance.options.address,
				);
			});
		// ==============================================================
	}

	deployContract();

	function addFact() {
		const fact = "China Grapples With Mystery Pneumonia-Like Illness 01/06/2020.";

		const contract = new web3.eth.Contract(ABI, contractAddress);

		// ==================== Comment out add fact code =================
		// return contract.methods
		//     .add(fact)
		//     .send(
		//         {
		//           from: web3.eth.accounts.wallet[0].address,
		//           gas: 4600000
		//         },
		//         (err, transactionID) => {
		//             if (err) {
		//               console.log(err);
		//             } else {
		//               console.log("Transaction Hash: https://ropsten.etherscan.io/tx/" + transactionID);
		//             }
		//         }
		//     )
		//     .then(transaction => {
		//         console.log("Transaction Information:");
		//         console.log(transaction);
		//     });
		// ===============================================================
	}

	//console.log(addFact());

	function getFactAndCount() {
		let factIndex = 0;
		const contract = new web3.eth.Contract(ABI, contractAddress);

		contract.methods
			.getFact(factIndex)
			.call()
			.then((result) => {
				console.log(`Fact ${++factIndex}: ${result}`);
			});

		contract.methods
			.count()
			.call()
			.then((result) => {
				console.log(`Total recorded facts: ${result}`);
			});
	}

	console.log(getFactAndCount());
}

main();
