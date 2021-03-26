// mal_id , url, title,image_url,score, airing_start

module.exports = function MalSearchGenreItem(id, title, image, score,episodes, start_date, genres=[]) {
    this.id = id
    this.title = title
    this.image = image
    this.score = score
    this.episodes = episodes
    this.start_date = start_date
    this.genres = genres
}



