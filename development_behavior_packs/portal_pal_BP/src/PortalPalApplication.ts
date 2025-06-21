import { Player, world } from '@minecraft/server';
import { ActionMenuController, ActionMenuControllerDelegate } from './controllers/ActionMenuController';
import { ConfirmDeleteMenuController, ConfirmDeleteMenuControllerDelegate } from './controllers/ConfirmDeleteMenuController';
import { MainMenuController, MainMenuControllerDelegate } from './controllers/MainMenuController';
import { MessageService } from './services/MessageService';
import { Players } from './entities/Players';
import { PortalMenuController, PortalMenuControllerDelegate } from './controllers/PortalMenuController';
import { PortalPalPlayer } from './entities/PortalPalPlayer';
import { PropertiesMenuController, PropertiesMenuControllerDelegate } from './controllers/PropertiesMenuController';
import { FetchSavedDateError, Portal, PortalRepository, SavedData } from './repositories/PortalRepository';
import { TeleportService } from './services/TeleportService';

export class PortalPalApplication implements MainMenuControllerDelegate, PortalMenuControllerDelegate, PropertiesMenuControllerDelegate, ActionMenuControllerDelegate, ConfirmDeleteMenuControllerDelegate {
    private readonly players: Players;
    private readonly messageService: MessageService;

    constructor(you: Player) {
        let allPlayers: Player[];
        try {
            allPlayers = world.getAllPlayers();
        } catch {
            allPlayers = []
        }

        this.players = new Players(you, allPlayers);
        this.messageService = new MessageService(this.players.you);
    }

    /**
     * The main entry point for the menu manager.
     */
    public initialize(): void {
        const mainMenuController = new MainMenuController(this, this.players);
        const wasShown = mainMenuController.open();

        if(!wasShown) {
            this.messageService.sendMessage("Could not show the main menu.", true);
        }
    }

    // #region MAIN MENU
    
    /**
     * Handle the selection of a player in the main menu.
     * @param { PortalPalPlayer } selectedPlayer - The player that was selected.
     */
    public mainMenuSelectedPlayer(selectedPlayer: PortalPalPlayer): void {
        const portalRepository = new PortalRepository();
        const excludePrivate = !selectedPlayer.isYou;
        
        let savedData: SavedData;
        try {
            savedData = portalRepository.fetchSavedDataForPlayer(selectedPlayer, excludePrivate);
        } catch {
            this.messageService.sendMessage("Could not load portals that are required to show the portal menu.", true);
        }
        
        const portalMenuController = new PortalMenuController(this, this.players.you, selectedPlayer, savedData);
        const wasShown = portalMenuController.open();

        if(!wasShown) {
            this.messageService.sendMessage("Could not show the portal menu.", true);
        }
    }

    // #endregion

    // #region PORTAL MENU

    /**
     * Handle the selection of the current location button in the portal menu.
     * @param { PortalPalPlayer } player - The player to teleport to.
     */
    public portalMenuTeleportToCurrentLocationOfPlayer(player: PortalPalPlayer): void {
        const teleportService = new TeleportService(this.players.you);
        teleportService.teleportToLocationOfPlayer(player);
    }

    /**
     * Handle the selection of the spawn point button in the portal menu.
     * @param { PortalPalPlayer } player - The player of the spawn point to teleoprt to.
     */
    public portalMenuTeleportToSpawnOfPlayer(player: PortalPalPlayer): void {
        const teleportService = new TeleportService(this.players.you);
        teleportService.teleportToSpawnOfPlayer(player);
    }

    /**
     * Handle the selection of a portal in the portal menu.
     * @param { Portal } portal - The portal that was selected.
     * @param { PortalPalPlayer } forPlayer The player who ows the portal.
     */
    public portalMenuTeleportToPortal(portal: Portal, forPlayer: PortalPalPlayer): void {
        if (forPlayer.isYou) {
            const actionMenuController = new ActionMenuController(this, this.players.you, portal);
            const wasShown = actionMenuController.open();
            
            if (!wasShown) {
                this.messageService.sendMessage("Could not show the action menu.", true);
            }

        } else {
            const teleportService = new TeleportService(this.players.you);
            teleportService.teleportToPortal(portal);
        }
    }

    /**
     * Handle the selection of adding a new portal button in the portal menu.
     */
    public portalMenuAddNewPortal(): void {
        const propertiesMenuController = new PropertiesMenuController(this, this.players.you);
        const wasShown = propertiesMenuController.open();

        if (!wasShown) {
            this.messageService.sendMessage("Could not show the properties menu.", true);
        }
    }

    // #endregion

    // #region ACTION MENU

    /**
     * Handle the selection of the go button in the action menu.
     * @param { Portal } portal - The portal to teleport to.
     */
    public actionMenuGoToPortal(portal: Portal): void {
        const teleportService = new TeleportService(this.players.you);
        teleportService.teleportToPortal(portal);
    }

    /**
     * Handle the selection of the edit button in the action menu.
     * @param { Portal } portal - The portal to edit.
     */
    public actionMenuEditPortal(portal: Portal): void {
        const propertiesMenuController = new PropertiesMenuController(this, this.players.you, portal);
        const wasShown = propertiesMenuController.open();

        if (!wasShown) {
            this.messageService.sendMessage("Could not show the properties menu.", true);
        }
    }
    
    /**
     * Handle the selection of the delete button in the action menu.
     * @param { Portal } portal - The portal to delete.
     */
    public actionMenuDeletePortal(portal: Portal): void {
        const confirmDeleteMenuController = new ConfirmDeleteMenuController(this, this.players.you, portal);
        const wasShown = confirmDeleteMenuController.open();

        if (!wasShown) {
            this.messageService.sendMessage("Could not show the confirmation menu.", true);
        }
    }

    // #endregion

    // #region PROPERTIES MENU

    /**
     * Handle the Submit button when adding a new portal in the properties menu.
     * @param formValues - An ordered set of values based on the order of controls specified by ModalFormData.
     */
    public propertiesMenuAddWithValues(formValues): void {
        const portal = {
            "id": "",
            "name": formValues[0],
            "color": formValues[1],
            "private": formValues[2],
            "location": this.players.you.minecraftPlayer.location,
            "dimension": this.players.you.minecraftPlayer.dimension.id.split(":")[1]
        }

        const portalRepository = new PortalRepository();
        const wasSuccessful = portalRepository.addPortal(portal, this.players.you);

        this.messageService.sendPortalAddMessage(portal, wasSuccessful);
    }

    /**
     * Handle the Submit button when editing an existing portal in the properties menu.
     * @param formValues - An ordered set of values based on the order of controls specified by ModalFormData.
     * @param existingPortal - The portal that is being edited.
     */
    public propertiesMenuEditWithValues(formValues, existingPortal): void {
        existingPortal.name = formValues[0];
        existingPortal.color = formValues[1];
        existingPortal.private = formValues[2];

        const portalRepository = new PortalRepository();
        const wasSuccessful = portalRepository.editPortal(existingPortal, this.players.you);
        
        this.messageService.sendPortalEditMessage(existingPortal, wasSuccessful);
    }

    // #endregion

    // #region CONFIRM MENU

    public confirmMenuDeletePortal(portal: Portal): void {
        const portalRepository = new PortalRepository();
        const wasSuccessful = portalRepository.deletePortal(portal, this.players.you);
        
        this.messageService.sendPortalDeleteMessage(portal, wasSuccessful);
    }

    // #endregion
}
