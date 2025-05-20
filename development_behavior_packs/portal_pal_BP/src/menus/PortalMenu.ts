import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { Player } from '@minecraft/server';
import { MenuManager } from '../MenuManager';
import { Players } from '../Players';
import { PortalColors, SavedData } from '../ReadWriteService';
import { Utilities } from '../Utilities';

export class PortalMenu {
    private readonly delegate: MenuManager;
    private readonly players: Players;
    private readonly chosenPlayer: Player;
    private readonly savedData: SavedData;
    
    /**
     * Creates a portal menu.
     * @constructor
     * @param delegate - A MenuManager instance that handles button selection.
     * @param players - A Players instance that contains all player information.
     * @param chosenPlayer - A player instance that the user has selected on the main menu.
     * @param savedData - A SavedData instance that contains the portals for the chosen player.
     */
    constructor(delegate: MenuManager, players: Players, chosenPlayer: Player, savedData: SavedData) {
        this.delegate = delegate;
        this.players = players;
        this.chosenPlayer = chosenPlayer;
        this.savedData = savedData;
    }

    /**
     * Opens the portal menu.
     * This menu allows the user to select a current location, spawn, or existing portal to teleport to.
     * It also allows the player to add a new portal if they selected themselves on the main menu.
     */
    public open(): void {
        const form = new ActionFormData().title('Available Portals'); 
        form.button("Current Location", "textures/items/compass_item");
        form.button("Spawn Point", "textures/items/bed_purple");

        let buttonCount = 2;

        for (const portal of this.savedData.portals) {
            const iconPath = `textures/icons/portal_${PortalColors[portal.color]}.png`;
            form.button(portal.name, iconPath);
            buttonCount += 1;
        }

        if (Utilities.arePlayersTheSame(this.players.you, this.chosenPlayer)) {
            form.button("Add Portal", "textures/icons/menu_plus");
            buttonCount += 1;
        }

        form.show(this.players.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.delegate.portalMenuTeleportToCurrentLocationOfPlayer(this.chosenPlayer);
                } else if (response.selection == 1) {
                    this.delegate.portalMenuTeleportToSpawnOfPlayer(this.chosenPlayer);
                } else if (Utilities.arePlayersTheSame(this.players.you, this.chosenPlayer) && (response.selection == buttonCount - 1)) {
                    this.delegate.portalMenuAddNewPortal();
                } else {
                    const portal = this.savedData.portals[response.selection - 2]; // Offset by 2 for the first 2 button.
                    this.delegate.portalMenuTeleportToPortal(portal, this.chosenPlayer);
                }
            }
        });
    }
}
