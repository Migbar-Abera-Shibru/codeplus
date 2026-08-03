# backend/test_events.py
import asyncio
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_events():
    token = os.getenv("GITHUB_API_TOKEN")
    if not token:
        print("❌ GITHUB_API_TOKEN not found in .env file")
        print("Please add your GitHub token to .env")
        return
    
    username = "Migbar-Abera-Shibru"  # Change this to your username
    
    print(f"🔍 Fetching events for: {username}")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # Get user events
            response = await client.get(
                f"https://api.github.com/users/{username}/events/public",
                headers=headers
            )
            
            if response.status_code != 200:
                print(f"❌ Error: {response.status_code}")
                print(response.text)
                return
            
            events = response.json()
            print(f"✅ Total events: {len(events)}")
            
            if not events:
                print("⚠️  No public events found!")
                print("This could mean:")
                print("  - You don't have any public activity")
                print("  - Your repositories are private")
                print("  - You haven't been active recently")
                return
            
            # Count event types
            event_types = {}
            for event in events:
                event_type = event.get("type", "unknown")
                event_types[event_type] = event_types.get(event_type, 0) + 1
            
            print("\n📊 Event types:")
            for event_type, count in event_types.items():
                print(f"  {event_type}: {count}")
            
            # Show first 3 events
            print("\n📝 Sample events:")
            for i, event in enumerate(events[:3]):
                print(f"\n  Event {i+1}:")
                print(f"    Type: {event.get('type')}")
                print(f"    Repo: {event.get('repo', {}).get('name')}")
                print(f"    Created: {event.get('created_at')}")
                if event.get('type') == 'PushEvent':
                    payload = event.get('payload', {})
                    print(f"    Commits: {len(payload.get('commits', []))}")
                    print(f"    Size: {payload.get('size', 0)}")
            
            # Check for PushEvents
            push_events = [e for e in events if e.get('type') == 'PushEvent']
            print(f"\n📈 PushEvents found: {len(push_events)}")
            
            if push_events:
                total_commits = 0
                for event in push_events:
                    payload = event.get('payload', {})
                    commits = payload.get('commits', [])
                    size = payload.get('size', 0)
                    total_commits += len(commits) if len(commits) > 0 else size
                print(f"  Total commits in PushEvents: {total_commits}")
            else:
                print("  ⚠️  No PushEvents found!")
                print("  This is why your commit count is 0.")
                print("  GitHub's Events API only shows PUBLIC PushEvents.")
                print("  If your repos are private, commits won't appear here.")
                
            # Check if user has public repos
            print("\n📁 Checking public repositories...")
            repos_response = await client.get(
                f"https://api.github.com/users/{username}/repos",
                headers=headers
            )
            
            if repos_response.status_code == 200:
                repos = repos_response.json()
                public_repos = [r for r in repos if not r.get('private', False)]
                print(f"  Public repos: {len(public_repos)}")
                if public_repos:
                    print("  Recent public repos:")
                    for repo in public_repos[:5]:
                        print(f"    - {repo['name']} (updated: {repo['updated_at'][:10]})")
                else:
                    print("  No public repositories found!")
                    
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_events())