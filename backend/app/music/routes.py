from . import music
from flask import jsonify, request
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests
from ..config import Config
from app import cache

# Spotify setup
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=Config.SPOTIFY_CLIENT_ID,
    client_secret=Config.SPOTIFY_CLIENT_SECRET
))

@music.route('/recommendations', methods=['GET'])
def get_recommendations():
    """Route to recommend similar artists based on the provided artist name"""
    artist_name = request.args.get('artist', 'Adele')

    # Get artist ID
    results = sp.search(q=artist_name, type='artist')
    if not results['artists']['items']:
        return jsonify({'artists': []})
    artist_id = results['artists']['items'][0]['id']

    # Get similar artists from Spotify
    similar_artists_spotify = sp.artist_related_artists(artist_id)
    spotify_artists = [artist['name'] for artist in similar_artists_spotify['artists'][:15]]

    # Get similar artists from Last.fm
    lastfm_url = f"http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist={artist_name}&api_key={Config.LASTFM_API_KEY}&format=json&limit=15"
    response = requests.get(lastfm_url)
    similar_artists_lastfm = response.json()['similarartists']['artist']
    lastfm_artists = [artist['name'] for artist in similar_artists_lastfm]

    # Combine results and remove duplicates
    combined_artists = list(set(spotify_artists + lastfm_artists))

    # Create final recommendation object
    recommendations = {
        'artists': combined_artists
    }

    return jsonify(recommendations)


@music.route('/artist-info', methods=['GET'])
def get_artist_info():
    """route to get artist information"""
    artist_name = request.args.get('artist', 'Adele')


    results = sp.search(q=artist_name, type='artist')
    if not results['artists']['items']:
        return jsonify({'error': 'Artist not found'}), 404
    artist = results['artists']['items'][0]
    artist_id = artist['id']


    top_tracks = sp.artist_top_tracks(artist_id)['tracks'][:10]
    top_tracks_info = []


    for track in top_tracks:

        track_info = {
            'name': track['name'],
            'preview_url': track.get('preview_url'),

        }
        top_tracks_info.append(track_info)

    # Combine results
    artist_info = {
        'name': artist['name'],
        'bio': f"Genres: {', '.join(artist['genres'])}. Popularity: {artist['popularity']}",
        'image_url': artist['images'][0]['url'] if artist['images'] else '',
        'top_tracks': top_tracks_info,
        'social_media': artist['external_urls'].get('spotify', '')
    }

    return jsonify(artist_info)


@music.route('/artist-suggestions', methods=['GET'])
def get_artist_suggestions():
    """Route to get artist suggestions based on the query"""
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    # Search for artists on Spotify
    results = sp.search(q=query, type='artist', limit=5)
    suggestions = [{'name': artist['name']} for artist in results['artists']['items']]

    return jsonify({'suggestions': suggestions})


