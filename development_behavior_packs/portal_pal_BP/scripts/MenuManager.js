import { system } from '@minecraft/server';
import { PortalMenu } from 'menus/PortalMenu';
import { PortalService } from 'PortalService';
import { PropertiesMenu } from 'menus/PropertiesMenu';
import { Logger } from './Logger';
export class MenuManager {
    constructor(you) {
        this.you = you;
    }
    mainMenuSelected(chosenPlayer) {
        // TODO: Implement handling of player selection.
        let portalMenu = new PortalMenu(this, chosenPlayer);
        portalMenu.open();
    }
    addNewPortal() {
        let propertiesMenu = new PropertiesMenu(this, false);
        propertiesMenu.open();
    }
    teleportToCurrentLocation(targetPlayer) {
        let teleportOptions = {
            checkForBlocks: true,
            dimension: targetPlayer.dimension
        };
        if (targetPlayer.id == this.you.id) {
            this.you.sendMessage("Can't teleport to yourself. You're already there!");
            this.playSound(this.you, false);
        }
        else {
            let name = this.possessiveName(targetPlayer.name);
            if (this.you.tryTeleport(targetPlayer.location, teleportOptions)) {
                this.you.sendMessage(`Teleported to ${name} current location...`);
                this.playSound(this.you, true);
            }
            else {
                this.you.sendMessage(`ERROR: Failed to teleport to ${name} current location!`);
                this.playSound(this.you, false);
            }
        }
    }
    teleportToSpawn(targetPlayer) {
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
                let name;
                if (targetPlayer.id == this.you.id) {
                    name = "your";
                }
                else {
                    name = this.possessiveName(targetPlayer.name);
                }
                this.you.sendMessage(`Teleported to ${name} spawn point...`);
                this.playSound(this.you, true);
            }
            else {
                this.you.sendMessage(`ERROR: Failed to teleport to ${name} spawn point!`);
                this.playSound(this.you, false);
            }
        }
        else {
            this.you.sendMessage(`ERROR: Failed to teleport to ${name} spawn point. It doesn't exist!`);
            this.playSound(this.you, false);
        }
    }
    handlePropertiesSubmit(formValues, isExistingPortal) {
        let portal = {
            "name": formValues[0],
            "color": formValues[1],
            "private": formValues[2],
            "location": this.you.location,
            "dimension": this.you.dimension
        };
        // TODO: each component of the location can go to many decimals. Round these to save space?
        let portalService = new PortalService();
        portalService.addPortal(this.you, portal);
        // TEST
        let saved = portalService.fetchAllPortalsFor(this.you);
        Logger.log(JSON.parse(saved.toString()));
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
    isPlayerYou(player) {
        if (player.id == this.you.id) {
            return true;
        }
        return false;
    }
}
