import os
import django
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.append('d:\\dev\\GenCast')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gencast_backend.settings')
django.setup()

from podcasts.services import generate_plan
import json

res = generate_plan("Future of AI in healthcare")
print(json.dumps(res, indent=2))
