import { ModalFormData } from '@minecraft/server-ui';
export class PropertiesMenu {
    constructor(menuManager, existingPortal = null) {
        this.menuManager = menuManager;
        this.existingPortal = existingPortal;
    }
    open() {
        let title = "Add a Portal";
        if (this.existingPortal !== null) {
            title = "Edit Portal";
        }
        let form = new ModalFormData().title(title);
        if (this.existingPortal !== null) {
            form.textField("Name", "", this.existingPortal.name);
            form.dropdown("Icon Color", ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"], this.existingPortal.color);
            form.toggle("Private", this.existingPortal.private);
        }
        else {
            form.textField("Name", "Portal Name");
            form.dropdown("Icon Color", ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"], 0);
            form.toggle("Private", false);
        }
        form.show(this.menuManager.you).then((response) => {
            if (!response.canceled && response.formValues) {
                if (this.existingPortal) {
                    this.menuManager.handlePropertiesSubmitForEdit(response.formValues, this.existingPortal);
                }
                else {
                    this.menuManager.handlePropertiesSubmitForAdd(response.formValues);
                }
            }
        });
    }
}
