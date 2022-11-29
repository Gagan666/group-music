from django.shortcuts import render
from django.apps import apps
from .credentials import REDIRECT_URI,CLIENT_ID,CLIENT_SECRET
from rest_framework.decorators import api_view
from requests import Request,post
from rest_framework.response import Response
from rest_framework import status
from .util import *
# Create your views here.
# @api_view(['POST'])
# def getHost(request):
Rooms = apps.get_model("api.Rooms")
@api_view(['GET'])
def AuthUrl(request):
    scopes='user-read-playback-state user-modify-playback-state user-read-currently-playing'

    url= Request('GET','https://accounts.spotify.com/authorize',params={
        'scope':scopes,
        'response_type':'code',
        'redirect_uri':REDIRECT_URI,
        'client_id':CLIENT_ID
    }).prepare().url

    return Response({'url':url},status=status.HTTP_200_OK)

@api_view(['POST'])
def spotify_callback(request):
    print("hehehe")
    host=request.data['host']
    #make a way to initialize host value
    code = request.data['codes']
    print(code)
    # error = request.GET.get('error')
    response = post('https://accounts.spotify.com/api/token',data={
        'grant_type':'authorization_code',
        'code':code,
        'redirect_uri':REDIRECT_URI,
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET

    }).json()
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')
    print(access_token,token_type,refresh_token,expires_in)
    update_or_create_user_tokens(session_id=host,access_token=access_token,token_type=token_type,expires_in=expires_in,refresh_token=refresh_token)
    return Response({'url':'/'},status=status.HTTP_200_OK)

@api_view(['POST'])
def IsAuthenticated(request):
    host=request.data['host']
    is_Authenticated = isSpotifyIsAuthenticated(host)
    return Response({'status':is_Authenticated},status=status.HTTP_200_OK)

@api_view(['POST'])
def current_song(request):
    data = request.data
    room_code = data['code']
    Rooms = apps.get_model("api.Rooms")
    room = Rooms.objects.filter(code = room_code)
    if room.exists():
        host = room[0].host
    else:
        return Response({},status=status.HTTP_404_NOT_FOUND)
    endpoint = "player/currently-playing"
    response = execute_spotify_api_request(host,endpoint)

    if 'error' in response or 'item' not in response:
        print(response)
        return Response({},status=status.HTTP_204_NO_CONTENT)

    item = response.get('item')
    print(item)
    duration = item.get('duration_ms')
    progress = response.get('progress_ms')
    album_cover = item.get('album').get('images')[0].get('url')
    is_playing = response.get("is_playing")
    song_id = item.get('id')
    artist_string = ""
    for i,artist in enumerate(item.get('artists')):
        if i >0:
            artist_string+=","
        name = artist.get('name')
        artist_string+=name
    song = {
        'title':item.get('name'),
        'artist':artist_string,
        'duration':duration,
        'time':progress,
        'image_url':album_cover,
        'is_playing':is_playing,
        'votes':0,
        'id':song_id
    }
    print(song)
    return Response(song,status=status.HTTP_200_OK)

@api_view(['POST'])
def PauseSong(request):
    data = request.data
    room_code = data['code']
    room = Rooms.objects.filter(code=room_code)[0]
    print("-------------------------------------------")
    print(room)
    if data['host']==room.host or room.guest_can_pause:
        pause_song(room.host)
        return Response({},status=status.HTTP_204_NO_CONTENT)
    return Response({},status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def PlaySong(request):
    data = request.data
    room_code = data['code']
    room = Rooms.objects.filter(code=room_code)[0]
    print("-------------------------------------------")
    print(room)
    if data['host']==room.host or room.guest_can_pause:
        play_song(room.host)
        return Response({},status=status.HTTP_204_NO_CONTENT)
    return Response({},status=status.HTTP_403_FORBIDDEN)