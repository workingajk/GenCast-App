import os
import django
import re

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gencast_backend.settings')
django.setup()

from podcasts.models import Podcast

def fix_podcast_files():
    for p in Podcast.objects.all():
        if p.audio_file:
            old_path = p.audio_file.path
            old_name = p.audio_file.name
            
            # Sanitize title
            clean_title = re.sub(r'[^\w\s-]', '', p.title[:20]).strip().replace(' ', '_')
            new_filename = f"{p.id}_{clean_title}.mp3"
            new_rel_path = f"podcasts/{new_filename}"
            new_abs_path = os.path.join(os.path.dirname(old_path), new_filename)
            
            if old_name != new_rel_path:
                print(f"Fixing Podcast {p.id}: {p.title}")
                print(f"  Old name: {old_name}")
                print(f"  New name: {new_rel_path}")
                
                # Check if file exists (with colon, i.e. ADS)
                # On Windows, we can access the data by referring to 'filename:stream'
                # but Django's path might be broken.
                
                # Try to use the raw path string
                if os.path.exists(old_path):
                    try:
                        os.rename(old_path, new_abs_path)
                        print(f"  Successfully renamed file to {new_abs_path}")
                        p.audio_file.name = new_rel_path
                        p.save()
                    except Exception as e:
                        print(f"  Error renaming: {e}")
                else:
                    print(f"  Source file {old_path} not found via standard os.path.exists")
                    # If it's a colon issue, maybe we can find it by listing the directory
                    dir_name = os.path.dirname(old_path)
                    files = os.listdir(dir_name)
                    # Look for the "base" part of the filename
                    base_part = f"{p.id}_{p.title[:20].replace(' ', '_')}"
                    if base_part in files:
                        print(f"  Found base file: {base_part}")
                        # We would need to read the ADS and write to new file
                        # This is getting complicated. Let's just try to re-generate it?
                        # Or use cmd to rename it.
            else:
                print(f"Podcast {p.id} already has a clean name: {old_name}")

if __name__ == "__main__":
    fix_podcast_files()
