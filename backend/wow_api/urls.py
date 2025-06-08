from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('character', views.character_detail, name='character_detail'),
    # path('characters/<int:character_id>/', views.character_detail, name='character_detail'),
    path('guild/roaster', views.guild_roaster, name='guild_roaster'),
    # path('guild/<int:guild_id>/', views.guild_detail, name='guild_detail'),
    path("oauth/start/", views.start_oauth, name="start_oauth"),
    path("oauth/callback/", views.oauth_callback, name="oauth_callback"),
    path("isAdmin", views.is_admin, name="is_admin")
]