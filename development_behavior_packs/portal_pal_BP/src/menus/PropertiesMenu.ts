import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';

import { MenuManager } from '../MenuManager';
import { Portal } from 'ReadWriteService';

export class PropertiesMenu {
    private readonly menuManager: MenuManager;
    private readonly existingPortal: Portal;
    
    constructor(menuManager: MenuManager, existingPortal: Portal = null) {
        this.menuManager = menuManager;
        this.existingPortal = existingPortal;
    }

    public open() {
        let title = "Add a Portal";
        if (this.existingPortal !== null) {
            title = "Edit Portal"
        }

        let form = new ModalFormData().title(title);

        const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Brown", "Pink", "Purple"];
        if (this.existingPortal !== null) {
            form.textField("Name", "", this.existingPortal.name);
            form.dropdown("Icon Color", colors, this.existingPortal.color);
            form.toggle("Private", this.existingPortal.private);
        } else {
            form.textField("Name", "Portal Name");
            form.dropdown("Icon Color", colors, 0);
            form.toggle("Private", false);
        }
        
        form.show(this.menuManager.you).then((response: ModalFormResponse) => {
            if (!response.canceled && response.formValues) {
                if (this.existingPortal) {
                    this.menuManager.handlePropertiesSubmitForEdit(response.formValues, this.existingPortal);
                } else {
                    this.menuManager.handlePropertiesSubmitForAdd(response.formValues);
                }
            }
        });
    }
}
