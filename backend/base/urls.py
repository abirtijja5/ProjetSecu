from django.urls import path
from .views import get_produits, CustomTokenObtainPairView, CustomTokenRefreshView, logout, register, is_logged_in

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', logout),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('produits/', get_produits),
    path('register/', register),
    path('authenticated/', is_logged_in),
]