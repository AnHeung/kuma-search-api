// mal_id , title,image_url,airing, start_date, end_date , rated, score ,type , episodes

module.exports = function MalSearchAllItem(id, title, image = '', airing, start_date , end_date ,
    rated, score, type, episodes) {
    this.id = id
    this.title = title
    this.image = image
    this.airing = airing
    this.start_date = start_date
    this.end_date = end_date
    this.rated = rated
    this.score = score
    this.type = type
    this.episodes = episodes
}