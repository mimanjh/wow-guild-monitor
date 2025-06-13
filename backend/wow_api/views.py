import json
import os

import requests
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .data_store import read_db, write_db
from .utils import fetch_character_data, fetch_guild_admins, fetch_guild_roaster_data


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
    
@require_GET
def start_oauth(request):
    client_id = os.getenv("BLIZZARD_API_CLIENT_ID")
    redirect_uri = os.getenv("BLIZZARD_REDIRECT_URI")
    return redirect(
        f"https://oauth.battle.net/authorize?response_type=code"
        f"&client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=wow.profile openid"
        f"&state=AbCdEfg"
    )

@require_GET
def oauth_callback(request):
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "No code provided"}, status=400)

    client_id = os.getenv("BLIZZARD_API_CLIENT_ID")
    client_secret = os.getenv("BLIZZARD_API_CLIENT_SECRET")
    redirect_uri = os.getenv("BLIZZARD_REDIRECT_URI")

    token_url = "https://oauth.battle.net/token"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
    }

    response = requests.post(token_url, data=data, auth=(client_id, client_secret))

    try:
        response.raise_for_status()
        token_data = response.json()
        
        redirect_response = redirect("http://127.0.0.1:5173/?authenticated=true")
        redirect_response.set_signed_cookie(
            key="access_token",
            value=token_data["access_token"],
            httponly=True,
            max_age=3600,
            samesite="Lax",
            secure=False # True if HTTPS
        )
        return redirect_response
    
    except requests.RequestException:
        return JsonResponse({"error": "Token exchange failed", "details": response.text}, status=400)
    
@require_GET
def is_admin(request):
    server = request.GET.get("server")
    guild_name = request.GET.get("name")

    access_token = request.get_signed_cookie("access_token", default=None)
    print("access_token: ", access_token)
    if not access_token:
        return JsonResponse({"error": "User is not authenticated"}, status=401)

    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"namespace": "profile-us", "locale": "en_US"}

    char_list_url = "https://us.api.blizzard.com/profile/user/wow"
    res = requests.get(char_list_url, headers=headers, params=params)
    if res.status_code != 200:
        return JsonResponse({"error": "Failed to fetch user characters"}, status=500)

    accounts = res.json().get("wow_accounts", [])
    is_admin = False

    guild_admins = fetch_guild_admins(server, guild_name)

    for account in accounts:
        for char in account.get("characters", []):
            char_name = char["name"].lower()
            for admin in guild_admins:
                print(char_name, ": ", admin["character"]["name"])
                if admin["rank"] in [0, 1] and admin["character"]["name"].lower() == char_name:
                    is_admin = True
                    break

    return JsonResponse({"is_admin": is_admin})

@require_GET
def list_users(request):
    return JsonResponse(read_db()["users"], safe=False)

@require_POST
def add_user(request):
    payload = json.loads(request.body)
    db = read_db()
    db["users"].append(payload)
    write_db(db)
    return JsonResponse(payload, status=201)

@require_http_methods(["PUT"])
def update_user(request):
    payload = json.loads(request.body)
    char_name = payload.get("character")
    realm = payload.get("realm")

    if not char_name or not realm:
        return JsonResponse({"error": "Missing character or realm"}, status=400)

    db = read_db()
    updated = False

    for user in db["users"]:
        if user["character"].lower() == char_name.lower() and user["realm"].lower() == realm.lower():
            user.update(payload)
            updated = True
            break

    if not updated:
        return JsonResponse({"error": "User not found"}, status=404)

    write_db(db)
    return JsonResponse({"status": "updated", "user": payload})

@require_GET
def update_db(request):
    db = read_db()
    users = db.get("users", [])

    for user in users:
        try:
            data = fetch_character_data(user["realm"], user["character"])
            user.update({
                "average_item_level": data.get("average_item_level", user.get("average_item_level")),
                "faction": data.get("faction", {}).get("name", user.get("faction")),
                "character_class": data.get("playable_class", {}).get("name", user.get("character_class")),
                "character_spec": data.get("active_spec", {}).get("name", user.get("character_spec")),
                "last_login_timestamp": data.get("last_login_timestamp", user.get("last_login_timestamp")),
            })
        except Exception as e:
            print(f"Failed to update user {user['character']} from {user['realm']}: {e}")

    write_db({"users": users})
    return JsonResponse({"status": "updated", "users": users})
