pragma solidity 0.5.0;

import "./OwnableMultiple.sol";

contract ArtworkRegistry is OwnableMultiple {

    struct Artwork {
        bytes16 id;
        string title;
        string artists;
    }

    mapping(bytes16 => Artwork) _artworks;

    event ArtworkWasRegistered(bytes16 artworkId, string title, string artist);

    modifier onlyRegistered(bytes16 artworkId) {
        require(_isArtworkRegistered(artworkId));
        _;
    }

    modifier onlyIfUnregistered(bytes16 artworkId) {
        require(! _isArtworkRegistered(artworkId));
        _;
    }

    function registerArtwork(bytes16 artworkId, string calldata title, string calldata artist) onlyIfUnregistered(artworkId) external onlyOwner returns (bool) {
        Artwork memory artwork = Artwork(artworkId, title, artist);
        _artworks[artworkId] = artwork;

        emit ArtworkWasRegistered(artworkId, title, artist);
    }

    function isArtworkRegistered(bytes16 artworkId) external view returns (bool) {
        return _isArtworkRegistered(artworkId);
    }

    function _isArtworkRegistered(bytes16 artworkId) internal view returns (bool) {
        return _artworks[artworkId].id == artworkId;
    }

}