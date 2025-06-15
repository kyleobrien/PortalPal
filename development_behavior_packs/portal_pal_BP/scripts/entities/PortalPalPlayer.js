export class PortalPalPlayer {
    /**
     * Represents a player in a world with this add-on enabled.
     * It encapsulates a Minecraft player instance and extends it.
     * @constructor
     * @param { Player } minecraftPlayer A Minecraft player to wrap.
     * @param { boolean } isYou A flag to indicate if the player is you (or someone else).
     */
    constructor(minecraftPlayer, isYou) {
        this.minecraftPlayer = minecraftPlayer;
        this.isYou = isYou;
    }
    /**
     * Determine if a player can teleport to another player.
     * @param { PortalPalPlayer } otherPlayer The other player to teleport to.
     * @returns { boolean } If the player can teleport or not.
     */
    canTeleportToPlayer(otherPlayer) {
        if (this.isYou && !otherPlayer.isYou) {
            return true;
        }
        return false;
    }
}
