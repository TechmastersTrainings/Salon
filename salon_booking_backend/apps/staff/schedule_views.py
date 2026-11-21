from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import StaffSchedule, Staff
from .serializers import StaffScheduleSerializer


class CreateStaffScheduleView(generics.CreateAPIView):
    serializer_class = StaffScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        staff = serializer.validated_data["staff"]

        if user.role != "owner" or staff.salon.owner != user:
            raise PermissionDenied("Only salon owners can manage schedules")

        serializer.save()


class StaffScheduleListView(generics.ListAPIView):
    serializer_class = StaffScheduleSerializer
    permission_classes = [AllowAny]  # Now AllowAny is defined

    def get_queryset(self):
        staff_id = self.kwargs.get("staff_id")
        return StaffSchedule.objects.filter(staff_id=staff_id).order_by('day_of_week')


class UpdateStaffScheduleView(generics.UpdateAPIView):
    serializer_class = StaffScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StaffSchedule.objects.filter(staff__salon__owner=self.request.user)


class BulkCreateScheduleView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StaffScheduleSerializer

    def post(self, request, staff_id):
        user = self.request.user
        staff = get_object_or_404(Staff, id=staff_id, salon__owner=user)

        schedules_data = request.data.get('schedules', [])
        created_schedules = []
        errors = []

        for schedule_data in schedules_data:
            schedule_data['staff'] = staff.id
            serializer = StaffScheduleSerializer(data=schedule_data)
            if serializer.is_valid():
                serializer.save()
                created_schedules.append(serializer.data)
            else:
                errors.append({
                    'data': schedule_data,
                    'errors': serializer.errors
                })

        response_data = {'created': created_schedules}
        if errors:
            response_data['errors'] = errors
            return Response(response_data, status=status.HTTP_207_MULTI_STATUS)

        return Response(response_data, status=status.HTTP_201_CREATED)