from rest_framework import generics, status, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from core.security import AuthAnonThrottle
from .models import User
from .serializers import UserSerializer
from .auth_serializers import RegisterSerializer, LoginSerializer

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role != 'admin' and not user.is_staff and not user.is_superuser:
            return User.objects.none()
        return User.objects.all()

# FIXED: Change from RetrieveAPIView to RetrieveUpdateAPIView
class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_staff or user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=user.id)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [AuthAnonThrottle]

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    throttle_classes = [AuthAnonThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class ApproveOwnerView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)

        try:
            user = User.objects.get(pk=pk)
            user.is_owner_approved = True
            user.save()
            return Response({'message': 'Owner approved successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)