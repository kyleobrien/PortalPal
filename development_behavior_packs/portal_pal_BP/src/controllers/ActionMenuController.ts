import { ActionFormData, type ActionFormResponse } from '@minecraft/server-ui';
import type { PortalPalPlayer } from '../entities/PortalPalPlayer';
import { PortalColor } from '../enumerations/PortalColor';
import type { Portal } from '../repositories/PortalRepository';

export interface ActionMenuControllerDelegate {
    actionMenuGoToPortal(portal: Portal): void;
    actionMenuEditPortal(portal: Portal): void;
    actionMenuDeletePortal(portal: Portal): void;
}

export class ActionMenuController {
    private readonly delegate: ActionMenuControllerDelegate;
    private readonly you: PortalPalPlayer;
    private readonly portal: Portal;
    
    /**
     * Creates an action menu.
     * @constructor
     * @param { ActionMenuControllerDelegate } delegate An object to handle button selection.
     * @param { PortalPalPlayer } you The player invoking the PortalPal.
     * @param { Portal } portalToActUpon The portal to perform actions on.
     */
    constructor(delegate: ActionMenuControllerDelegate, you: PortalPalPlayer, portalToActUpon: Portal) {
        this.delegate = delegate;
        this.you = you;
        this.portal = portalToActUpon;
    }

    /**
     * Opens the action menu.
     * This menu allows the user to teleport to the portal, edit it, or delete it.
     * @returns { boolean } If the menu was shown (or not).
     */
    public open(): boolean {
        const form = new ActionFormData();
        form.title('Actions');
        form.button("Go!", `textures/icons/portal_${PortalColor[this.portal.color]}.png`);
        form.button("Edit", "textures/items/book_written");
        form.button("Delete", "textures/blocks/barrier");
      
        try {
            form.show(this.you.minecraftPlayer).then((response: ActionFormResponse) => {
                if (response.selection !== undefined) {
                    if (response.selection === 0) {
                        this.delegate.actionMenuGoToPortal(this.portal);
                    } else if (response.selection === 1) {
                        this.delegate.actionMenuEditPortal(this.portal);
                    } else if (response.selection === 2) {
                        this.delegate.actionMenuDeletePortal(this.portal);
                    }
                }
            });

            return true;
        } catch {
            return false;
        }
    }
}
