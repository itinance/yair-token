pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract YairBrandedToken is IERC20 {
    using SafeMath for uint256;

    string public name = "Yair Branded Token";
    string public symbol = "YBT";
    uint8 public decimals = 18;

    // The address of the contract creator
    address internal _creator;

    // the maximum supply on tokens that can be minted
    uint256 _maxSupply;

    // mapping storing the balance of each address
    mapping(address => uint256) internal _balances;

    // mapping storing the balance of each address for specific artwork
    mapping(string => mapping(address => uint256)) internal _balancesPerArtwork;

    // A mapping of token owners
    mapping(uint256 => address) internal owners;

    constructor(uint initialSupply, uint256 maxSupply) public {
        require(msg.sender != address(0));
        require(initialSupply <= maxSupply);

        _maxSupply = maxSupply;
        _creator = msg.sender;

        // All initial tokens belong to creator, so set the balance
        _balances[msg.sender] = initialSupply;
    }

    function getCreator() external view returns (address) {
        return _creator;
    }

    function totalSupply() external view returns (uint256) {
        return 0;
    }

    function mintTokenForArtworkId(uint256 count, string artworkId) {
        // Make sure only the contract creator can call this
        require(msg.sender == _creator);
        require(count > 0);

        _balances[msg.sender] = _balances[msg.sender].add(count);
        _balancesPerArtwork[artworkId][msg.sender] = _balancesPerArtwork[artworkId][msg.sender].add(count);
    }

    /**
     * @dev mint tokens for specific artwork and send them to a buyer
     * @param count The number of how many token will be minted
     * @param artworkId The artwork ID for which the token will be minted
     * @param buyer The buyer where the token will be send to
     */
    function mintTokenForArtworkIdAndSendTo(uint256 count, string artworkId, address buyer) {
        // Make sure only the contract creator can call this
        require(msg.sender == _creator);
        require(count > 0);
        require(buyer != address(0));

        // increase the generell token count for buyer
        _balances[buyer] = _balances[buyer].add(count);

        // increase the balances for artwork for the buyer
        _balancesPerArtwork[artworkId][buyer] = _balancesPerArtwork[artworkId][buyer].add(count);
    }

    /**
     * @param buyer Returns the number of tokens for specific owner
     */
    function balanceOf(address owner) external view returns (uint256) {
        return _balances[owner];
    }

    /**
     * @param buyer Returns the number of tokens for specific owner for a specific artwork
     */
    function balancePerArtworkOf(string artworkId, address owner) external view returns (uint256) {
        return _balancesPerArtwork[artworkId][owner];
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return 0;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        return false;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        return false;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        return false;
    }

}

