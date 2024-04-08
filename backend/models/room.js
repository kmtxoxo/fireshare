module.exports =class Room {
    constructor(roomnumber, host) {
        this.roomnumber = roomnumber;
        this.tracklist = [];
        this.usernames = [];
        this.currentlyPlaying = null;
        this.host = host;
        this.usernames.push(host);
    }

    getroomnumber() {
        return this.roomnumber;
    }

    gettracklist() {
        return this.tracklist;
    }

    getusernames() {
        return this.usernames;
    }

    getcurrentlyPlaying() {
        return this.currentlyPlaying;
    }

    gethost() {
        return this.host;
    }
}