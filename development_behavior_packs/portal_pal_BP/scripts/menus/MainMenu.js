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
        const form = new ActionFormData().title('PortalPal');
        form.button("Your Portals", "textures/items/diamond_helmet");
        for (const player of this.players.otherPlayers) {
            form.button(player.name, "textures/items/gold_helmet");
        }
        form.show(this.players.you).then((response) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.delegate.mainMenuSelectedPlayer(this.players.you);
                }
                else {
                    const index = response.selection - 1; // Offset by 1 for the "Your Portals" button.
                    this.delegate.mainMenuSelectedPlayer(this.players.otherPlayers[index]);
                }
            }
        });
    }
}
