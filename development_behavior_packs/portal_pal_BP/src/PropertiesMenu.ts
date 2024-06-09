import { Player } from '@minecraft/server';
import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';
import { MenuManager } from 'MenuManager';

export class PropertiesMenu {
    private readonly menuManager: MenuManager;
    private readonly isExistingPortal: boolean;
    
    constructor(menuManager: MenuManager, isExistingPortal: boolean) {
        this.menuManager = menuManager;
        this.isExistingPortal = isExistingPortal;
    }

    public open() {
        let title = "Add a Portal";
        if (this.isExistingPortal) {
            title = "Edit Portal"
        }

        let form = new ModalFormData().title(title);
        form.textField("Name", "Portal Name");
        form.dropdown("Icon Color", ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"], 0);
        form.toggle("Private", false);

        form.show(this.menuManager.you).then((response: ModalFormResponse) => {
            if (!response.canceled && response.formValues) {
                this.menuManager.handlePropertiesSubmit(response.formValues, this.isExistingPortal);
            }
        });
    }
}
