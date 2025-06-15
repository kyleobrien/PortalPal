import { world } from '@minecraft/server';
import { MessageService } from './MessageService';
import { Portal } from '../repositories/PortalRepository';
import { PortalPalPlayer } from '../entities/PortalPalPlayer';

export class TeleportService {
    private readonly fromPlayer: PortalPalPlayer;

    /**
     * Creates a service to manage teleporting the user to different locations around the world.
     * @constructor
     * @param { PortalPalPlayer } fromPlayer The player that is being teleported.
     */
    constructor (fromPlayer: PortalPalPlayer) {
        this.fromPlayer = fromPlayer;
    }

    /**
     * Teleports the fromPlayer member to the location of the toPlayer.
     * @param { PortalPalPlayer } toPlayer The player to teleport to.
     */
    public teleportToLocationOfPlayer(toPlayer: PortalPalPlayer): void {
        const messageService = new MessageService(this.fromPlayer);

        if (this.fromPlayer.canTeleportToPlayer(toPlayer)) {
            const teleportOptions = {
                checkForBlocks: true,
                dimension: toPlayer.minecraftPlayer.dimension
            };
            const name = TeleportService.makePossessiveName(toPlayer.minecraftPlayer.name);

            try {
                if (this.fromPlayer.minecraftPlayer.tryTeleport(toPlayer.minecraftPlayer.location, teleportOptions)) {
                    messageService.sendMessage(`Teleported to ${name} current location...`, false, true);
                } else {
                    messageService.sendMessage(`Failed to teleport to ${name} current location!`, true, true);
                }
            } catch {
                 messageService.sendMessage(`Failed to teleport to ${name} current location!`, true, true);
            }
        } else {
            messageService.sendMessage("Can't teleport to yourself. You're already there!", true, true);    
        }
    }

    /**
     * Teleports the fromPlayer member to the location of the toPlayer's spwan point.
     * @param { PortalPalPlayer } toPlayer The player of the spawn point to teleport to.
     */
    public teleportToSpawnOfPlayer(toPlayer: PortalPalPlayer): void {
        const messageService = new MessageService(this.fromPlayer);

        let name: string;
        if (toPlayer.isYou) {
            name = "your";
        } else {
            name = TeleportService.makePossessiveName(toPlayer.minecraftPlayer.name);
        }

        try {
            const spawnPoint = toPlayer.minecraftPlayer.getSpawnPoint();
            if (spawnPoint !== undefined) {
                const spawnPointLocation = {
                    x: spawnPoint.x,
                    y: spawnPoint.y,
                    z: spawnPoint.z
                };

                const teleportOptions = {
                    checkForBlocks: true,
                    dimension: spawnPoint.dimension
                };

                if (this.fromPlayer.minecraftPlayer.tryTeleport(spawnPointLocation, teleportOptions)) {
                    messageService.sendMessage(`Teleported to ${name} spawn point...`, false, true);
                } else {
                    messageService.sendMessage(`Failed to teleport to ${name} spawn point!`, true, true);
                }
            } else {
                messageService.sendMessage(`Failed to teleport to ${name} spawn point. It doesn't exist!`, true, true);
            }
        } catch {
            messageService.sendMessage(`Failed to teleport to ${name} spawn point!`, true, true);
        }
    }

    /**
     * Teleports the fromPlayer member to the location of a portal.
     * @param { Portal } portal The portal to teleport to.
     */
    public teleportToPortal(portal: Portal): void {
        const messageService = new MessageService(this.fromPlayer);
        
        try {
            let teleportOptions = {
                checkForBlocks: true,
                dimension: world.getDimension(portal.dimension)
            };

            if (this.fromPlayer.minecraftPlayer.tryTeleport(portal.location, teleportOptions)) {
                messageService.sendPortalTeleportMessage(portal, true);
            } else {
                messageService.sendPortalTeleportMessage(portal, false);
            }
        } catch {
            messageService.sendPortalTeleportMessage(portal, false);
        }
    }

    /**
     * Styles the player's name with a possessive format for use in messaging.
     * @param { string } name The player's name.
     * @returns { string } A possessive form of the name.
     */
    private static makePossessiveName(name: string): string {
        const lastCharacter = name.charAt(name.length - 1);

        let posessiveName = name;
        if (lastCharacter == "s") {
            posessiveName += "'";
        } else {
            posessiveName += "'s";
        }

        return posessiveName;
    }
}
