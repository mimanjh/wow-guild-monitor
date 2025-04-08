from django.db import models

# Create your models here.
class BlizzardAPIToken(models.Model):
    access_token = models.TextField()
    expires_at = models.DateTimeField()