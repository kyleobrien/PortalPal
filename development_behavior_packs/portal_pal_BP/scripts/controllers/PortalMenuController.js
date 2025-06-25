import { ActionFormData } from '@minecraft/server-ui';
import { PortalColor } from '../enumerations/PortalColor';
export class PortalMenuController {
    /**
     * Creates a portal menu.
     * @constructor
     * @param { PortalMenuControllerDelegate } delegate An object to handle button selection.
     * @param { PortalPalPlayer } you The player invoking the PortalPal.
     * @param { PortalPlaPlayer } chosenPlayer The player that was selected on the main menu.
     * @param { SavedData } savedData The portals for the chosen player.
     */
    constructor(delegate, you, chosenPlayer, savedData) {
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
    open() {
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
            form.show(this.you.minecraftPlayer).then((response) => {
                if (response.selection !== undefined) {
                    const isLastButton = response.selection === buttonCount - 1;
                    if (response.selection === 0) {
                        this.delegate.portalMenuTeleportToCurrentLocationOfPlayer(this.player);
                    }
                    else if (response.selection === 1) {
                        this.delegate.portalMenuTeleportToSpawnOfPlayer(this.player);
                    }
                    else if (this.player.isYou && isLastButton) {
                        this.delegate.portalMenuAddNewPortal();
                    }
                    else {
                        const portal = this.savedData.portals[response.selection - 2]; // Offset by 2 for the first 2 button.
                        this.delegate.portalMenuTeleportToPortal(portal, this.player);
                    }
                }
            });
            return true;
        }
        catch {
            return false;
        }
    }
}
