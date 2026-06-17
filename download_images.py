import sqlite3
import requests
import os
import time

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'ecommerce.db')
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute('SELECT id, name, image FROM product')
products = cur.fetchall()

for pid, name, old_img in products:
    if 'placehold.co' not in old_img:
        print(f'Skipping {name} (already has custom image)')
        continue

    search = name.lower().replace('"', '').replace("'", '')
    search = '+'.join(search.split()[:4])
    filename = f'product_{pid}_{search.replace("+","_")}.jpg'
    filepath = os.path.join(UPLOAD_DIR, filename)

    urls = [
        f'https://loremflickr.com/400/400/{search.split("+")[0]}',
        f'https://loremflickr.com/400/400/{search}',
    ]

    downloaded = False
    for url in urls:
        try:
            print(f'Downloading: {name} -> {url}')
            r = requests.get(url, timeout=15, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            if r.status_code == 200 and len(r.content) > 1000:
                with open(filepath, 'wb') as f:
                    f.write(r.content)
                new_img = f'/static/uploads/{filename}'
                cur.execute('UPDATE product SET image = ? WHERE id = ?', (new_img, pid))
                conn.commit()
                print(f'  -> Saved {filename} ({len(r.content)} bytes)')
                downloaded = True
                break
        except Exception as e:
            print(f'  -> Error: {e}')
        time.sleep(1)

    if not downloaded:
        print(f'  -> Failed to download for {name}')

conn.close()
print('\nDone! All product images updated.')
