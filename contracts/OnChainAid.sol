// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title OnChainAid
 * @dev Smart contract untuk mengelola donasi dan distribusi bantuan sosial di VeChainThor
 * Improvements: reentrancy guard, receive handler, owner management, partial withdraw, and helpful getters
 */
contract OnChainAid {
    struct Donation {
        address donor;
        uint256 amount;
        string category;
        string message;
        uint256 timestamp;
        bool distributed;
    }

    struct Recipient {
        address recipientAddress;
        string name;
        string category;
        bool verified;
        uint256 totalReceived;
    }

    mapping(uint256 => Donation) public donations;
    mapping(address => Recipient) public recipients;
    mapping(address => uint256[]) public donorDonations;

    uint256 public donationCount;
    uint256 public totalDonated;
    address public owner;

    // Reentrancy guard
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    event DonationMade(
        uint256 indexed donationId,
        address indexed donor,
        uint256 amount,
        string category,
        uint256 timestamp
    );

    event FundsDistributed(
        uint256 indexed donationId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    event RecipientVerified(
        address indexed recipient,
        string name,
        uint256 timestamp
    );

    event EmergencyWithdrawn(address indexed owner, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed owner, uint256 amount, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor() {
        owner = msg.sender;
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Menerima transfer langsung ke kontrak dan mencatat sebagai donasi sederhana
     */
    receive() external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");

        donationCount += 1;
        donations[donationCount] = Donation({
            donor: msg.sender,
            amount: msg.value,
            category: "direct",
            message: "",
            timestamp: block.timestamp,
            distributed: false
        });

        donorDonations[msg.sender].push(donationCount);
        totalDonated += msg.value;

        emit DonationMade(donationCount, msg.sender, msg.value, "direct", block.timestamp);
    }

    /**
     * @dev Membuat donasi baru
     */
    function donate(string memory _category, string memory _message) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");

        donationCount++;

        donations[donationCount] = Donation({
            donor: msg.sender,
            amount: msg.value,
            category: _category,
            message: _message,
            timestamp: block.timestamp,
            distributed: false
        });

        donorDonations[msg.sender].push(donationCount);
        totalDonated += msg.value;

        emit DonationMade(donationCount, msg.sender, msg.value, _category, block.timestamp);
    }

    /**
     * @dev Verifikasi penerima bantuan
     */
    function verifyRecipient(
        address _recipient,
        string memory _name,
        string memory _category
    ) public onlyOwner {
        recipients[_recipient] = Recipient({
            recipientAddress: _recipient,
            name: _name,
            category: _category,
            verified: true,
            totalReceived: 0
        });

        emit RecipientVerified(_recipient, _name, block.timestamp);
    }

    /**
     * @dev Distribusikan dana ke penerima yang terverifikasi
     */
    function distributeFunds(uint256 _donationId, address payable _recipient) public onlyOwner nonReentrant {
        require(_donationId > 0 && _donationId <= donationCount, "Invalid donation ID");
        require(recipients[_recipient].verified, "Recipient not verified");
        require(!donations[_donationId].distributed, "Funds already distributed");

        Donation storage donation = donations[_donationId];
        donation.distributed = true;

        recipients[_recipient].totalReceived += donation.amount;

        (bool success, ) = _recipient.call{value: donation.amount}("\x00");
        require(success, "Transfer failed");

        emit FundsDistributed(_donationId, _recipient, donation.amount, block.timestamp);
    }

    /**
     * @dev Get donasi berdasarkan donor address
     */
    function getDonationsByDonor(address _donor) public view returns (uint256[] memory) {
        return donorDonations[_donor];
    }

    /**
     * @dev Get informasi donasi
     */
    function getDonation(uint256 _donationId) public view returns (
        address donor,
        uint256 amount,
        string memory category,
        string memory message,
        uint256 timestamp,
        bool distributed
    ) {
        Donation memory donation = donations[_donationId];
        return (
            donation.donor,
            donation.amount,
            donation.category,
            donation.message,
            donation.timestamp,
            donation.distributed
        );
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Withdraw specific amount to owner
     */
    function withdraw(uint256 _amount) public onlyOwner nonReentrant {
        require(_amount <= address(this).balance, "Amount exceeds balance");
        (bool success, ) = payable(owner).call{value: _amount}("");
        require(success, "Withdraw failed");
        emit Withdrawn(owner, _amount, block.timestamp);
    }

    /**
     * @dev Emergency withdraw (hanya owner) - tarik seluruh saldo
     */
    function emergencyWithdraw() public onlyOwner nonReentrant {
        uint256 bal = address(this).balance;
        (bool success, ) = payable(owner).call{value: bal}("");
        require(success, "Withdraw failed");
        emit EmergencyWithdrawn(owner, bal, block.timestamp);
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner is the zero address");
        address previous = owner;
        owner = _newOwner;
        emit OwnershipTransferred(previous, _newOwner);
    }

    /**
     * @dev Get total donated amount by a donor (summing their donations)
     */
    function getTotalDonatedByDonor(address _donor) public view returns (uint256) {
        uint256[] memory ids = donorDonations[_donor];
        uint256 sum = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            sum += donations[ids[i]].amount;
        }
        return sum;
    }
}
