from rest_framework import viewsets,filters,permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Specialization, CustomUser, PatientHistory
from .serializers import SpecializationListSerializer, SpecializationDetailSerializer, DoctorSerializer
from .filters import SpecializationFilter, DoctorFilter
from django_filters.rest_framework import DjangoFilterBackend
from .Pagination import DoctorPagination
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer,PatientHistorySerializer
from .serializers import ContactUsSerializer
from django.core.mail import send_mail
from django.db.models import Avg, Count
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.exceptions import NotFound

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'error':'refresh is required'}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Successfully logged out"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "Invalid token or other issue occurred", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SpecializationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Specialization.objects.all().order_by('name')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = SpecializationFilter
    search_fields = ['name']
    permission_classes = [AllowAny]
    pagination_class = None

    def get_serializer_class(self):
        """استخدام `SpecializationListSerializer` للقائمة و `SpecializationDetailSerializer` عند تحديد تخصص"""
        if self.action == 'list':
            return SpecializationListSerializer
        return SpecializationDetailSerializer

    @action(detail=True, methods=['get'])
    def doctors(self, request, pk=None):
        """إرجاع جميع الأطباء المرتبطين بتخصص معين"""
        specialization = self.get_object()
        doctors = CustomUser.objects.filter(specialization=specialization, role='doctor', is_approved=True)

        filtered_doctors = DoctorFilter(request.GET, queryset=doctors).qs  # تطبيق الفلاتر هنا

        if not filtered_doctors.exists():
            return Response({"message": "No approved doctors found for this specialization."}, status=200)

        serializer = DoctorSerializer(filtered_doctors, many=True)  # استخدام الأطباء بعد الفلترة
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='doctors/(?P<doctor_id>[^/.]+)')
    def doctor_detail(self, request, pk=None, doctor_id=None):
        """إرجاع بيانات طبيب معين داخل تخصص معين"""
        specialization = self.get_object()
        doctor = get_object_or_404(CustomUser, id=doctor_id, specialization=specialization, role='doctor', is_approved=True)

        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)



class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.filter(role='doctor', is_approved=True).order_by('id')
    serializer_class = DoctorSerializer
    pagination_class = DoctorPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = DoctorFilter
    search_fields = ['username', 'location', 'specialization__name']

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)




class ContactUsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactUsSerializer(data=request.data)
        if serializer.is_valid():
            # استخراج البيانات
            name = serializer.validated_data['name']
            email = serializer.validated_data['email']
            subject = serializer.validated_data['subject']
            message = serializer.validated_data['message']

            send_mail(
                subject=f"New Contact Form Submission: {subject}",
                message=f"Name: {name}\nEmail: {email}\nMessage: {message}",
                from_email=email,
                recipient_list=['ks0894976@gmail.com'],
            )

            # إرجاع رسالة نجاح
            return Response({"message": "Your message has been sent successfully!"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class TopDoctorsAPIView(APIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Number of top doctors to return (default: 5)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ]
    )
    def get(self, request):

        limit = request.query_params.get('limit', 5)
        try:
            limit = int(limit)
        except ValueError:
            limit = 5  # fallback للعدد الافتراضي لو حد بعت limit غلط

        top_doctors = CustomUser.objects.annotate(
            avg_rating=Avg('doctor_reviews__rating'),
            total_reviews=Count('doctor_reviews')
        ).filter(
            role='doctor',
            is_approved=True,
            total_reviews__gte=1
        ).order_by('-avg_rating')[:limit]

        serializer = DoctorSerializer(top_doctors, many=True, context={'request': request})
        return Response(serializer.data)


class AddPatientHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, patient_id):
        doctor = request.user
        if doctor.role != 'doctor':
            return Response({"error": "Only doctors can add medical history."}, status=status.HTTP_400_BAD_REQUEST)

        # جلب المريض باستخدام patient_id
        patient = get_object_or_404(CustomUser, id=patient_id, role='patient')

        # استخدام الـ Serializer لحفظ التاريخ الطبي
        serializer = PatientHistorySerializer(data=request.data)
        if serializer.is_valid():
            # ربط السجل الطبي بالمريض والطبيب
            serializer.save(patient=patient, doctor=doctor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id):
        user = request.user

        # التأكد من أن المريض أو الطبيب يمكنه الوصول للتاريخ المرضي
        patient = get_object_or_404(CustomUser, id=patient_id, role='patient')

        # إذا كان المستخدم هو الطبيب، يمكنه رؤية كل السجل الطبي لجميع المرضى
        if user.role == 'doctor':
            history = PatientHistory.objects.filter(patient=patient)
        # إذا كان المستخدم هو المريض نفسه، يمكنه رؤية سجله الطبي فقط
        elif user.role == 'patient' and user == patient:
            history = PatientHistory.objects.filter(patient=patient)
        else:
            return Response({"error": "You are not authorized to view this patient's history."}, status=status.HTTP_403_FORBIDDEN)

        serializer = PatientHistorySerializer(history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)