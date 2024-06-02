import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { MenuManager } from 'MenuManager';

export class PlayerMenu {
    private readonly menuManager: MenuManager;
    private readonly otherPlayers: Player[];
    
    constructor(menuManager: MenuManager, otherPlayers: Player[]) {
        this.menuManager = menuManager;
        this.otherPlayers = otherPlayers;
    }

    public open() {
        let form = new ActionFormData().title('PortalPal');
        form.button("Your Portals", "textures/items/diamond_helmet");

        for (const player of this.otherPlayers) {
            form.button(player.name, "textures/items/iron_helmet");
        }

        form.show(this.menuManager.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.playerMenuSelected(this.menuManager.you);
                } else {
                    let index = response.selection - 1;
                    this.menuManager.playerMenuSelected(this.otherPlayers[index]);
                }
            }
        });
    }
}
