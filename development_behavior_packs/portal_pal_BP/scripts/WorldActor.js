import { system, world } from '@minecraft/server';
export class WorldActor {
    constructor(you) {
        this.you = you;
    }
    teleportToPlayerLocation(player) {
        let teleportOptions = {
            checkForBlocks: true,
            dimension: player.dimension
        };
        if (player.id == this.you.id) {
            this.sendMessage("ERROR: Can't teleport to yourself. You're already there!", false);
        }
        else {
            let name = this.possessiveName(player.name);
            if (this.you.tryTeleport(player.location, teleportOptions)) {
                this.sendMessage(`Teleported to ${name} current location...`, true);
            }
            else {
                this.sendMessage(`ERROR: Failed to teleport to ${name} current location!`, false);
            }
        }
    }
    teleportToPlayerSpawn(player) {
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
                let name;
                if (player.id == this.you.id) {
                    name = "your";
                }
                else {
                    name = this.possessiveName(player.name);
                }
                this.sendMessage(`Teleported to ${name} spawn point...`, true);
            }
            else {
                this.sendMessage(`ERROR: Failed to teleport to ${name} spawn point!`, false);
            }
        }
        else {
            this.sendMessage(`ERROR: Failed to teleport to ${name} spawn point. It doesn't exist!`, false);
        }
    }
    teleportToPortal(portal) {
        let teleportOptions = {
            checkForBlocks: true,
            dimension: world.getDimension(portal.dimension)
        };
        if (this.you.tryTeleport(portal.location, teleportOptions)) {
            this.sendMessage(`Teleported to ${portal.name} portal...`, true);
        }
        else {
            this.sendMessage(`ERROR: Failed to teleport to ${portal.name}!`, false);
        }
    }
    sendMessage(message, isSuccess = true) {
        this.you.sendMessage(message);
        this.playSound(this.you, isSuccess);
    }
    // TODO: This doesn't seem to work great. I want to play a sound in an area and everyone around should hear it.
    playSound(player, success) {
        if (success) {
            system.runTimeout(() => {
                player.playSound("portal_pal.teleport");
            }, 5);
        }
        else {
            system.runTimeout(() => {
                player.playSound("portal_pal.failure");
            }, 5);
        }
    }
    possessiveName(name) {
        let posessiveName = name;
        let lastCharacter = name.charAt(name.length - 1);
        if (lastCharacter == "s") {
            posessiveName += "'";
        }
        else {
            posessiveName += "'s";
        }
        return posessiveName;
    }
}
