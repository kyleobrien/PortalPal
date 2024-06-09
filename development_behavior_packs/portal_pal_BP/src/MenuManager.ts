import { system, Player } from '@minecraft/server';
import { PortalMenu } from 'PortalMenu';
import { PropertiesMenu } from 'PropertiesMenu';

export class MenuManager {

    public readonly you: Player;

    constructor(you: Player) {
        this.you = you;
    }
    
    public playerMenuSelected(chosenPlayer: Player) {
        // TODO: Implement handling of player selection.

        let portalMenu = new PortalMenu(this, chosenPlayer);
        portalMenu.open();
    }

    public addNewPortal() {
        let propertiesMenu = new PropertiesMenu(this, false);
        propertiesMenu.open();
    }

    public teleportToCurrentLocation(targetPlayer: Player) {
        let teleportOptions = {
            checkForBlocks: true,
            dimension: targetPlayer.dimension
        };

        if (targetPlayer.id == this.you.id) {
            this.you.sendMessage("Can't teleport to yourself. You're already there!");
            this.playSound(this.you, false);
        } else {
            let name = this.possessiveName(targetPlayer.name);
            if (this.you.tryTeleport(targetPlayer.location, teleportOptions)) {
                this.you.sendMessage(`Teleported to ${name} current location...`);
                this.playSound(this.you, true);
            } else {
                this.you.sendMessage(`ERROR: Failed to teleport to ${name} current location!`);
                this.playSound(this.you, false);
            }
        }
    }

    public teleportToSpawn(targetPlayer: Player) {
        let spawnPoint = targetPlayer.getSpawnPoint();

        if (spawnPoint != undefined) {
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
                if (targetPlayer.id == this.you.id) {
                    name = "your";
                } else {
                    name = this.possessiveName(targetPlayer.name);
                }
                this.you.sendMessage(`Teleported to ${name} spawn point...`);
                this.playSound(this.you, true);
            } else {
                this.you.sendMessage(`ERROR: Failed to teleport to ${name} spawn point!`);
                this.playSound(this.you, false);
            }
        } else {
            this.you.sendMessage(`ERROR: Failed to teleport to ${name} spawn point. It doesn't exist!`);
            this.playSound(this.you, false);
        }
    }

    public handlePropertiesSubmit(formValues, isExistingPortal) {

    }

    // TODO: This doesn't seem to work great. I want to play a sound in an area and everyone around should hear it.
    public playSound(player, success) {
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

    public isPlayerYou(player: Player): boolean {
        if (player.id == this.you.id) {
            return true;
        }

        return false;
    }
}
