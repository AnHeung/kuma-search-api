// id,title,main_picture,alternative_titles,start_date,end_date
// ,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at
// ,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season
// ,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga
// ,recommendations,studios,statistics

module.exports = function MalSearchDetailItem(id, title, image = '', start_date = '0000', end_date = '0000',
    star, popularity, rank, synopsis,
    status, genres, num_episodes, start_season = '0000', pictures=[] ,related_anime = {}) {
    this.id = id
    this.title = title
    this.image = image
    this.start_date = start_date
    this.end_date = end_date
    this.star = star
    this.popularity = popularity
    this.rank = rank
    this.synopsis = synopsis
    this.status = status
    this.genres = genres
    this.num_episodes = num_episodes
    this.start_season = start_season
    this.pictures = pictures
    this.related_anime = related_anime
}