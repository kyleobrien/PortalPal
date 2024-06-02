import { ActionFormData } from '@minecraft/server-ui';
export class PlayerMenu {
    constructor(menuManager, you, otherPlayers) {
        this.menuManager = menuManager;
        this.you = you;
        this.otherPlayers = otherPlayers;
        // TODO: Should I sort the players in some way? Maye alphaetically?
    }
    open() {
        let form = new ActionFormData().title('PortalPal');
        // TODO: Need to decide on an icon for each type of player.
        form.button("Your Portals", "textures/items/diamond_helmet");
        for (const player of this.otherPlayers) {
            form.button(player.name, "textures/items/iron_helmet");
        }
        form.show(this.you).then((response) => {
            if (response.canceled) {
                // They've canceled. Do nothing.
            }
            else if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.playerMenuSelected(this.you);
                }
                else {
                    let index = response.selection - 1;
                    this.menuManager.playerMenuSelected(this.otherPlayers[index]);
                }
            }
        });
    }
}
