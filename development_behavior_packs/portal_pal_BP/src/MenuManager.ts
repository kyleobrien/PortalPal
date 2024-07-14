import { system, world, Player } from '@minecraft/server';
import { ActionMenu } from './menus/ActionMenu';
import { ConfirmMenu } from './menus/ConfirmMenu';
import { MainMenu } from './menus/MainMenu';
import { PortalMenu } from './menus/PortalMenu';
import { PortalService, Portal } from './PortalService';
import { PropertiesMenu } from './menus/PropertiesMenu';
import { WorldActor } from './WorldActor';
import { Utilities } from 'Utilities';

export class MenuManager {
    // TODO: Can I make this private?
    public you: Player;
    private otherPlayers: Player[];

    private readonly portalService: PortalService;
    private readonly worldActor: WorldActor;

    constructor(you: Player) {
        this.you = you;

        this.portalService = new PortalService();
        this.worldActor = new WorldActor(this.you);
    }

    public start() {
        let mainMenu = new MainMenu(this,
                                    this.you,
                                    this.findAllOtherPlayersBut(this.you));
        mainMenu.open();
    }

    /**************************************
     ******* Handle Menu Selections *******
     **************************************/

    // MAIN MENU
    
    public mainMenuSelected(chosenPlayer: Player) {
        let savedData;

        if (Utilities.arePlayersTheSame(this.you, chosenPlayer)) {
            savedData = this.portalService.fetchDataFor(chosenPlayer, false);
        } else {
            savedData = this.portalService.fetchDataFor(chosenPlayer, true);
        }

        let portalMenu = new PortalMenu(this, chosenPlayer, savedData);
        portalMenu.open();
    }

    // PORTAL MENU

    public portalMenuTeleportToCurrentLocation(targetPlayer: Player) {
        this.worldActor.teleportToLocationOfPlayer(targetPlayer);
    }

    public portalMenuTeleportToSpawn(targetPlayer: Player) {
        this.worldActor.teleportToSpawnOfPlayer(targetPlayer);
    }

    public portalMenuSelected(portal: Portal, forPlayer: Player) {
        if (Utilities.arePlayersTheSame(this.you, forPlayer)) {
            let actionMenu = new ActionMenu(this, this.you, portal);
            actionMenu.open();

        } else {
            this.worldActor.teleportToPortal(portal);
        }
    }

    public portalMenuAddNewPortal() {
        let propertiesMenu = new PropertiesMenu(this);
        propertiesMenu.open();
    }

    // ACTION MENU

    public actionMenuSelectedGoTo(portal: Portal) {
        this.worldActor.teleportToPortal(portal);
    }

    public actionMenuEdit(portal: Portal) {
        let propertiesMenu = new PropertiesMenu(this, portal);
        propertiesMenu.open();
    }
    
    public actionMenuDelete(portal: Portal) {
        let confirmMenu = new ConfirmMenu(this, portal);
        confirmMenu.open();
    }

    // CONFIRM MENU

    public confirmMenuDelete(portal: Portal) {
        let result = this.portalService.deletePortal(portal, this.you);
        if (result) {
            this.you.sendMessage(`Deleted the portal ${portal.name}`);
        } else {
            this.you.sendMessage(`There was a problem deleting the portal ${portal.name}`);
        }
    }

    public handlePropertiesSubmitForAdd(formValues) {
        let portal = {
            "id": "",
            "name": formValues[0],
            "color": formValues[1],
            "private": formValues[2],
            "location": this.you.location,
            "dimension": this.you.dimension.id.split(":")[1]
        }

        let success = this.portalService.addPortal(this.you, portal);
        
        if (success) {
            this.you.sendMessage(`Added ${portal.name} to your saved portals.`);
        } else {
            this.you.sendMessage(`There was a problem adding ${portal.name} to your saved portals.`);
        }

        // TEST
        // let saved = this.portalService.fetchDataFor(this.you);
        // Logger.log(JSON.stringify(saved));
    }

    public handlePropertiesSubmitForEdit(formValues, existingPortal) {
        existingPortal.name = formValues[0];
        existingPortal.color = formValues[1];
        existingPortal.private = formValues[2];

        let success = this.portalService.editPortal(this.you, existingPortal);

        if (success) {
            this.you.sendMessage(`Updated "${existingPortal.name}" portal.`);
        } else {
            this.you.sendMessage(`There was a problem updating ${existingPortal.name} portal.`);
        }
    }

    public findAllOtherPlayersBut(you: Player): Player[] {
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        
        otherPlayers.sort((a, b) => a.name.localeCompare(b.name));

        return otherPlayers;
    }
}
