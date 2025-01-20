import requests
from bs4 import BeautifulSoup
import json
import time


def func(index, last_flag=False):
    result = {}
    result["name"] = "第{}回".format(index)
    result["index"] = index

    if not last_flag:
        result["url"] = (
            "https://orangebunko.shueisha.co.jp/newface-award/winners/no" + str(index)
        )
    else:
        result["url"] = "https://orangebunko.shueisha.co.jp/newface-award/result"
    res = requests.get(result["url"])
    soup = BeautifulSoup(res.text, "html.parser")

    title_elem = soup.find("article", class_="award-detail").find_all(
        "h5", class_="intro-txt-box"
    )
    title = []
    for e in title_elem:
        title.append(e.text)
    print(title)

    a_elem = soup.find("article", class_="award-detail").find_all("a", href=True)
    links = []
    for e in a_elem:
        links.append("https://orangebunko.shueisha.co.jp" + e["href"])
    print(a_elem)

    result["award"] = []

    for i in range(len(title)):
        result["award"].append(
            {"name": title[i], "body_url": links[2 * i], "review_url": links[2 * i + 1]}
        )
    print(json.dumps(result))
    return result


last_N = 232

data = []
with open("data.json") as f:
    data = json.load(f)

index_list = [e["index"] for e in data]
index_set = set(index_list)

if last_N not in index_set:
    print(last_N)
    data.append(func(last_N, True))
    time.sleep(10.0)

for i in range(last_N - 1, 181, -1):
    if i in index_set:
        continue
    print(i)
    data.append(func(i))
    data.sort(key=lambda v: v["index"], reverse=True)
    with open("data.json", "w") as f:
        json.dump(data, f, indent=2)
    time.sleep(10.0)
