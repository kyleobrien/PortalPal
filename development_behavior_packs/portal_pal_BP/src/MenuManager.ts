import { Player, world } from '@minecraft/server';
import { ActionMenu } from './menus/ActionMenu';
import { ConfirmMenu } from './menus/ConfirmMenu';
import { MainMenu } from './menus/MainMenu';
import { Players } from './Players';
import { PortalMenu } from './menus/PortalMenu';
import { PropertiesMenu } from './menus/PropertiesMenu';
import { Portal, ReadWriteService, SavedData } from './ReadWriteService';
import { Teleport } from './Teleport';
import { Utilities } from './Utilities';

export class MenuManager {
    public readonly players: Players;
    private readonly readWriteService: ReadWriteService;
    private readonly teleport: Teleport;

    constructor(you: Player) {
        this.players = new Players(you, world.getAllPlayers());
        this.readWriteService = new ReadWriteService();
        this.teleport = new Teleport(you);
    }

    /**
     * The main entry point for the menu manager.
     */
    public init(): void {
        let mainMenu = new MainMenu(this, this.players);
        mainMenu.open();
    }

    // #region MAIN MENU
    
    /**
     * Handle the button selection in the main menu.
     * @param player The player that was selected.
     */
    public mainMenuSelectedPlayer(selectedPlayer: Player): void {
        let savedData: SavedData;

        if (Utilities.arePlayersTheSame(this.players.you, selectedPlayer)) {
            savedData = this.readWriteService.fetchDataForPlayer(selectedPlayer, false);
        } else {
            savedData = this.readWriteService.fetchDataForPlayer(selectedPlayer, true);
        }

        let portalMenu = new PortalMenu(this, selectedPlayer, savedData);
        portalMenu.open();
    }

    // #endregion

    // PORTAL MENU

    public portalMenuTeleportToCurrentLocationOfPlayer(player: Player): void {
        this.teleport.toLocationOfPlayer(player);
    }

    public portalMenuTeleportToSpawnOfPlayer(player: Player): void {
        this.teleport.toSpawnOfPlayer(player);
    }

    public portalMenuTeleportToPortal(portal: Portal, forPlayer: Player): void {
        if (Utilities.arePlayersTheSame(this.players.you, forPlayer)) {
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
            "location": this.players.you.location,
            "dimension": this.players.you.dimension.id.split(":")[1]
        }

        let success = this.readWriteService.addPortal(portal, this.players.you);
        if (success) {
            this.players.you.sendMessage(`Added ${portal.name} to your saved portals.`);
        } else {
            this.players.you.sendMessage(`There was a problem adding ${portal.name} to your saved portals.`);
        }
    }

    public propertiesMenuEditWithValues(formValues, existingPortal): void {
        existingPortal.name = formValues[0];
        existingPortal.color = formValues[1];
        existingPortal.private = formValues[2];

        let success = this.readWriteService.editPortal(existingPortal, this.players.you);
        if (success) {
            this.players.you.sendMessage(`Updated ${existingPortal.name} portal.`);
        } else {
            this.players.you.sendMessage(`There was a problem updating ${existingPortal.name} portal.`);
        }
    }

    // CONFIRM MENU

    public confirmMenuDeletePortal(portal: Portal): void {
        let result = this.readWriteService.deletePortal(portal, this.players.you);
        if (result) {
            this.players.you.sendMessage(`Deleted the portal ${portal.name}.`);
        } else {
            this.players.you.sendMessage(`There was a problem deleting the portal ${portal.name}.`);
        }
    }
}
