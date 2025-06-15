import { MessageFormData } from '@minecraft/server-ui';
export class ConfirmMenuController {
    /**
     * Creates a confirm menu.
     * @constructor
     * @param { ConfirmMenuControllerDelegate } delegate - An object to handle button selection.
     * @param { PortalPalPlayer } you - The player invoking the PortalPal.
     * @param { Portal } portal - The portal to confirm the actions for.
     */
    constructor(delegate, you, portal) {
        this.delegate = delegate;
        this.you = you;
        this.portal = portal;
    }
    /**
     * Opens the confirm menu.
     * This menu allows the user an opportunity to confirm the deletion of a portal.
     */
    open() {
        const body = `Are you sure you want to delete the portal named "${this.portal.name}"? This action cannot be undone.`;
        const form = new MessageFormData().title("Delete Portal")
            .body(body)
            .button1("Cancel")
            .button2("Delete");
        form.show(this.you.minecraftPlayer).then((response) => {
            if ((response.selection !== undefined) && (response.selection === 1)) {
                this.delegate.confirmMenuDeletePortal(this.portal);
            }
        });
    }
}
