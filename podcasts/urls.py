from django.urls import path
from .views import (
    PodcastCreateView,
    PodcastCreateRagView,
    PodcastListView, 
    PodcastDetailView, 
    PodcastScriptView,
    PodcastGenerateScriptView,
    PodcastGenerateAudioView
)

urlpatterns = [
    path('create/', PodcastCreateView.as_view(), name='podcast-create'),
    path('create-rag/', PodcastCreateRagView.as_view(), name='podcast-create-rag'),
    path('', PodcastListView.as_view(), name='podcast-list'),
    path('<int:pk>/', PodcastDetailView.as_view(), name='podcast-detail'),
    path('<int:pk>/script/', PodcastScriptView.as_view(), name='podcast-script'),
    path('<int:pk>/generate-script/', PodcastGenerateScriptView.as_view(), name='podcast-generate-script'),
    path('<int:pk>/generate-audio/', PodcastGenerateAudioView.as_view(), name='podcast-generate-audio'),
]
