import { ActionFormData } from '@minecraft/server-ui';
export class MainMenu {
    /**
     * Creates a main menu.
     * @constructor
     * @param delegate - A MenuManager instance that handles button selection.
     * @param players - A Players instance that contains all player information.
     */
    constructor(delegate, players) {
        this.delegate = delegate;
        this.players = players;
    }
    /**
     * Opens the main menu for the PortalPal interface.
     * The main menu allows the user to select a player whose portals they want to view.
     */
    open() {
        let form = new ActionFormData().title('PortalPal');
        form.button("Your Portals", "textures/items/diamond_helmet");
        for (const player of this.players.otherPlayers) {
            form.button(player.name, "textures/items/gold_helmet");
        }
        form.show(this.delegate.players.you).then((response) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.delegate.mainMenuSelectedPlayer(this.delegate.players.you);
                }
                else {
                    let index = response.selection - 1;
                    this.delegate.mainMenuSelectedPlayer(this.players.otherPlayers[index]);
                }
            }
        });
    }
}
