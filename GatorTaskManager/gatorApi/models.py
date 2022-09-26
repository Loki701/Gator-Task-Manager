from django.db import models

# Create your models here.(important) b
# models are basically tables in a database
class  Users(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
