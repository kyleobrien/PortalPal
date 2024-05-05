import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

export class PlayerView {
    private readonly you: Player;
    private readonly otherPlayers: Player[];
    
    constructor(you: Player, otherPlayers: Player[]) {
        this.you = you;
        this.otherPlayers = otherPlayers;
    }

    public open() {
        let form = new ActionFormData()
        .title('PortalPal')
    
        // TODO: Need to decide on an icon for each type of player.

        form.button("Your Portals", "textures/items/diamond_helmet");

        for (const player of this.otherPlayers) {
            form.button(player.name, "textures/items/iron_helmet");
        }

        form.show(this.you).then((response) => {
            // TODO: need to communicate to the view manager which player was chosen.
        });
    }
}
