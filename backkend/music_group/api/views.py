from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
from .models import Rooms
from .serializers import RoomSerializer


@api_view(['POST'])
def createrooms(request):
    data = request.data
    if not request.session.exists(request.session.session_key):
        request.session.create()
    host = request.session.session_key

    room = Rooms.objects.create(
        host=host, guest_can_pause=data['guest_can_pause'], votes_to_skip=data['votes_to_skip'])
    room_ser = RoomSerializer(room, many=False)
    return Response(room_ser.data)

@api_view(['GET'])
def getinfoaboutallrooms(request):
    rooms = Rooms.objects.all()
    room_ser = RoomSerializer(rooms, many=True)
    return Response(room_ser.data)

@api_view(['POST'])
def updateRoomSettings(request):
    data=request.data
    host=data['host']
    query = Rooms.objects.filter(host=host)
    if query.exists():
        room = query[0]
        room.guest_can_pause = data['guest_can_pause']
        room.votes_to_skip = data['votes_to_skip']
        room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
        room_ser = RoomSerializer(room, many=False)
        return Response(room_ser.data,status=status.HTTP_200_OK)
    return Response({"msg":"Invalid Room"},status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getRoom(request):
    code = request.GET["code"]
    data= {"msg":"Room Doesnt Exist"}
    if code!=None:
        room = Rooms.objects.filter(code=code)
        if len(room)>0:
            data=RoomSerializer(room[0],many=False).data
            return Response(data,status=status.HTTP_200_OK)
    return Response(data,status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def joinRoom(request):
    data = request.data
    code = data["code"]
    print(code)
    if not request.session.exists(request.session.session_key):
        request.session.create()
    if code!=None:
        room_result = Rooms.objects.filter(code=code)
        if len(room_result)>0:
            room = room_result[0]
            request.session['room_code']=code
            print(RoomSerializer(room,many=False).data)
            return Response(RoomSerializer(room,many=False).data,status=status.HTTP_200_OK)
        return Response({"msg": "Invalid Room Code!!"},status=status.HTTP_404_NOT_FOUND)
    return Response({"msg": "Bad Request !!"},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def deleteRoom(request):
    data = request.data
    rooms = Rooms.objects.get(code=data['code'])
    rooms.delete()
    return Response("Deleted the Room")

