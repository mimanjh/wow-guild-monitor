from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('character', views.character_detail, name='character_detail'),
    # path('characters/<int:character_id>/', views.character_detail, name='character_detail'),
    path('guild/roaster', views.guild_roaster, name='guild_roaster'),
    # path('guild/<int:guild_id>/', views.guild_detail, name='guild_detail'),
]