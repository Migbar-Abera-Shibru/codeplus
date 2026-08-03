# test_github_connection.py
import httpx
import asyncio
import socket

async def test_connection():
    print("=== Testing GitHub API Connection ===")
    
    # 1. Test DNS resolution
    try:
        ip = socket.gethostbyname('api.github.com')
        print(f"✅ DNS resolution successful: {ip}")
    except Exception as e:
        print(f"❌ DNS resolution failed: {e}")
        return
    
    # 2. Test HTTPS connection
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("https://api.github.com/users/torvalds")
            print(f"✅ HTTPS connection successful! Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ User found: {data.get('login')} (ID: {data.get('id')})")
                print(f"   Followers: {data.get('followers')}")
                print(f"   Public repos: {data.get('public_repos')}")
            else:
                print(f"❌ Unexpected status: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
    except httpx.ConnectError as e:
        print(f"❌ Connection error: {e}")
        print("   This usually means:")
        print("   - You're behind a corporate firewall/proxy")
        print("   - Your antivirus is blocking the connection")
        print("   - You need to configure a proxy")
    except httpx.TimeoutException as e:
        print(f"❌ Timeout error: {e}")
        print("   The request took too long. Check your internet speed.")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        print(f"   Type: {type(e).__name__}")
    
    # 3. Test with requests library if available
    try:
        import requests
        print("\n=== Testing with requests library ===")
        response = requests.get("https://api.github.com/users/torvalds", timeout=10)
        print(f"✅ requests successful! Status: {response.status_code}")
    except ImportError:
        print("\n⚠️  requests library not installed (optional)")
    except Exception as e:
        print(f"❌ requests error: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())