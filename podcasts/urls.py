from django.urls import path
from .views import PodcastCreateView

urlpatterns = [
    path('create/', PodcastCreateView.as_view(), name='podcast-create'),
]
