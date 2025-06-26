import { ActionFormData, type ActionFormResponse } from '@minecraft/server-ui';
import type { Portal } from 'value_objects/Portal';
import type { PortalPalPlayer } from '../entities/PortalPalPlayer';
import { PortalColor } from '../enumerations/PortalColor';
import type { SavedData } from '../value_objects/SavedData';

export interface PortalMenuControllerDelegate {
    portalMenuTeleportToCurrentLocationOfPlayer(player: PortalPalPlayer): void;
    portalMenuTeleportToSpawnOfPlayer(player: PortalPalPlayer): void;
    portalMenuAddNewPortal(): void;
    portalMenuTeleportToPortal(portal: Portal, player: PortalPalPlayer): void;
}

export class PortalMenuController {
    private readonly delegate: PortalMenuControllerDelegate;
    private readonly you: PortalPalPlayer;
    private readonly player: PortalPalPlayer;
    private readonly savedData: SavedData;
    
    /**
     * Creates a portal menu.
     * @constructor
     * @param { PortalMenuControllerDelegate } delegate An object to handle button selection.
     * @param { PortalPalPlayer } you The player invoking the PortalPal.
     * @param { PortalPlaPlayer } chosenPlayer The player that was selected on the main menu.
     * @param { SavedData } savedData The portals for the chosen player.
     */
    constructor(delegate: PortalMenuControllerDelegate, you: PortalPalPlayer, chosenPlayer: PortalPalPlayer, savedData: SavedData) {
        this.delegate = delegate;
        this.you = you;
        this.player = chosenPlayer;
        this.savedData = savedData;
    }

    /**
     * Opens the portal menu.
     * This menu allows the user to select a current location, spawn, or existing portal to teleport to.
     * It also allows the user to add a new portal if they selected themselves on the main menu.
     * @returns { boolean } If the menu was shown (or not).
     */
    public open(): boolean {
        const form = new ActionFormData();
        form.title('Available Portals'); 
        form.button("Current Location", "textures/items/compass_item");
        form.button("Spawn Point", "textures/items/bed_purple");

        let buttonCount = 2;

        for (const portal of this.savedData.portals) {
            const iconPath = `textures/icons/portal_${PortalColor[portal.color]}.png`;
            form.button(portal.name, iconPath);
            buttonCount += 1;
        }

        if (this.player.isYou) {
            form.button("Add Portal", "textures/icons/menu_plus");
            buttonCount += 1;
        }

        try {
            form.show(this.you.minecraftPlayer).then((response: ActionFormResponse) => {
                if (response.selection !== undefined) {
                    const isLastButton = response.selection === buttonCount - 1;

                    if (response.selection === 0) {
                        this.delegate.portalMenuTeleportToCurrentLocationOfPlayer(this.player);
                    } else if (response.selection === 1) {
                        this.delegate.portalMenuTeleportToSpawnOfPlayer(this.player);
                    } else if (this.player.isYou && isLastButton) {
                        this.delegate.portalMenuAddNewPortal();
                    } else {
                        const portal = this.savedData.portals[response.selection - 2]; // Offset by 2 for the first 2 button.
                        this.delegate.portalMenuTeleportToPortal(portal, this.player);
                    }
                }
            });

            return true;
        } catch {
            return false;
        }
    }
}
