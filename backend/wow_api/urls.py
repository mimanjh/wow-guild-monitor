from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # path('guilds/', views.guilds, name='guilds'),
    # path('guilds/<int:guild_id>/', views.guild_detail, name='guild_detail'),
    path('character', views.character_detail, name='character_detail'),
    # path('characters/<int:character_id>/', views.character_detail, name='character_detail'),
]