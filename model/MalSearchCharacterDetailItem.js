
module.exports = function MalSearchCharacterDetailItem(character_id,name, name_kanji,nicknames,about,image_url,url
    ,relate_animation=[], voice_actors =[],favorites_rank ) {
    this.character_id = character_id
    this.name = name
    this.name_kanji = name_kanji
    this.nicknames = nicknames
    this.about = about
    this.image_url = image_url
    this.url = url
    this.relate_animation = relate_animation
    this.voice_actors = voice_actors
    this.favorites_rank = favorites_rank
}