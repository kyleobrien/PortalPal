import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

import { MenuManager } from '../MenuManager';
import { Portal } from '../ReadWriteService';

export class ActionMenu {
    private readonly menuManager: MenuManager;
    private readonly portal: Portal;
    
    constructor(menuManager: MenuManager, portal: Portal) {
        this.menuManager = menuManager;
        this.portal = portal;
    }

    public open(): void {
        let form = new ActionFormData().title('Actions');
        
        form.button("Go!", "textures/items/fireworks");
        form.button("Edit", "textures/items/book_written");
        form.button("Delete", "textures/blocks/barrier");
      
        form.show(this.menuManager.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.actionMenuGoToPortal(this.portal);
                } else if (response.selection == 1) {
                    this.menuManager.actionMenuEditPortal(this.portal);
                } else if (response.selection == 2) {
                    this.menuManager.actionMenuDeletePortal(this.portal);
                }
            }
        });
    }
}
