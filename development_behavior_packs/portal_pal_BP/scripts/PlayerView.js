import { ActionFormData } from '@minecraft/server-ui';
export class PlayerView {
    constructor(you, otherPlayers) {
        this.you = you;
        this.otherPlayers = otherPlayers;
    }
    open() {
        let form = new ActionFormData()
            .title('PortalPal')
            .body('Choose a player:');
        // TODO: Need to decide on an icon for each type of player.
        form.button("Your Portals", "textures/items/diamond_helmet");
        for (const player of this.otherPlayers) {
            form.button(player.name, "textures/items/iron_helmet");
        }
        form.show(this.you).then((response) => { });
    }
    close() {
    }
}
