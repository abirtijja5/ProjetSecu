from django.db import models
from django.contrib.auth.models import User

class Produit(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)  # Description du produit
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Prix du produit
    created_at = models.DateTimeField(auto_now_add=True)  # Date de création du produit
    url = models.URLField(max_length=500, blank=True, null=True)  # URL de l'image du produit
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='produits')  # Référence à l'utilisateur propriétaire
