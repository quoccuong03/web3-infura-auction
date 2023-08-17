const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");
const fs = require("fs");

async function Ntf() {
	const accounts = await web3.eth.getAccounts();
	console.log(accounts);
	const ntfAbi = JSON.parse(fs.readFileSync("./ntf/MyERC721Token.abi", "utf-8")); // Replace with actual ABI path

	const ntfBytecode = "0x" + fs.readFileSync("./ntf/MyERC721Token.bin", "utf-8"); // Load the MyToken contract bytecode
	const deployer = accounts[0];

	const gas = 3000000;
	const gasPrice = "20000000000";
	const ntfContract = new web3.eth.Contract(ntfAbi);
	const ntfIntance = await ntfContract
		.deploy({
			data: ntfBytecode,
		})
		.send({
			from: deployer,
			gas,
			gasPrice,
		});

	const develop2 = accounts[2];
	const nonce = await web3.eth.getTransactionCount(deployer, "latest");
	const dataMint = ntfIntance.methods.mintToken(develop2);
	const txData = dataMint.encodeABI();
	const contractAddress = ntfIntance.options.address;
	const test1 = await ntfIntance.methods.getCurrentToken().call();
	console.log(test1, "txData");
	const tx = {
		nonce: nonce,
		to: contractAddress,
		gasPrice: gasPrice,
		gasLimit: web3.utils.toHex(300000), // Adjust gas limit as needed
		data: txData,
	};
	const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
	const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
	const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	console.log("Transaction receipt:", txReceipt);
	// const test = await ntfIntance.methods.owner().call();
	// console.log(ntfIntance.methods);
	// console.log(test);
	const owner = await ntfIntance.methods.ownerOf("0").call();
	console.log(`Token 0 is owned by: ${owner}`);

	// const owner = await ntfIntance.methods.ownerOf(tokenIdToMint).call();
	// console.log(`Token ${tokenIdToMint} is owned by: ${owner}`);
}

Ntf();
