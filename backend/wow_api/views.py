from django.http import HttpResponse, JsonResponse
from .utils import fetch_character_data, fetch_guild_roaster_data
from django.views.decorators.http import require_GET

def index(request):
    return HttpResponse("Hello, world. You're at the wow_api index.")

@require_GET
def character_detail(request):
    server = request.GET.get("server")
    name = request.GET.get("name")

    if not server or not name:
        return JsonResponse({"error": "Missing required parameters."}, status=400)

    try:
        data = fetch_character_data(server, name)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@require_GET
def guild_roaster(request):
    server = request.GET.get("server")
    name = request.GET.get("name")

    if not server or not name:
        return JsonResponse({"error": "Missing required parameters."}, status=400)

    try:
        data = fetch_guild_roaster_data(server, name)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    