import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { MenuManager } from '../MenuManager';
import { Portal } from '../PortalService';

export class ActionMenu {
    private readonly menuManager: MenuManager;
    private readonly you: Player;
    private readonly portal: Portal;
    
    constructor(menuManager: MenuManager, you: Player, portal: Portal) {
        this.menuManager = menuManager;
        this.you = you;
        this.portal = portal;
    }

    public open() {
        let form = new ActionFormData().title('Available Portals');
        
        form.button("Go!", "textures/items/diamond_helmet");
        form.button("Edit", "textures/items/diamond_helmet");
        form.button("Delete", "textures/items/diamond_helmet");
      
        form.show(this.you).then((response: ActionFormResponse) => {
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
