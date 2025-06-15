import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';
import { Portal } from '../repositories/PortalRepository';
import { PortalPalPlayer } from '../entities/PortalPalPlayer';

export interface PropertiesMenuControllerDelegate {
    propertiesMenuAddWithValues(formValues: any[]): void;
    propertiesMenuEditWithValues(formValues: any[], existingPortal: Portal): void;
}

export class PropertiesMenuController {
    private readonly delegate: PropertiesMenuControllerDelegate;
    private readonly you: PortalPalPlayer;
    private readonly portal: Portal;
    
    /**
     * Creates a properties menu.
     * @constructor
     * @param { PropertiesMenuControllerDelegate } delegate An object to handle button selection.
     * @param { PortalPalPlayer } you The player invoking the PortalPal.
     * @param { Portal } existingPortal The portal that is being edited. Will be null if a portal is being added.
     */
    constructor(delegate: PropertiesMenuControllerDelegate, you: PortalPalPlayer, existingPortal: Portal = null) {
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
    public open(): boolean {
        let title = "Add a Portal";
        if (this.portal !== null) {
            title = "Edit Portal"
        }

        const colors = ["Purple", "Magenta", "Red", "Yellow", "Green", "Turquoise", "Blue",];
        const form = new ModalFormData();
        form.title(title);

        if (this.portal !== null) {
            form.textField("Name", "", this.portal.name);
            form.dropdown("Icon Color", colors, this.portal.color);
            form.toggle("Private", this.portal.private);
        } else {
            form.textField("Name", "Portal Name");
            form.dropdown("Icon Color", colors, 0);
            form.toggle("Private", false);
        }
        
        try {
            form.show(this.you.minecraftPlayer).then((response: ModalFormResponse) => {
                if (!response.canceled && response.formValues) {
                    if (this.portal !== null) {
                        this.delegate.propertiesMenuEditWithValues(response.formValues, this.portal);
                    } else {
                        this.delegate.propertiesMenuAddWithValues(response.formValues);
                    }
                }
            });

            return true;
        } catch {
            return false;
        }
    }
}
