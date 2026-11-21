# apps/accounts/auth_views.py
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken

from salon_booking_backend.apps.accounts.auth_serializers import LoginSerializer


class LoginView(generics.GenericAPIView):

    serializer_class = LoginSerializer

    def post(self, request):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })