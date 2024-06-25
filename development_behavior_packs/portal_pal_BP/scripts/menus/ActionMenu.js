import { ActionFormData } from '@minecraft/server-ui';
export class ActionMenu {
    constructor(menuManager, you) {
        this.menuManager = menuManager;
        this.you = you;
    }
    open() {
        let form = new ActionFormData().title('Available Portals');
        // TODO: Need to decide on an icon for each type of action.
        form.button("Go!", "textures/items/diamond_helmet");
        form.button("Edit", "textures/items/diamond_helmet");
        form.button("Delete", "textures/items/diamond_helmet");
        form.show(this.you).then((response) => {
            if (response.canceled) {
                // They've canceled. Do nothing.
            }
            else if (response.selection !== undefined) {
                if (response.selection == 0) {
                    // teleport them this.menuManager.
                }
                else if (response.selection == 1) {
                    // edit menu this.menuManager.
                }
                else if (response.selection == 2) {
                    // they want to delete this portal
                }
            }
        });
    }
}
