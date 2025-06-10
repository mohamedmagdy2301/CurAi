from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):

        try:
            user = get_user_model().objects.get(
                Q(username=username) | Q(email=username)
            )
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except get_user_model().DoesNotExist:
            return None
        return None
