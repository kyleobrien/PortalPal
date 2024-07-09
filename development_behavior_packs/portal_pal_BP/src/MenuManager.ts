import { system, world, Player, ItemUseAfterEvent } from '@minecraft/server';
import { ActionMenu } from './menus/ActionMenu';
import { MainMenu } from './menus/MainMenu';
import { PortalMenu } from './menus/PortalMenu';
import { PortalService, Portal } from './PortalService';
import { PropertiesMenu } from './menus/PropertiesMenu';
import { Logger } from './Logger';
import { WorldActor } from './WorldActor';

export class MenuManager {
    // TODO: Can I make this private?
    public you: Player;
    private otherPlayers: Player[];

    private readonly portalService: PortalService;
    private readonly worldActor: WorldActor;

    constructor(event: ItemUseAfterEvent) {
        this.you = event.source;

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

        if (this.isPlayerYou(chosenPlayer)) {
            savedData = this.portalService.fetchDataFor(chosenPlayer, false);
        } else {
            savedData = this.portalService.fetchDataFor(chosenPlayer, true);
        }

        let portalMenu = new PortalMenu(this, chosenPlayer, savedData);
        portalMenu.open();
    }

    // PORTAL MENU

    public portalMenuTeleportToCurrentLocation(targetPlayer: Player) {
        this.worldActor.teleportToPlayerLocation(targetPlayer);
    }

    public portalMenuTeleportToSpawn(targetPlayer: Player) {
        this.worldActor.teleportToPlayerSpawn(targetPlayer);
    }

    public portalMenuSelected(portal: Portal, forPlayer: Player) {
        if (this.isPlayerYou(forPlayer)) {
            let actionMenu = new ActionMenu(this, this.you, portal);
            actionMenu.open();

        } else {
            this.worldActor.teleportToPortal(portal);
        }
    }

    public portalMenuAddNewPortal() {
        let propertiesMenu = new PropertiesMenu(this, false);
        propertiesMenu.open();
    }

    // ACTION MENU

    public actionMenuSelectedGoTo(portal: Portal) {
        this.worldActor.teleportToPortal(portal);
    }

    public actionMenuEdit(portal: Portal) {

    }
    
    public actionMenuDelete(portal: Portal) {

    }

    // REFACTOR BELOW

    public handlePropertiesSubmit(formValues, isExistingPortal) {
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
            this.you.sendMessage(`There was a prolem adding ${portal.name} to your saved portals.`);
        }

        // TEST
        let saved = this.portalService.fetchDataFor(this.you);
        Logger.log(JSON.stringify(saved));
    }

    public isPlayerYou(player: Player): boolean {
        if (player.id == this.you.id) {
            return true;
        }

        return false;
    }

    public findAllOtherPlayersBut(you: Player): Player[] {
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        
        otherPlayers.sort((a, b) => a.name.localeCompare(b.name));

        return otherPlayers;
    }
}
