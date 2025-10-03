// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title OnChainAid
 * @dev Smart contract untuk mengelola donasi dan distribusi bantuan sosial di VeChainThor
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

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Membuat donasi baru
     * @param _category Kategori donasi (general, medical, education, disaster)
     * @param _message Pesan dari donor
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

        emit DonationMade(
            donationCount,
            msg.sender,
            msg.value,
            _category,
            block.timestamp
        );
    }

    /**
     * @dev Verifikasi penerima bantuan
     * @param _recipient Alamat penerima
     * @param _name Nama penerima
     * @param _category Kategori kebutuhan
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
     * @param _donationId ID donasi
     * @param _recipient Alamat penerima
     */
    function distributeFunds(uint256 _donationId, address payable _recipient) public onlyOwner {
        require(_donationId > 0 && _donationId <= donationCount, "Invalid donation ID");
        require(recipients[_recipient].verified, "Recipient not verified");
        require(!donations[_donationId].distributed, "Funds already distributed");

        Donation storage donation = donations[_donationId];
        donation.distributed = true;

        recipients[_recipient].totalReceived += donation.amount;

        (bool success, ) = _recipient.call{value: donation.amount}("");
        require(success, "Transfer failed");

        emit FundsDistributed(
            _donationId,
            _recipient,
            donation.amount,
            block.timestamp
        );
    }

    /**
     * @dev Get donasi berdasarkan donor address
     * @param _donor Alamat donor
     */
    function getDonationsByDonor(address _donor) public view returns (uint256[] memory) {
        return donorDonations[_donor];
    }

    /**
     * @dev Get informasi donasi
     * @param _donationId ID donasi
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
     * @dev Emergency withdraw (hanya owner)
     */
    function emergencyWithdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}