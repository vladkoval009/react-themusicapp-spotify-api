let accessToken;
// remove for git
const clientID = '2a4e581161914af1bb83e5e888705d20';
const redirectUri = 'http://localhost:3000';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // Check for an access token match.

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch);
            // Clear the param. to get a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null,'/');
            return accessToken;
        } else {
            const accessUrl = 'https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}';
            window.location = accessUrl;
        }
    }


    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch('http://api.spotify.com/v1/search?type=track&q=${term}', {
         headers: {
            Authorisation: 'Bearer ${accessToken} '
        }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
            return []
        }
        return jsonResponse.tracks.items.map(tracks => ({
            id: track.id,
            name: track.name,
            artist: track.artist[0].name,
            album: track.album.name,
            uri:t track.uri
        }))
    })
}

export default Spotify;