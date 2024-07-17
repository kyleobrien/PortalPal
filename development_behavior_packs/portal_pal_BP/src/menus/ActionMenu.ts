import { Player } from '@minecraft/server';
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

    public open() {
        let form = new ActionFormData().title('Actions');
        
        form.button("Go!", "textures/items/diamond_helmet");
        form.button("Edit", "textures/items/diamond_helmet");
        form.button("Delete", "textures/items/diamond_helmet");
      
        form.show(this.menuManager.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.actionMenuSelectedGoTo(this.portal);
                } else if (response.selection == 1) {
                    this.menuManager.actionMenuEdit(this.portal);
                } else if (response.selection == 2) {
                    this.menuManager.actionMenuDelete(this.portal);
                }
            }
        });
    }
}
