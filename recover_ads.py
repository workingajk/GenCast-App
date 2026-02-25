import os
import django
import re

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gencast_backend.settings')
django.setup()

from podcasts.models import Podcast

def recover_from_ads():
    for p in Podcast.objects.all():
        if p.audio_file:
            # The "ghost" file path that Windows/Django produced
            old_path = p.audio_file.path
            
            # Sanitize for the NEW path
            clean_title = re.sub(r'[^\w\s-]', '', p.title[:20]).strip().replace(' ', '_')
            new_filename = f"{p.id}_{clean_title}.mp3"
            new_abs_path = os.path.join(os.path.dirname(old_path), new_filename)
            new_rel_path = f"podcasts/{new_filename}"
            
            if ":" in os.path.basename(old_path):
                print(f"Attempting to recover Podcast {p.id}: {p.title}")
                try:
                    # On Windows, opening path:to:file with colon works if it's an ADS
                    with open(old_path, 'rb') as f_src:
                        data = f_src.read()
                    
                    if len(data) > 0:
                        with open(new_abs_path, 'wb') as f_dst:
                            f_dst.write(data)
                        print(f"  Successfully recovered {len(data)} bytes to {new_filename}")
                        
                        # Update DB
                        p.audio_file.name = new_rel_path
                        p.save()
                        
                        # Optionally delete the old 0-byte file (the base of the ADS)
                        base_file = old_path.split(':')[0]
                        if os.path.exists(base_file):
                            os.remove(base_file)
                    else:
                        print("  Source stream was empty.")
                except Exception as e:
                    print(f"  Recovery failed: {e}")

if __name__ == "__main__":
    recover_from_ads()
