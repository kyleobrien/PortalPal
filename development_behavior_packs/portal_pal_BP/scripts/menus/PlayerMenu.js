import { ActionFormData } from '@minecraft/server-ui';
export class PlayerMenu {
    constructor(menuManager, otherPlayers) {
        this.menuManager = menuManager;
        this.otherPlayers = otherPlayers;
    }
    open() {
        let form = new ActionFormData().title('PortalPal');
        form.button("Your Portals", "textures/items/diamond_helmet");
        for (const player of this.otherPlayers) {
            form.button(player.name, "textures/items/iron_helmet");
        }
        form.show(this.menuManager.you).then((response) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.playerMenuSelected(this.menuManager.you);
                }
                else {
                    let index = response.selection - 1;
                    this.menuManager.playerMenuSelected(this.otherPlayers[index]);
                }
            }
        });
    }
}
