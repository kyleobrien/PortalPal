import { Player } from '@minecraft/server';

export class Players {
    public readonly you: Player;
    public readonly otherPlayers: Player[];

    constructor (you: Player, allPlayers: Player[]) {
        this.you = you;

        this.otherPlayers = allPlayers.filter((p) => p.id != you.id);
        this.otherPlayers.sort((a, b) => a.name.localeCompare(b.name));
    }
}
