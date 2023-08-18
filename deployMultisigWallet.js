const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");
const fs = require("fs");
const multisiWalletAbi = JSON.parse(fs.readFileSync("./multisiWallet/MultisigWallet.abi", "utf-8")); // Replace with actual ABI path

async function MultisigWallet() {
	const accounts = await web3.eth.getAccounts();

	const multisiWalletBytecode =
		"0x" + fs.readFileSync("./multisiWallet/MultisigWallet.bin", "utf-8"); // Load the MyToken contract bytecode
	const deployer = accounts[0];

	const gas = 3000000;
	const gasPrice = "20000000000";
	const multisiWalletContract = new web3.eth.Contract(multisiWalletAbi);
	const owners = [accounts[0], accounts[1], accounts[2], accounts[3]]; // Replace with Ethereum addresses of the owners
	const requiredSignatures = 2;
	const multisiWalletIntance = await multisiWalletContract
		.deploy({
			data: multisiWalletBytecode,
			arguments: [owners, requiredSignatures],
		})
		.send({
			from: deployer,
			gas,
			gasPrice,
		});
	const recipient = accounts[4]; // Replace with the recipient's Ethereum address
	const value = web3.utils.toWei("0.1", "ether"); // Replace with the desired value in ether
	const sender = accounts[1];
	const data = "0x";

	const txData = multisiWalletIntance.methods
		.submitTransaction(recipient, value, data)
		.encodeABI();
	const nonce = await web3.eth.getTransactionCount(sender, "latest");

	const tx = {
		from: sender,
		to: multisiWalletIntance.options.address,
		data: txData,
		gasPrice: gasPrice,
		gas,
		nonce: nonce,
	};
	const privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
	const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

	const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	// console.log("Transaction receipt:", txReceipt);

	confirmTransaction(0, multisiWalletIntance, accounts[1], privateKey);
	confirmTransaction(
		0,
		multisiWalletIntance,
		accounts[0],
		"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
	);
	confirmTransaction(
		0,
		multisiWalletIntance,
		accounts[2],
		"0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
	);
	confirmTransaction(
		0,
		multisiWalletIntance,
		accounts[3],
		"0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
	);
	executeTransaction(0, multisiWalletIntance, accounts[1], privateKey);
}

async function confirmTransaction(txIndex, walletContract, sender, privateKey) {
	const txData = walletContract.methods.confirmTransaction(txIndex).encodeABI();

	const gasPrice = await web3.eth.getGasPrice();
	const gasLimit = 3000000; // Replace with the appropriate gas limit

	const nonce = await web3.eth.getTransactionCount(sender, "latest");

	const tx = {
		from: sender,
		to: walletContract.options.address,
		data: txData,
		gasPrice: gasPrice,
		gas: gasLimit,
		nonce: nonce,
	};

	const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

	const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	// console.log("Transaction receipt:", txReceipt);
}

async function executeTransaction(txIndex, walletContract, sender, privateKey) {
	// Replace with the sender's Ethereum address

	const txData = walletContract.methods.executeTransaction(txIndex).encodeABI();

	const gasPrice = await web3.eth.getGasPrice();
	const gasLimit = 3000000; // Replace with the appropriate gas limit

	const nonce = await web3.eth.getTransactionCount(sender, "latest");

	const tx = {
		from: sender,
		to: walletContract.options.address,
		data: txData,
		gasPrice: gasPrice,
		gas: gasLimit,
		nonce: nonce + 1,
	};

	const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

	const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	console.log("Transaction receipt:", txReceipt);
}

MultisigWallet();
