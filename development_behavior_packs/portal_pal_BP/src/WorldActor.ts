import { system, world, Player, Dimension } from '@minecraft/server';
import { Portal } from './PortalService';
import { Logger } from './Logger';

export class WorldActor {
    private readonly you: Player;

    constructor (you: Player) {
        this.you = you;
    }

    public teleportToPlayerLocation(player: Player) {
        let teleportOptions = {
            checkForBlocks: true,
            dimension: player.dimension
        };

        if (player.id == this.you.id) {
            this.sendMessage("ERROR: Can't teleport to yourself. You're already there!", false);
        } else {
            let name = this.possessiveName(player.name);
            if (this.you.tryTeleport(player.location, teleportOptions)) {
                this.sendMessage(`Teleported to ${name} current location...`, true);
            } else {
                this.sendMessage(`ERROR: Failed to teleport to ${name} current location!`, false);
            }
        }
    }

    public teleportToPlayerSpawn(player: Player) {
        let spawnPoint = player.getSpawnPoint();
        if (spawnPoint !== undefined) {
            let spawnPointLocation = {
                x: spawnPoint.x,
                y: spawnPoint.y,
                z: spawnPoint.z
            };

            let teleportOptions = {
                checkForBlocks: true,
                dimension: spawnPoint.dimension
            };

            if (this.you.tryTeleport(spawnPointLocation, teleportOptions)) {
                let name: string;
                if (player.id == this.you.id) {
                    name = "your";
                } else {
                    name = this.possessiveName(player.name);
                }

                this.sendMessage(`Teleported to ${name} spawn point...`, true);
            } else {
                this.sendMessage(`ERROR: Failed to teleport to ${name} spawn point!`, false);
            }
        } else {
            this.sendMessage(`ERROR: Failed to teleport to ${name} spawn point. It doesn't exist!`, false);
        }
    }

    public teleportToPortal(portal: Portal) {
        let teleportOptions = {
            checkForBlocks: true,
            dimension: world.getDimension(portal.dimension)
        };

        if (this.you.tryTeleport(portal.location, teleportOptions)) {
            this.sendMessage(`Teleported to ${portal.name} portal...`, true);
        } else {
            this.sendMessage(`ERROR: Failed to teleport to ${portal.name}!`, false);
        }
    }

    private sendMessage(message: string, isSuccess: boolean = true) {
        this.you.sendMessage(message);
        this.playSound(this.you, isSuccess);
    }

    // TODO: This doesn't seem to work great. I want to play a sound in an area and everyone around should hear it.
    private playSound(player, success) {
        if (success) {
            system.runTimeout(() => {
                player.playSound("portal_pal.teleport");
            }, 5);
        } else {
            system.runTimeout(() => {
                player.playSound("portal_pal.failure");
            }, 5);
        }
    }

    private possessiveName(name: string) {
        let posessiveName = name;
        let lastCharacter = name.charAt(name.length - 1);

        if (lastCharacter == "s") {
            posessiveName += "'";
        } else {
            posessiveName += "'s";
        }

        return posessiveName;
    }
}
