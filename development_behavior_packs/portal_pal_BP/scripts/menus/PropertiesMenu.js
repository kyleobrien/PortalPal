import { ModalFormData } from '@minecraft/server-ui';
export class PropertiesMenu {
    constructor(menuManager, isExistingPortal) {
        this.menuManager = menuManager;
        this.isExistingPortal = isExistingPortal;
    }
    open() {
        let title = "Add a Portal";
        if (this.isExistingPortal) {
            title = "Edit Portal";
        }
        let form = new ModalFormData().title(title);
        form.textField("Name", "Portal Name");
        form.dropdown("Icon Color", ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"], 0);
        form.toggle("Private", false);
        form.show(this.menuManager.you).then((response) => {
            if (!response.canceled && response.formValues) {
                this.menuManager.handlePropertiesSubmit(response.formValues, this.isExistingPortal);
            }
        });
    }
}
