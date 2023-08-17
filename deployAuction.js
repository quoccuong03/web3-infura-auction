const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");
const fs = require("fs");

async function placeBids() {
	const accounts = await web3.eth.getAccounts();
	console.log(accounts);
	const auctionContractAbi = JSON.parse(
		fs.readFileSync("./auctioncontract/AuctionContract.abi", "utf-8"),
	); // Replace with actual ABI path

	const auctionContractBytecode =
		"0x" + fs.readFileSync("./auctioncontract/AuctionContract.bin", "utf-8"); // Load the MyToken contract bytecode
	const deployer = accounts[0];

	const deployer2 = accounts[2];
	const deployer3 = accounts[3];
	const deployer4 = accounts[4];
	const gas = 3000000;
	const gasPrice = "20000000000";
	const auctionContractContract = new web3.eth.Contract(auctionContractAbi);
	const auctionContract = await auctionContractContract
		.deploy({
			data: auctionContractBytecode,
		})
		.send({
			from: deployer,
			gas,
			gasPrice,
		});

	const bidAmount = web3.utils.toWei("0.1", "ether");
	await auctionContract.methods.placeBid().send({
		from: deployer2,
		value: bidAmount,
	});
	console.log("deployer2: ", deployer2);
	const bidAmount2 = web3.utils.toWei("0.11", "ether");
	await auctionContract.methods.placeBid().send({
		from: deployer3,
		value: bidAmount2,
	});
	console.log("deployer3: ", deployer3);
	const bidAmount4 = web3.utils.toWei("10", "ether");
	await auctionContract.methods.placeBid().send({
		from: deployer4,
		value: bidAmount4,
	});
	console.log("deployer4: ", deployer4);
	console.log("Bid placed successfully");
	await auctionContract.methods.endAuction().send({
		from: deployer,
	});

	const winnerInfo = await auctionContract.methods.getWinner().call();
	const winnerAddress = winnerInfo[0];
	const winningBid = winnerInfo[1];
	console.log(`Winner: ${winnerAddress}`);
	console.log(`Winning Bid: ${winningBid} wei`);
	const develop4_blance = await web3.eth.getBalance(deployer4);
	console.log("deployer4 balance current eth: ", develop4_blance);
	await auctionContract.methods.withdraw().send({
		from: deployer4,
	});
	const develop4_blance2 = await web3.eth.getBalance(deployer4);
	console.log("deployer4 balance current eth: ", develop4_blance2);
}

placeBids();
