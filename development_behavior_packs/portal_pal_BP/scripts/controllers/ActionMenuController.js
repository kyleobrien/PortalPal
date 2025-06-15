import { ActionFormData } from '@minecraft/server-ui';
import { PortalColor } from '../repositories/PortalRepository';
export class ActionMenuController {
    /**
     * Creates an action menu.
     * @constructor
     * @param { ActionMenuControllerDelegate } delegate An object to handle button selection.
     * @param { PortalPalPlayer } you The player invoking the PortalPal.
     * @param { Portal } portalToActUpon The portal to perform actions on.
     */
    constructor(delegate, you, portalToActUpon) {
        this.delegate = delegate;
        this.you = you;
        this.portal = portalToActUpon;
    }
    /**
     * Opens the action menu.
     * This menu allows the user to teleport to the portal, edit it, or delete it.
     * @returns { boolean } If the menu was shown (or not).
     */
    open() {
        const form = new ActionFormData();
        form.title('Actions');
        form.button("Go!", `textures/icons/portal_${PortalColor[this.portal.color]}.png`);
        form.button("Edit", "textures/items/book_written");
        form.button("Delete", "textures/blocks/barrier");
        try {
            form.show(this.you.minecraftPlayer).then((response) => {
                if (response.selection !== undefined) {
                    if (response.selection == 0) {
                        this.delegate.actionMenuGoToPortal(this.portal);
                    }
                    else if (response.selection == 1) {
                        this.delegate.actionMenuEditPortal(this.portal);
                    }
                    else if (response.selection == 2) {
                        this.delegate.actionMenuDeletePortal(this.portal);
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
