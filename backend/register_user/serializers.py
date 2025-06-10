from rest_framework_simplejwt.tokens import RefreshToken
from rest_registration.api.serializers import DefaultRegisterUserSerializer,DefaultLoginSerializer
from .models import CustomUser, Specialization , PatientHistory
from rest_framework import serializers
from rating.models import DoctorReview
from rest_framework.exceptions import AuthenticationFailed
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Avg, Count





class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # الحصول على الـ username أو الإيميل
        username_or_email = attrs.get('username')  # نبحث عن المستخدم باستخدام 'username'

        # استدعاء validate method من EmailBackend للتحقق من البيانات
        try:
            user = get_user_model().objects.get(
                Q(username=username_or_email) | Q(email=username_or_email)
            )
        except get_user_model().DoesNotExist:
            raise AuthenticationFailed({"message": "No active account found with the given credentials"})  # تغيير الحقل إلى "message"

        # تعيين الـ user
        self.user = user

        # استدعاء الكود الأساسي للـ validate
        data = super().validate(attrs)

        # إضافة بيانات المستخدم إلى الـ response
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['bonus_points'] = self.user.bonus_points

        data['role'] = self.user.role

        # هنا بنضيف رابط صورة البروفايل
        request = self.context.get('request')  # Get request from context
        if request is not None:
            profile_pic_url = request.build_absolute_uri(self.user.profile_picture.url) if self.user.profile_picture else None
        else:
            profile_pic_url = self.user.profile_picture.url if self.user.profile_picture else None

        data['profile_picture'] = profile_pic_url


        if self.user.role == 'doctor' and not self.user.is_approved:
            raise AuthenticationFailed({"message": "Your account is under review by the admin."})

        # إضافة التوكنات
        data['refresh'] = str(self.get_token(self.user))
        data['access'] = data['access']

        return data








class CustomRegisterUserSerializer(DefaultRegisterUserSerializer):
    specialization = serializers.PrimaryKeyRelatedField(queryset=Specialization.objects.all(), required=False)
    consultation_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    location = serializers.CharField(max_length=255, required=False)

    bio = serializers.CharField(required=False, allow_blank=True)
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)



    def validate(self, attrs):
        role = attrs.get('role')
        if role == 'doctor':
            if not attrs.get('specialization'):
                raise serializers.ValidationError("Specialization is required for doctors.")
            if not attrs.get('consultation_price'):
                raise serializers.ValidationError("Consultation price is required for doctors.")
            if not attrs.get('location'):
                raise serializers.ValidationError("Location is required for doctors.")



        elif role == 'patient':
            if 'specialization' in attrs:
                attrs.pop('specialization')
            if 'consultation_price' in attrs:
                attrs.pop('consultation_price')
            if 'location' in attrs:
                attrs.pop('location')

        return attrs


    def create(self, validated_data):
        specialization = validated_data.pop('specialization', None) if validated_data.get('role') == 'doctor' else None
        user = super().create(validated_data)


        if not user.profile_picture or str(user.profile_picture) in ['None', '']:
            user.profile_picture = 'profile_pics/default_profile_pic.jpg'


        if not user.profile_certificate or str(user.profile_certificate) in ['None', '']:
            user.profile_certificate = 'profile_certificate/default_profile_certificate_pic.jpg'

        if user.role == 'doctor':
            user.is_approved = False
        else:
            user.is_approved = True

        if specialization:
            user.specialization = specialization

        user.save()
        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        refresh = RefreshToken.for_user(instance)
        # data["role"] = getattr(instance, "role", None)
        data["specialization"] = instance.specialization.name if instance.specialization else None
        # data["consultation_price"] = instance.consultation_price
        # data["location"] = instance.location
        # data["is_approved"] = instance.is_approved
        data.pop('password', None)

        if getattr(instance, "role", None) == "doctor":
            return {
                "message": f"Welcome, Dr. {instance.username}. Your account is successfully registered!",
                "note": "Your profile is under review by the administrator.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),

            }
        return {"message": f"Welcome, mr. {instance.username} Your account has been registered successfully!",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                }


#rate serializers
class DoctorReviewSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    rating = serializers.IntegerField()
    profile_picture = serializers.ImageField(source='patient.profile_picture', read_only=True)
    first_name = serializers.CharField(source='patient.first_name', read_only=True)
    last_name = serializers.CharField(source='patient.last_name', read_only=True)

    class Meta:
        model = DoctorReview
        fields = ['id','profile_picture','patient_username','first_name','last_name','rating', 'comment', 'created_at']
        ref_name = 'RegisterUserDoctorReviewSerializer'  # تحديد ref_name بشكل صريح

# show Specialization with doctor is_approved
class DoctorSerializer(serializers.ModelSerializer):
    reviews = DoctorReviewSerializer(source='doctor_reviews', many=True, read_only=True)  # إضافة التقييمات للطبيب
    specialization = serializers.CharField(source='specialization.name', read_only=True)
    profile_picture = serializers.ImageField(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id','profile_picture','username','first_name','last_name','email', 'specialization', 'consultation_price', 'location','bio','latitude','longitude', 'avg_rating', 'total_reviews', 'reviews']

    def get_avg_rating(self, obj):
        return DoctorReview.objects.filter(doctor=obj).aggregate(avg=Avg('rating'))['avg'] or 0

    def get_total_reviews(self, obj):
        return DoctorReview.objects.filter(doctor=obj).count()

class SpecializationListSerializer(serializers.ModelSerializer):
    doctor_count = serializers.SerializerMethodField()
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Specialization
        fields = ['id', 'image', 'name', 'doctor_count']

    def get_doctor_count(self, obj):
        """إرجاع عدد الأطباء الموافق عليهم في هذا التخصص"""
        return CustomUser.objects.filter(specialization=obj, role='doctor', is_approved=True).count()

class SpecializationDetailSerializer(serializers.ModelSerializer):
    doctors = DoctorSerializer(source='customuser_set', many=True, read_only=True)

    class Meta:
        model = Specialization
        fields = ['id', 'name', 'doctors']
    def get_doctors(self, obj):
        """إرجاع قائمة الأطباء الموافق عليهم فقط داخل هذا التخصص"""
        approved_doctors = CustomUser.objects.filter(specialization=obj, role='doctor', is_approved=True)
        return DoctorSerializer(approved_doctors, many=True).data


class ContactUsSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()


class PatientHistorySerializer(serializers.ModelSerializer):
    doctor_username = serializers.CharField(source='doctor.username', read_only=True)
    patient_username = serializers.CharField(source='patient.username', read_only=True)

    class Meta:
        model = PatientHistory
        fields = ['id', 'doctor', 'notes', 'created_at', 'doctor_username', 'patient_username']
