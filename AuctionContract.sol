// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuctionContract {
    address public owner;
    uint256 public highestBid;
    address public highestBidder;
    bool public auctionEnded;

    constructor() {
        owner = msg.sender;
    }

    function placeBid() public payable {
        require(!auctionEnded, "Auction has ended");
        require(msg.value > highestBid, "Bid must be higher than the current highest bid");
        
        if (highestBidder != address(0)) {
            // Return funds to the previous highest bidder
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = msg.value;
        highestBidder = msg.sender;
    }

    function endAuction() public {
        require(msg.sender == owner, "Only the owner can end the auction");
        auctionEnded = true;
    }

    function getWinner() public view returns (address, uint256) {
        require(auctionEnded, "Auction has not ended yet");
        return (highestBidder, highestBid);
    }


    function withdraw() public {
        require(msg.sender == highestBidder || msg.sender == owner, "Only the highest bidder or owner can withdraw");
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
    }
}
