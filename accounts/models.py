from django.db import models
from django.contrib.auth.hashers import make_password

#Teachers table for login
class Teacher(models.Model):
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"

    def save(self, *args, **kwargs):
        # Only hash if not already hashed
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)