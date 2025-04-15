import requests
import os
from django.utils.timezone import now, timedelta
from requests.auth import HTTPBasicAuth

REFRESH_TOKEN_URL = 'https://oauth.battle.net/token'

# Access environment variables
BLIZZARD_API_CLIENT_ID = os.getenv('BLIZZARD_API_CLIENT_ID')
BLIZZARD_API_CLIENT_SECRET = os.getenv('BLIZZARD_API_CLIENT_SECRET')

_token_cache = {
    "access_token": None,
    "expires_at": None,
}

def refresh_blizzard_token():
    # Implement logic to refresh the token
    response = requests.post(REFRESH_TOKEN_URL, data={
        'grant_type': 'client_credentials'
    }, auth=HTTPBasicAuth(BLIZZARD_API_CLIENT_ID, BLIZZARD_API_CLIENT_SECRET))

    if(response.status_code == 200):
        data = response.json()
        access_token = data["access_token"]
        expires_in = data["expires_in"]

        expires_at = now() + timedelta(seconds=expires_in)

        _token_cache["access_token"] = access_token
        _token_cache["expires_at"] = expires_at
        return access_token
    else:
        raise Exception(f"Failed to get token: {response.status_code} - {response.text}")

def get_blizzard_valid_token():
    access_token = _token_cache["access_token"]
    expires_at = _token_cache["expires_at"]

    if access_token is None or expires_at is None or expires_at <= now():
        return refresh_blizzard_token()
    return access_token

def fetch_character_data(server, name):
    if(not server or not name):
        raise Exception("Server and name must be provided")
    
    server = server.lower()
    name = name.lower()

    token = get_blizzard_valid_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"https://us.api.blizzard.com/profile/wow/character/{server}/{name}?namespace=profile-us&locale=en_US", headers=headers)
    return response.json()

def fetch_guild_roaster_data(server, name):
    if(not server or not name):
        raise Exception("Server and name must be provided")
    
    server = server.lower()
    name = name.lower().replace(" ", "-")

    token = get_blizzard_valid_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"https://us.api.blizzard.com/data/wow/guild/{server}/{name}/roster?namespace=profile-us", headers=headers)
    return response.json()