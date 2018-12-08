pragma solidity 0.4.24;


contract ArtworkRegistry {

    struct Artwork {
        bytes16 id;
        string title;
        string artists;
    }

    mapping(bytes16 => Artwork) _artworks;

    event ArtworkWasRegistered(bytes16 artworkId, string title, string artist);

    function registerArtwork(bytes16 artworkId, string title, string artist) external returns (bool) {
        require( ! _isArtworkRegistered(artworkId) );

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