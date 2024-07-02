import { world } from '@minecraft/server';
import { ActionMenu } from './menus/ActionMenu';
import { MainMenu } from './menus/MainMenu';
import { PortalMenu } from './menus/PortalMenu';
import { PortalService } from './PortalService';
import { PropertiesMenu } from './menus/PropertiesMenu';
import { Logger } from './Logger';
import { WorldActor } from './WorldActor';
export class MenuManager {
    constructor(event) {
        this.you = event.source;
        this.portalService = new PortalService();
        this.worldActor = new WorldActor(this.you);
    }
    start() {
        let mainMenu = new MainMenu(this, this.you, this.findAllOtherPlayersBut(this.you));
        mainMenu.open();
    }
    /**************************************
     ******* Handle Menu Selections *******
     **************************************/
    // MAIN MENU
    mainMenuSelected(chosenPlayer) {
        let savedData;
        if (this.isPlayerYou(chosenPlayer)) {
            savedData = this.portalService.fetchDataFor(chosenPlayer, false);
        }
        else {
            savedData = this.portalService.fetchDataFor(chosenPlayer, true);
        }
        let portalMenu = new PortalMenu(this, chosenPlayer, savedData);
        portalMenu.open();
    }
    // PORTAL MENU
    portalMenuTeleportToCurrentLocation(targetPlayer) {
        this.worldActor.teleportToPlayerLocation(targetPlayer);
    }
    portalMenuTeleportToSpawn(targetPlayer) {
        this.worldActor.teleportToPlayerSpawn(targetPlayer);
    }
    // REFACTOR BELOW!
    portalMenuSelected(forPlayer, portal) {
        if (this.isPlayerYou(forPlayer)) {
            // TODO: figure this out
            let actionMenu = new ActionMenu(this, this.you);
            actionMenu.open();
        }
        else {
            this.worldActor.teleportToPortal(portal);
        }
    }
    portalMenuAddNewPortal() {
        let propertiesMenu = new PropertiesMenu(this, false);
        propertiesMenu.open();
    }
    handlePropertiesSubmit(formValues, isExistingPortal) {
        let portal = {
            "id": "",
            "name": formValues[0],
            "color": formValues[1],
            "private": formValues[2],
            "location": this.you.location,
            "dimension": this.you.dimension.id.split(":")[1]
        };
        let success = this.portalService.addPortal(this.you, portal);
        if (success) {
            this.you.sendMessage(`Added ${portal.name} to your saved portals.`);
        }
        else {
            this.you.sendMessage(`There was a prolem adding ${portal.name} to your saved portals.`);
        }
        // TEST
        let saved = this.portalService.fetchDataFor(this.you);
        Logger.log(JSON.stringify(saved));
    }
    isPlayerYou(player) {
        if (player.id == this.you.id) {
            return true;
        }
        return false;
    }
    findAllOtherPlayersBut(you) {
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        otherPlayers.sort((a, b) => a.name.localeCompare(b.name));
        return otherPlayers;
    }
}
