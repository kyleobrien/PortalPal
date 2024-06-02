import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { MenuManager } from 'MenuManager';

export class PlayerMenu {
    private readonly menuManager: MenuManager;

    private readonly you: Player;
    private readonly otherPlayers: Player[];
    
    constructor(menuManager: MenuManager, you: Player, otherPlayers: Player[]) {
        this.menuManager = menuManager;

        this.you = you;
        this.otherPlayers = otherPlayers;

        // TODO: Should I sort the players in some way? Maye alphaetically?
    }

    public open() {
        let form = new ActionFormData().title('PortalPal');
    
        // TODO: Need to decide on an icon for each type of player.

        form.button("Your Portals", "textures/items/diamond_helmet");

        for (const player of this.otherPlayers) {
            form.button(player.name, "textures/items/iron_helmet");
        }

        form.show(this.you).then((response: ActionFormResponse) => {
            if (response.canceled) {
                // They've canceled. Do nothing.
            } else if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.playerMenuSelected(this.you);
                } else {
                    let index = response.selection - 1;
                    this.menuManager.playerMenuSelected(this.otherPlayers[index]);
                }
            }
        });
    }
}
