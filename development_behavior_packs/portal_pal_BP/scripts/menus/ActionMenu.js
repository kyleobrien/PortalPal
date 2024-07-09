import { ActionFormData } from '@minecraft/server-ui';
export class ActionMenu {
    constructor(menuManager, you, portal) {
        this.menuManager = menuManager;
        this.you = you;
        this.portal = portal;
    }
    open() {
        let form = new ActionFormData().title('Available Portals');
        form.button("Go!", "textures/items/diamond_helmet");
        form.button("Edit", "textures/items/diamond_helmet");
        form.button("Delete", "textures/items/diamond_helmet");
        form.show(this.you).then((response) => {
            if (response.canceled) {
                // They've canceled. Do nothing.
            }
            else if (response.selection !== undefined) {
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
