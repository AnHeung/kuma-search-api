# 주기능

1. 구글 검색을 통해 이미지정보나 쿼리 가져오기
2. MAL(MyAnimeList) 를 통한 쿼리 가져오기 



## MAL API 관련 파라미터 ##

1. 인증
Base URL: https://myanimelist.net/v1/oauth2/authorize (GET request)
*response_type: must be set to "code". (REQUIRED)
*client_id: your Client ID. (REQUIRED)
*code_challenge: the Code Challenge generated during the previous step. (REQUIRED)
*state: a string which can be used to maintain state between the request and callback. It is later returned by the MAL servers to the API client. (RECOMMENDED)
*redirect_uri: the URL to which the user must be redirected after the authentication. (OPTIONAL)
*code_challenge_method: defaults to "plain". No other option is currently available. (OPTIONAL)


2. 인증후 리다이렉트

*code: Authorisation Code needed to obtain an Access Token for the user.
*state: the same state Parameter sent during the previous step.

3. 유저 인증 토큰

Base URL: https://myanimelist.net/v1/oauth2/token (POST request)
Structure: form URL encoded.
*client_id: your Client ID. (REQUIRED)
*client_secret: your Client Secret. (REQUIRED if your application has a Client Secret; OMIT in all other cases (i.e. you selected "Android", "iOS", or "Other" as App Type))
*code: the user's Authorisation Code received during the previous step. (REQUIRED)
*code_verifier: the Code Verifier generated in Step 2. (REQUIRED)
*grant_type: must be set to "authorization_code". (REQUIRED)


3-1. 유저인증 리턴 예시

{
    "token_type":    "Bearer",
    "expires_in":    2678400,
    "access_token":  "a1b2c3d4e5...",
    "refresh_token": "z9y8x7w6u5..."
}


4. 리프레쉬 인증 토큰

Base URL: https://myanimelist.net/v1/oauth2/token (POST request)
Structure: form URL encoded.
*client_id: your Client ID. (REQUIRED)
*client_secret: your Client Secret. (REQUIRED if your application has a Client Secret; OMIT in all other cases (i.e. you selected "Android", "iOS", or "Other" as App Type))
*grant_type: must be set to "refresh_token". (REQUIRED)
*refresh_token: the user's Refresh Token. (REQUIRED)




## MAL 검색 url 및 파라미터 ##

1. 이름검색

curl 'https://api.myanimelist.net/v2/anime?q=one&limit=4' \
-H 'Authorization: Bearer YOUR_TOKEN'


q	string Search.
limit	integer Default: 100 (The maximum value is 100.)
offset	integer Default: 0
fields	string

2. 랭킹검색

curl 'https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=4' \
-H 'Authorization: Bearer YOUR_TOKEN'

ranking_type required string 

value  all	Top Anime Series 
       airing	Top Airing Anime 
       upcoming	Top Upcoming Anime 
       tv	Top Anime TV Series
       ova	Top Anime OVA Series
       movie	Top Anime Movies
       special	Top Anime Specials
       bypopularity	Top Anime by Popularity
       favorite	Top Favorited Anime

limit	integer Default: 100 (The maximum value is 500.)
offset	integer Default: 0
fields	string

3. 디테일 검색

curl 'https://api.myanimelist.net/v2/anime/30230?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics' -H 'Authorization: Bearer YOUR_TOKEN'


anime_id required integer QUERY PARAMETERS
fields	string

