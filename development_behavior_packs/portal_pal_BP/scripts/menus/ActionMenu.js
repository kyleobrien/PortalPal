import { ActionFormData } from '@minecraft/server-ui';
export class ActionMenu {
    constructor(menuManager, portal) {
        this.menuManager = menuManager;
        this.portal = portal;
    }
    open() {
        let form = new ActionFormData().title('Actions');
        form.button("Go!", "textures/items/diamond_helmet");
        form.button("Edit", "textures/items/diamond_helmet");
        form.button("Delete", "textures/items/diamond_helmet");
        form.show(this.menuManager.you).then((response) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.actionMenuSelectedGoTo(this.portal);
                }
                else if (response.selection == 1) {
                    this.menuManager.actionMenuEdit(this.portal);
                }
                else if (response.selection == 2) {
                    this.menuManager.actionMenuDelete(this.portal);
                }
            }
        });
    }
}
