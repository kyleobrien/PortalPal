import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

import { MenuManager } from '../MenuManager';

export class MainMenu {
    private readonly menuManager: MenuManager;
    private readonly you: Player;
    private readonly otherPlayers: Player[];
    
    constructor(menuManager: MenuManager, you: Player, otherPlayers: Player[]) {
        this.menuManager = menuManager;
        this.you = you;
        this.otherPlayers = otherPlayers.sort((a, b) => a.name.localeCompare(b.name));
    }

    public open(): void {
        let form = new ActionFormData().title('PortalPal');
        
        form.button("Your Portals", "textures/items/diamond_helmet");

        for (const player of this.otherPlayers) {
            form.button(player.name, "textures/items/iron_helmet");
        }

        form.show(this.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.mainMenuSelected(this.you);
                } else {
                    let index = response.selection - 1;
                    this.menuManager.mainMenuSelected(this.otherPlayers[index]);
                }
            }
        });
    }
}
