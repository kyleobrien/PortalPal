import { ModalFormData } from '@minecraft/server-ui';
import { PortalColor } from '../enumerations/PortalColor';
export class PropertiesMenuController {
    /**
     * Creates a properties menu.
     * @constructor
     * @param { PropertiesMenuControllerDelegate } delegate An object to handle button selection.
     * @param { PortalPalPlayer } you The player invoking the PortalPal.
     * @param { Portal } existingPortal The portal that is being edited. Will be null if a portal is being added.
     */
    constructor(delegate, you, existingPortal = null) {
        this.delegate = delegate;
        this.you = you;
        this.portal = existingPortal;
    }
    /**
     * Opens the a properties menu.
     * This menu allows the user to add a new portal or edit an existing one.
     * The user can set the name, icon color, and whether the portal is private.
     * @returns { boolean } If the menu was shown (or not).
     */
    open() {
        let title = "Add a Portal";
        if (this.portal !== null) {
            title = "Edit Portal";
        }
        // For numeric enums, keys also include the numbers, so we have to filter them out.
        let colors = Object.keys(PortalColor).filter(key => Number.isNaN(Number(key)));
        colors = colors.map(item => String(item).charAt(0).toUpperCase() + String(item).slice(1));
        const form = new ModalFormData();
        form.title(title);
        if (this.portal !== null) {
            form.textField("Name", "", this.portal.name);
            form.dropdown("Icon Color", colors, this.portal.color);
            form.toggle("Private", this.portal.private);
        }
        else {
            form.textField("Name", "Portal Name");
            form.dropdown("Icon Color", colors, 0);
            form.toggle("Private", false);
        }
        try {
            form.show(this.you.minecraftPlayer).then((response) => {
                if (!response.canceled && response.formValues) {
                    if (this.portal !== null) {
                        this.delegate.propertiesMenuEditWithValues(response.formValues, this.portal);
                    }
                    else {
                        this.delegate.propertiesMenuAddWithValues(response.formValues);
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
