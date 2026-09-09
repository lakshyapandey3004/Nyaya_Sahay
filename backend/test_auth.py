import urllib.request
import urllib.error
import json

def test_auth():
    url = 'http://127.0.0.1:8000/api/auth/login'
    
    # 1. Test Invalid Login
    req_bad = urllib.request.Request(
        url,
        data=json.dumps({'email': 'police.officer@nyayasahay.gov.in', 'password': 'WrongPassword123'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req_bad) as response:
            print("ERROR: Invalid login was accepted!")
    except urllib.error.HTTPError as e:
        body = json.loads(e.read().decode('utf-8'))
        print("PASS - Invalid login rejected with HTTP", e.code, ":", body)

    # 2. Test Valid Login
    req_good = urllib.request.Request(
        url,
        data=json.dumps({'email': 'police.officer@nyayasahay.gov.in', 'password': 'Police#2026'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req_good) as response:
            body = json.loads(response.read().decode('utf-8'))
            print("PASS - Valid login succeeded:", body['user']['name'], "(Role:", body['user']['role'] + ")")
    except Exception as e:
        print("ERROR: Valid login failed:", e)

if __name__ == '__main__':
    test_auth()
