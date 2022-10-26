from __future__ import print_function
import dotenv
from dotenv import load_dotenv, find_dotenv
import sys
from instagrapi import Client

# url = sys.argv[1]
url = 'https://www.instagram.com/daraz.lk/'
load_dotenv(find_dotenv())

cl = Client()
cl.login("testsurge7202", "poiuytrewq1234")


res = url.split('/')[-2]
followers = cl.user_info_by_username(res)
print(followers.follower_count)
# gsht(url , followers.follower_count)
cl.logout()
