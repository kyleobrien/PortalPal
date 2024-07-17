import { MessageFormData } from '@minecraft/server-ui';
export class ConfirmMenu {
    constructor(menuManager, portal) {
        this.menuManager = menuManager;
        this.portal = portal;
    }
    open() {
        let body = `Are you sure you want to delete the portal named "${this.portal.name}"? This action cannot be undone.`;
        let form = new MessageFormData().title("Delete Portal")
            .body(body)
            .button1("Cancel")
            .button2("Delete");
        form.show(this.menuManager.you).then((response) => {
            if ((response.selection !== undefined) && (response.selection === 1)) {
                this.menuManager.confirmMenuDelete(this.portal);
            }
        });
    }
}
