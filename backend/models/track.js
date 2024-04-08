module.exports = class Track {
    constructor(track, op) {
        this.title = track.title;
        this.artist = track.artist;
        this.votecnt = 0;
        this.op = op;
        this.usersVoted = [];
        this.source = track.source;
        this.thumbnail = track.thumbnail;
    }

    gettitle() {
        return this.title;
    }

    getop() {
        return this.op;
    }

    getartist() {
        return this.artist;
    }

    getvotecnt() {
        return this.votecnt;
    }

    addvotecnt() {
        this.votecnt++;
    }

    getUsersVoted() {
        return this.usersVoted;
    }
}
