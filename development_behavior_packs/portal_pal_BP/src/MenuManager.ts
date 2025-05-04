import { Player, world } from '@minecraft/server';
import { ActionMenu } from './menus/ActionMenu';
import { ConfirmMenu } from './menus/ConfirmMenu';
import { MainMenu } from './menus/MainMenu';
import { PortalMenu } from './menus/PortalMenu';
import { PropertiesMenu } from './menus/PropertiesMenu';
import { Portal, ReadWriteService } from './ReadWriteService';
import { Teleport } from './Teleport';
import { Utilities } from 'Utilities';

export class MenuManager {
    public readonly you: Player;

    private readonly readWriteService: ReadWriteService;
    private readonly teleport: Teleport;

    constructor(you: Player) {
        this.you = you;

        this.readWriteService = new ReadWriteService();
        this.teleport = new Teleport(you);
    }

    public openMainMenu(): void {
        let mainMenu = new MainMenu(this, this.findAllOtherPlayersButPlayer(this.you));
        mainMenu.open();
    }

    // MAIN MENU
    
    public mainMenuSelectedPlayer(player: Player): void {
        let savedData;

        if (Utilities.arePlayersTheSame(this.you, player)) {
            savedData = this.readWriteService.fetchDataForPlayer(player, false);
        } else {
            savedData = this.readWriteService.fetchDataForPlayer(player, true);
        }

        let portalMenu = new PortalMenu(this, player, savedData);
        portalMenu.open();
    }

    // PORTAL MENU

    public portalMenuTeleportToCurrentLocationOfPlayer(player: Player): void {
        this.teleport.toLocationOfPlayer(player);
    }

    public portalMenuTeleportToSpawnOfPlayer(player: Player): void {
        this.teleport.toSpawnOfPlayer(player);
    }

    public portalMenuTeleportToPortal(portal: Portal, forPlayer: Player): void {
        if (Utilities.arePlayersTheSame(this.you, forPlayer)) {
            let actionMenu = new ActionMenu(this, portal);
            actionMenu.open();

        } else {
            this.teleport.toPortal(portal);
        }
    }

    public portalMenuAddNewPortal(): void {
        let propertiesMenu = new PropertiesMenu(this);
        propertiesMenu.open();
    }

    // ACTION MENU

    public actionMenuGoToPortal(portal: Portal): void {
        this.teleport.toPortal(portal);
    }

    public actionMenuEditPortal(portal: Portal): void {
        let propertiesMenu = new PropertiesMenu(this, portal);
        propertiesMenu.open();
    }
    
    public actionMenuDeletePortal(portal: Portal): void {
        let confirmMenu = new ConfirmMenu(this, portal);
        confirmMenu.open();
    }

    // PROPERTIES MENU

    public propertiesMenuAddWithValues(formValues): void {
        let portal = {
            "id": "",
            "name": formValues[0],
            "color": formValues[1],
            "private": formValues[2],
            "location": this.you.location,
            "dimension": this.you.dimension.id.split(":")[1]
        }

        let success = this.readWriteService.addPortal(portal, this.you);
        if (success) {
            this.you.sendMessage(`Added ${portal.name} to your saved portals.`);
        } else {
            this.you.sendMessage(`There was a problem adding ${portal.name} to your saved portals.`);
        }
    }

    public propertiesMenuEditWithValues(formValues, existingPortal): void {
        existingPortal.name = formValues[0];
        existingPortal.color = formValues[1];
        existingPortal.private = formValues[2];

        let success = this.readWriteService.editPortal(existingPortal, this.you);
        if (success) {
            this.you.sendMessage(`Updated ${existingPortal.name} portal.`);
        } else {
            this.you.sendMessage(`There was a problem updating ${existingPortal.name} portal.`);
        }
    }

    // CONFIRM MENU

    public confirmMenuDeletePortal(portal: Portal): void {
        let result = this.readWriteService.deletePortal(portal, this.you);
        if (result) {
            this.you.sendMessage(`Deleted the portal ${portal.name}.`);
        } else {
            this.you.sendMessage(`There was a problem deleting the portal ${portal.name}.`);
        }
    }

    public findAllOtherPlayersButPlayer(player: Player): Player[] {
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((p) => p.id != player.id);
        
        return otherPlayers.sort((a, b) => a.name.localeCompare(b.name));
    }
}
