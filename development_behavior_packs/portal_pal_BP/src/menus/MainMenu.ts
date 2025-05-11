import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

import { MenuManager } from '../MenuManager';

export class MainMenu {
    private readonly menuManager: MenuManager;
    private readonly otherPlayers: Player[];
    
    constructor(menuManager: MenuManager, otherPlayers: Player[]) {
        this.menuManager = menuManager;
        this.otherPlayers = otherPlayers.sort((a, b) => a.name.localeCompare(b.name));
    }

    public open(): void {
        let form = new ActionFormData().title('PortalPal');
        
        form.button("Your Portals", "textures/items/diamond_helmet");

        for (const player of this.otherPlayers) {
            form.button(player.name, "textures/items/gold_helmet");
        }

        form.show(this.menuManager.players.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.mainMenuSelectedPlayer(this.menuManager.players.you);
                } else {
                    let index = response.selection - 1;
                    this.menuManager.mainMenuSelectedPlayer(this.otherPlayers[index]);
                }
            }
        });
    }
}
