from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
import os

# Access environment variables
BLIZZARD_API_CLIENT_ID = os.getenv('BLIZZARD_API_CLIENT_ID')
BLIZZARD_API_CLIENT_SECRET = os.getenv('BLIZZARD_API_CLIENT_SECRET')

def index(request):
    print("[T]", BLIZZARD_API_CLIENT_ID, BLIZZARD_API_CLIENT_SECRET)
    return HttpResponse("Hello, world. You're at the wow-api index.")