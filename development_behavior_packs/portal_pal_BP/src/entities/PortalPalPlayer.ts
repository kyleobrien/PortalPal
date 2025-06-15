import { Player } from '@minecraft/server';

export class PortalPalPlayer {
    public readonly minecraftPlayer: Player;
    public readonly isYou: boolean;

    /**
     * Represents a player in a world with this add-on enabled.
     * It encapsulates a Minecraft player instance and extends it.
     * @constructor
     * @param { Player } minecraftPlayer A Minecraft player to wrap.
     * @param { boolean } isYou A flag to indicate if the player is you (or someone else).
     */
    constructor (minecraftPlayer: Player, isYou: boolean) {
        this.minecraftPlayer = minecraftPlayer;
        this.isYou = isYou;
    }

    /**
     * Determine if a player can teleport to another player.
     * @param { PortalPalPlayer } otherPlayer The other player to teleport to.
     * @returns { boolean } If the player can teleport or not.
     */
    public canTeleportToPlayer(otherPlayer: PortalPalPlayer): boolean {
        if (this.isYou && !otherPlayer.isYou) {
            return true;
        }

        return false;
    }
}
