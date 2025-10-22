import requests

url = "https://reqres.in/api/users?page=2"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()

    for user in data["data"]:
        first = user["first_name"].lower()
        last = user["last_name"].lower()
        common_chars = sorted(set(first) & set(last))

        if common_chars:
            print(f"{user['id']}: {', '.join(common_chars)}")
        else:
            print(f"{user['id']}: None")
else:
    print("Error:", response.status_code)
