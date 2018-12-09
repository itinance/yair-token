pragma solidity ^0.4.24;

/**
 * @title OwnableMultiple
 * @dev The Ownable contract has multiple owner addresses, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 * Instead of having just one owner, one of list of owners can "own"
 */
contract OwnableMultiple {
    mapping(address => bool) private _owners;

    event OwnershipAdded(address indexed newOwner, address indexed addedByOwner);
    event OwnershipRemoved(address indexed oldOwner, address indexed removedByOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        _addOwner(msg.sender);
    }

    /**
     * @return true if `msg.sender` is the owner of the contract.
     */
    function isOwner() public view returns (bool) {
        return _owners[msg.sender] == true;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
     * @dev Add a mew owner.
     * @param newOwner The address to transfer ownership to.
     */
    function addOwner(address newOwner) public onlyOwner {
        _addOwner(newOwner);
    }

    /**
     * @dev Add a mew owner.
     * @param newOwner The address to transfer ownership to.
     */
    function _addOwner(address newOwner) internal {
        require(newOwner != 0x0);
        _owners[newOwner] = true;
        emit OwnershipAdded(newOwner, msg.sender);
    }

    /**
     * @dev Remove a owner.
     * @param owner The address to transfer ownership to.
     */
    function removeOwner(address owner) public onlyOwner {
        delete _owners[owner];
        emit OwnershipRemoved(owner, msg.sender);
    }

}
