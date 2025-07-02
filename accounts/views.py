from rest_framework import generics, permissions
from .models import Profile
from .serializers import ProfileSerializer
from django.http import JsonResponse
from .models import Room

class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
