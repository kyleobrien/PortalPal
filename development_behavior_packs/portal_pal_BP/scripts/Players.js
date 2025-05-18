export class Players {
    constructor(you, allPlayers) {
        this.you = you;
        this.otherPlayers = allPlayers.filter((p) => p.id != you.id)
            .sort((a, b) => a.name.localeCompare(b.name));
    }
}
