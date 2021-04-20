
module.exports = function MalSearchPersonItem(person_id,name,family_name, given_name,birthday, alternate_names,image_url, url, voice_acting_roles=[]
    ,about,favorites_rank ) {
    this.person_id = person_id
    this.name = name
    this.family_name = family_name
    this.given_name = given_name
    this.birthday = birthday
    this.alternate_names = alternate_names
    this.about = about
    this.image_url = image_url
    this.url = url
    this.voice_acting_roles = voice_acting_roles
    this.favorites_rank = favorites_rank
}