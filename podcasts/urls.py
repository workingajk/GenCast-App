from django.urls import path
from .views import (
    PodcastCreateView, 
    PodcastListView, 
    PodcastDetailView, 
    PodcastScriptView,
    PodcastGenerateScriptView,
    PodcastGenerateAudioView
)

urlpatterns = [
    path('create/', PodcastCreateView.as_view(), name='podcast-create'),
    path('', PodcastListView.as_view(), name='podcast-list'),
    path('<int:pk>/', PodcastDetailView.as_view(), name='podcast-detail'),
    path('<int:pk>/script/', PodcastScriptView.as_view(), name='podcast-script'),
    # Use 'generate/' prefix for action endpoints to avoid conflicts
    path('<int:pk>/generate-script/', PodcastGenerateScriptView.as_view(), name='podcast-generate-script'),
    path('<int:pk>/generate-audio/', PodcastGenerateAudioView.as_view(), name='podcast-generate-audio'),
]
