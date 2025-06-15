import { MessageFormData } from '@minecraft/server-ui';
export class ConfirmDeleteMenuController {
    /**
     * Creates a confirm menu.
     * @constructor
     * @param { ConfirmMenuControllerDelegate } delegate An object to handle button selection.
     * @param { PortalPalPlayer } you The player invoking the PortalPal.
     * @param { Portal } portalToDelete The portal to confirm the delete action for.
     */
    constructor(delegate, you, portalToDelete) {
        this.delegate = delegate;
        this.you = you;
        this.portal = portalToDelete;
    }
    /**
     * Opens the confirm menu.
     * This menu allows the user an opportunity to confirm the deletion of a portal.
     * @returns { boolean } If the menu was shown (or not).
     */
    open() {
        const form = new MessageFormData();
        form.title("Delete Portal");
        form.body(`Are you sure you want to delete the portal named "${this.portal.name}"? This action cannot be undone.`);
        form.button1("Cancel");
        form.button2("Delete");
        try {
            form.show(this.you.minecraftPlayer).then((response) => {
                if ((response.selection !== undefined) && (response.selection === 1)) {
                    this.delegate.confirmMenuDeletePortal(this.portal);
                }
            });
            return true;
        }
        catch {
            return false;
        }
    }
}
