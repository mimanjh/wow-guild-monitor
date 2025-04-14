from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, JsonResponse
from .utils import fetch_character_data, get_blizzard_valid_token
from django.views.decorators.http import require_GET

def index(request):
    return HttpResponse("Hello, world. You're at the wow_api index.")

@require_GET
def character_detail(request):
    server = request.GET.get("server")
    name = request.GET.get("name")

    if not server or not name:
        return JsonResponse({"error": "Missing required parameters."}, status=400)
    
    server = server.lower()
    name = name.lower()

    try:
        data = fetch_character_data(server, name)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    