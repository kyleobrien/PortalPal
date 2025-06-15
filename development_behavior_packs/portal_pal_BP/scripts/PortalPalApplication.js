import { world } from '@minecraft/server';
import { ActionMenuController } from './controllers/ActionMenuController';
import { ConfirmDeleteMenuController } from './controllers/ConfirmDeleteMenuController';
import { MainMenuController } from './controllers/MainMenuController';
import { MessageService } from './services/MessageService';
import { Players } from './entities/Players';
import { PortalMenuController } from './controllers/PortalMenuController';
import { PropertiesMenuController } from './controllers/PropertiesMenuController';
import { PortalRepository } from './repositories/PortalRepository';
import { TeleportService } from './services/TeleportService';
export class PortalPalApplication {
    constructor(you) {
        let allPlayers;
        try {
            allPlayers = world.getAllPlayers();
        }
        catch {
            allPlayers = [];
        }
        this.players = new Players(you, allPlayers);
        this.messageService = new MessageService(this.players.you);
    }
    /**
     * The main entry point for the menu manager.
     */
    initialize() {
        const mainMenuController = new MainMenuController(this, this.players);
        const wasShown = mainMenuController.open();
        if (!wasShown) {
            this.messageService.sendMessage("Could not show the main menu.", true);
        }
    }
    // #region MAIN MENU
    /**
     * Handle the selection of a player in the main menu.
     * @param { PortalPalPlayer } selectedPlayer - The player that was selected.
     */
    mainMenuSelectedPlayer(selectedPlayer) {
        const portalRepository = new PortalRepository();
        const excludePrivate = !selectedPlayer.isYou;
        const savedData = portalRepository.fetchDataForPlayer(selectedPlayer, excludePrivate);
        const portalMenuController = new PortalMenuController(this, this.players.you, selectedPlayer, savedData);
        const wasShown = portalMenuController.open();
        if (!wasShown) {
            this.messageService.sendMessage("Could not show the portal menu.", true);
        }
    }
    // #endregion
    // #region PORTAL MENU
    /**
     * Handle the selection of the current location button in the portal menu.
     * @param { PortalPalPlayer } player - The player to teleport to.
     */
    portalMenuTeleportToCurrentLocationOfPlayer(player) {
        const teleportService = new TeleportService(this.players.you);
        teleportService.teleportToLocationOfPlayer(player);
    }
    /**
     * Handle the selection of the spawn point button in the portal menu.
     * @param { PortalPalPlayer } player - The player of the spawn point to teleoprt to.
     */
    portalMenuTeleportToSpawnOfPlayer(player) {
        const teleportService = new TeleportService(this.players.you);
        teleportService.teleportToSpawnOfPlayer(player);
    }
    /**
     * Handle the selection of a portal in the portal menu.
     * @param { Portal } portal - The portal that was selected.
     * @param { PortalPalPlayer } forPlayer The player who ows the portal.
     */
    portalMenuTeleportToPortal(portal, forPlayer) {
        if (forPlayer.isYou) {
            const actionMenuController = new ActionMenuController(this, this.players.you, portal);
            const wasShown = actionMenuController.open();
            if (!wasShown) {
                this.messageService.sendMessage("Could not show the action menu.", true);
            }
        }
        else {
            const teleportService = new TeleportService(this.players.you);
            teleportService.teleportToPortal(portal);
        }
    }
    /**
     * Handle the selection of adding a new portal button in the portal menu.
     */
    portalMenuAddNewPortal() {
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
    actionMenuGoToPortal(portal) {
        const teleportService = new TeleportService(this.players.you);
        teleportService.teleportToPortal(portal);
    }
    /**
     * Handle the selection of the edit button in the action menu.
     * @param { Portal } portal - The portal to edit.
     */
    actionMenuEditPortal(portal) {
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
    actionMenuDeletePortal(portal) {
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
    propertiesMenuAddWithValues(formValues) {
        const portal = {
            "id": "",
            "name": formValues[0],
            "color": formValues[1],
            "private": formValues[2],
            "location": this.players.you.minecraftPlayer.location,
            "dimension": this.players.you.minecraftPlayer.dimension.id.split(":")[1]
        };
        const portalRepository = new PortalRepository();
        const wasSuccessful = portalRepository.addPortal(portal, this.players.you);
        this.messageService.sendPortalAddMessage(portal, wasSuccessful);
    }
    /**
     * Handle the Submit button when editing an existing portal in the properties menu.
     * @param formValues - An ordered set of values based on the order of controls specified by ModalFormData.
     * @param existingPortal - The portal that is being edited.
     */
    propertiesMenuEditWithValues(formValues, existingPortal) {
        existingPortal.name = formValues[0];
        existingPortal.color = formValues[1];
        existingPortal.private = formValues[2];
        const portalRepository = new PortalRepository();
        const wasSuccessful = portalRepository.editPortal(existingPortal, this.players.you);
        this.messageService.sendPortalEditMessage(existingPortal, wasSuccessful);
    }
    // #endregion
    // #region CONFIRM MENU
    confirmMenuDeletePortal(portal) {
        const portalRepository = new PortalRepository();
        const wasSuccessful = portalRepository.deletePortal(portal, this.players.you);
        this.messageService.sendPortalDeleteMessage(portal, wasSuccessful);
    }
}
