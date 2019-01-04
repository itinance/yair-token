pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

import "./ArtworkRegistry.sol";

contract YairToken is ERC20Mintable, ERC20Detailed, ArtworkRegistry, ReentrancyGuard /*, ERC165 */ {
    using SafeMath for uint256;

    event TransferDetailled(address indexed from, address indexed to, bytes16 indexed artworkId, uint256 count);

    // the maximum supply on tokens that can be minted
    uint256 internal _maxSupply;

    // mapping storing the balance of each address for specific artwork
    mapping(bytes16 => mapping(address => uint256)) internal _balancesPerArtwork;

    // mapping storing the minted tokens for each artwork
    mapping(bytes16 => uint256) internal _totalSupplyPerArtwork;

    // A mapping of token owners
    mapping(uint256 => address) internal owners;

    constructor(uint initialSupply, uint256 maxSupply) public
        ERC20Detailed("Yair Branded Token", "YAT", 18)
    {
        require(msg.sender != address(0));
        require(initialSupply <= maxSupply);

        _maxSupply = maxSupply;
    }

    function maxSupply() external view returns (uint256) {
        return _maxSupply;
    }

    /**
     * @dev returns the total minted supply of token for a specific artwork
     */
    function totalSupplyPerArtwork(bytes16 artworkId) onlyRegistered(artworkId) external view returns (uint256) {
        return _totalSupplyPerArtwork[artworkId];
    }

    /*function mintTokenForArtworkId(uint256 count, string artworkId) {
        // Make sure only the contract creator can call this
        require(msg.sender == _creator);
        require(count > 0);
        require(_totalSupply.add(count) < _maxSupply);

        _balances[msg.sender] = _balances[msg.sender].add(count);
        _balancesPerArtwork[artworkId][msg.sender] = _balancesPerArtwork[artworkId][msg.sender].add(count);

        _totalSupply = _totalSupply.add(count);
    }*/

    /**
     * @dev mint tokens for specific artwork and send them to a buyer
     * @param count The number of how many token will be minted
     * @param artworkId string The artwork ID for which the token will be minted
     * @param buyer The buyer where the token will be send to
     */
    function mintTokenForArtworkIdAndSendTo(uint256 count, bytes16 artworkId, address buyer) public
        onlyRegistered(artworkId) onlyOwner
    {
        require(count > 0);
        require(buyer != address(0));
        require(totalSupply().add(count) <= _maxSupply);
        require(mint(buyer, count));

        _addTokenForArtworkTo(buyer, artworkId, count);

        _totalSupplyPerArtwork[artworkId] = _totalSupplyPerArtwork[artworkId].add(count);

        emit Transfer(address(0), buyer, count);
        emit TransferDetailled(address(0), buyer, artworkId, count);
    }

    /**
     * @dev Function to mint tokens. Controls that the CAP will be maintained
     * after minting and then calls the MintableToken's function
     * @param to The address that will receive the minted tokens.
     * @param value The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address to, uint256 value) public //onlyMinter
    returns (bool) {
        require(value > 0);

//        require(totalSupply() <= _maxSupply);

        return super.mint(to, value);
    }

    /**
     * @param owner the artwork
     * @param owner Returns the number of tokens for specific owner for a specific artwork
     */
    function balancePerArtworkOf(bytes16 artworkId, address owner) external onlyRegistered(artworkId) view returns (uint256) {
        return _balancesPerArtwork[artworkId][owner];
    }

    /**
     * @dev transfer artwork-related token from a buyer to another buyer
     * @param from The old account that holds the token and want to transfer
     * @param to The new buyer that will receive the token
     * @param artworkId The Artwork that is meaned
     * @param count The number of token to be removed from the buyers account
     */
    function transferTokenForArtworkFrom(address from, address to, bytes16 artworkId, uint256 count) external
        onlyRegistered(artworkId)
        returns (bool)
    {
        require(count > 0);
        require(_isApprovedOrOwner(from, artworkId, count));
        require(from != address(0));
        require(to != address(0));

        _removeTokenForArtworkFrom(from, artworkId, count);
        //require(transferFrom(from, to, count));
        _addTokenForArtworkTo(to, artworkId, count);

        emit Transfer(from, to, count);
        emit TransferDetailled(from, to, artworkId, count);
    }

    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     * @return A uint256 specifying the amount of tokens still available for the spender.
     */
    function allowance(address owner, address spender) public view returns (uint256) {
        return super.allowance(owner, spender);
    }


    /**
     * @dev removes token from the artwork-related tokens of a specific account (from)
     * @param from The buyer that holds the token
     * @param artworkId The Artwork that is meaned
     * @param count The number of token to be removed from the buyers account
     */
    function _removeTokenForArtworkFrom(address from, bytes16 artworkId, uint256 count) internal {
        require(_buyerHoldsAsLeast(from, artworkId, count));
        _balancesPerArtwork[artworkId][from] = _balancesPerArtwork[artworkId][from].sub(count);
    }

    /**
     * @dev add token from the artwork-related tokens to a specific account (from)
     * @param to The account that will receive the token
     * @param artworkId The Artwork that is meaned
     * @param count The number of token to be added to the buyers account
     */
    function _addTokenForArtworkTo(address to, bytes16 artworkId, uint256 count) internal {
        _balancesPerArtwork[artworkId][to] = _balancesPerArtwork[artworkId][to].add(count);
    }

    /**
     * @dev Returns wether the given spender is allowed to transfer a given count of tokens for a specific artwork
     * @param spender of the sepnder to query
     * @param artworkId The specific artwork
     * @param count The number of token that needs to be approved to send
     * @return bool wether the msg.sender is approved for the given artworkId holding at least the requested number of tokens
     *   or is the creator with at least the required amount of minted token for the artwork
     */
    function _isApprovedOrOwner(address spender, bytes16 artworkId, uint256 count) internal view returns (bool) {
        return (
            // the creator is approved always if the specific number of requested tokens was minted currently
            (/*isOwner() &&*/ _totalSupplyPerArtwork[artworkId] >= count)
            ||
            // or the spender holds a minimum of the minted requested token count
            _buyerHoldsAsLeast(spender, artworkId, count)
        );
    }

    function _buyerHoldsAsLeast(address spender, bytes16 artworkId, uint256 count) internal view returns (bool) {
        return _balancesPerArtwork[artworkId][spender] >= count;
    }
}

