import { system, world, Player } from '@minecraft/server';
import { Portal } from './ReadWriteService';
import { Utilities } from 'Utilities';

export class Teleport {
    private readonly you: Player;

    constructor (you: Player) {
        this.you = you;
    }

    public toLocationOfPlayer(player: Player): void {
        try {
            let teleportOptions = {
                checkForBlocks: true,
                dimension: player.dimension
            };

            if (Utilities.arePlayersTheSame(this.you, player)) {
                this.sendMessage("Can't teleport to yourself. You're already there!", false);
            } else {
                let name = this.possessiveName(player.name);
                if (this.you.tryTeleport(player.location, teleportOptions)) {
                    this.sendMessage(`Teleported to ${name} current location...`, true);
                } else {
                    this.sendMessage(`Failed to teleport to ${name} current location!`, false);
                }
            }
        } catch {
            this.sendMessage("There was a problem trying to teleport to the player.", false);
        }
    }

    public toSpawnOfPlayer(player: Player): void {
        let name: string;
        if (Utilities.arePlayersTheSame(this.you, player)) {
            name = "your";
        } else {
            name = this.possessiveName(player.name);
        }

        try {
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
                    this.sendMessage(`Teleported to ${name} spawn point...`, true);
                } else {
                    this.sendMessage(`Failed to teleport to ${name} spawn point!`, false);
                }
            } else {
                this.sendMessage(`Failed to teleport to ${name} spawn point. It doesn't exist!`, false);
            }
        } catch {
            this.sendMessage("There was a problem trying to teleport to the player's spawn point.", false);
        }
    }

    public toPortal(portal: Portal): void {
        try {
            let teleportOptions = {
                checkForBlocks: true,
                dimension: world.getDimension(portal.dimension)
            };

            if (this.you.tryTeleport(portal.location, teleportOptions)) {
                this.sendMessage(`Teleported to ${portal.name}...`, true);
            } else {
                this.sendMessage(`Failed to teleport to ${portal.name}!`, false);
            }
        } catch {
            this.sendMessage("There was a problem trying to teleport to the portal.", false);
        }
    }

    private sendMessage(message: string, isSuccess: boolean = true) {
        if (!isSuccess) {
            message = `ERROR: ${message}`;
        }

        this.you.sendMessage(message);
        this.playSound(this.you, isSuccess);
    }

    // TODO
    // 1 - Make the success sound play for everyone, not just the player doing the teleporting.
    //     Dimension class has a function called playSound(...) that should work for this.
    // 2 - Try to get the ticks lower, so there isn't so much lag after the action and before a sound.
    private playSound(player, success) {
        if (success) {
            system.runTimeout(() => {
                player.playSound("portal_pal.teleport");
            }, 5);
        } else {
            system.runTimeout(() => {
                player.playSound("portal_pal.failure");
            }, 1);
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
