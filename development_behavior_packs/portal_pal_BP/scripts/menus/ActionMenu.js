import { ActionFormData } from '@minecraft/server-ui';
export class ActionMenu {
    constructor(menuManager, portal) {
        this.menuManager = menuManager;
        this.portal = portal;
    }
    open() {
        let form = new ActionFormData().title('Actions');
        form.button("Go!", "textures/items/fireworks");
        form.button("Edit", "textures/items/book_written");
        form.button("Delete", "textures/blocks/barrier");
        form.show(this.menuManager.you).then((response) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.actionMenuGoToPortal(this.portal);
                }
                else if (response.selection == 1) {
                    this.menuManager.actionMenuEditPortal(this.portal);
                }
                else if (response.selection == 2) {
                    this.menuManager.actionMenuDeletePortal(this.portal);
                }
            }
        });
    }
}
