module.exports = class Message {
    constructor(from, content, time) {
        this.from = from;
        this.content = content;
        this.time = time;
    }
}