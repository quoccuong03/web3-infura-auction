const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const fs = require("fs");

async function deployContracts() {
	const icoAbi = JSON.parse(fs.readFileSync("./ico/ICO.abi", "utf-8")); // Replace with actual ABI path

	const icoBytecode = "0x" + fs.readFileSync("./ico/ICO.bin", "utf-8"); // Load the MyToken contract bytecode
	const accounts = await web3.eth.getAccounts();
	const deployer = accounts[0];

	const deployer2 = accounts[2];
	const gas = 3000000;
	const gasPrice = "20000000000";

	const ICOContract = new web3.eth.Contract(icoAbi);
	const icoInstance = await ICOContract.deploy({
		data: icoBytecode,
	}).send({
		from: deployer,
		gas,
		gasPrice,
	});

	console.log("ICO Contract deployed at address:", icoInstance.options.address);
	const etherAmountToSpend = web3.utils.toWei("12", "ether"); // Số lượng Ether muốn chi trả
	await icoInstance.methods.buy().send({
		from: deployer,
		value: etherAmountToSpend, // Calculate the cost in wei
		gas, // Adjust gas limit as needed
	});

	await icoInstance.methods.buy().send({
		from: deployer2,
		value: etherAmountToSpend, // Calculate the cost in wei
		gas, // Adjust gas limit as needed
	});

	const balanceALl = await icoInstance.methods.getContractTokenBalance().call();
	const develop2_blance = await web3.eth.getBalance(deployer2);
	console.log("balanceALl: ", balanceALl);
	console.log("develop2 balance current eth: ", develop2_blance);
}

deployContracts();
