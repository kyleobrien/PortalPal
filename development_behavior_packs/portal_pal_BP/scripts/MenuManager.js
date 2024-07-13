import { world } from '@minecraft/server';
import { ActionMenu } from './menus/ActionMenu';
import { ConfirmMenu } from './menus/ConfirmMenu';
import { MainMenu } from './menus/MainMenu';
import { PortalMenu } from './menus/PortalMenu';
import { PortalService } from './PortalService';
import { PropertiesMenu } from './menus/PropertiesMenu';
import { WorldActor } from './WorldActor';
export class MenuManager {
    constructor(you) {
        this.you = you;
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
    portalMenuSelected(portal, forPlayer) {
        if (this.isPlayerYou(forPlayer)) {
            let actionMenu = new ActionMenu(this, this.you, portal);
            actionMenu.open();
        }
        else {
            this.worldActor.teleportToPortal(portal);
        }
    }
    portalMenuAddNewPortal() {
        let propertiesMenu = new PropertiesMenu(this);
        propertiesMenu.open();
    }
    // ACTION MENU
    actionMenuSelectedGoTo(portal) {
        this.worldActor.teleportToPortal(portal);
    }
    actionMenuEdit(portal) {
        let propertiesMenu = new PropertiesMenu(this, portal);
        propertiesMenu.open();
    }
    actionMenuDelete(portal) {
        let confirmMenu = new ConfirmMenu(this, portal);
        confirmMenu.open();
    }
    // CONFIRM MENU
    confirmMenuDelete(portal) {
        let result = this.portalService.deletePortal(portal, this.you);
        if (result) {
            this.you.sendMessage(`Deleted the portal ${portal.name}`);
        }
        else {
            this.you.sendMessage(`There was a problem deleting the portal ${portal.name}`);
        }
    }
    handlePropertiesSubmitForAdd(formValues) {
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
            this.you.sendMessage(`There was a problem adding ${portal.name} to your saved portals.`);
        }
        // TEST
        // let saved = this.portalService.fetchDataFor(this.you);
        // Logger.log(JSON.stringify(saved));
    }
    handlePropertiesSubmitForEdit(formValues, existingPortal) {
        existingPortal.name = formValues[0];
        existingPortal.color = formValues[1];
        existingPortal.private = formValues[2];
        let success = this.portalService.editPortal(this.you, existingPortal);
        if (success) {
            this.you.sendMessage(`Updated "${existingPortal.name}" portal.`);
        }
        else {
            this.you.sendMessage(`There was a problem updating ${existingPortal.name} portal.`);
        }
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
