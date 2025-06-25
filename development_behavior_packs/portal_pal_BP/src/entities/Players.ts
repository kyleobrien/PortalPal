import type { Player } from '@minecraft/server';
import { PortalPalPlayer } from './PortalPalPlayer';

export class Players {
    private portalPalPlayers: PortalPalPlayer[] = [];

    /**
     * Represents all of the players in the world.
     * @constructor
     * @param { Player } you The player invoking the PortalPal.
     * @param { Player[] } allPlayers All players in the game.
     */
    constructor (you: Player, allPlayers: Player[]) {
        this.portalPalPlayers.push(new PortalPalPlayer(you, true));

        var otherPlayers = allPlayers.filter((p) => p.id !== you.id)
                                     .sort((a, b) => a.name.localeCompare(b.name));

        for (const otherPlayer of otherPlayers) {
            this.portalPalPlayers.push(new PortalPalPlayer(otherPlayer, false));
        }
    }

    /**
     * Gets all players in the world.
     * @returns { PortalPalPlayer[] } All of the players in the world.
     */
    public get all(): PortalPalPlayer[] {
        return this.portalPalPlayers;
    }

    /**
     * Gets the player invoking the PortalPal.
     * @returns { PortalPalPlayer | null } The player invoking the PortalPal, or null if not found.
     */
    public get you(): PortalPalPlayer | null {
        const candidates = this.portalPalPlayers.filter((p) => p.isYou);
        if (candidates.length === 1) {
            return candidates[0];
        } else {
            return null;
        }
    }

    /**
     * Gets all other players in the world that are not you.
     * @returns { PortalPalPlayer[] } All other players in the world, or null if you are all alone.
     */
    public get others(): PortalPalPlayer[] | null {
        return this.portalPalPlayers.filter((p) => !p.isYou);
    }
}
