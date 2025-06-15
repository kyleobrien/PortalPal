import { ActionFormData } from '@minecraft/server-ui';
export class MainMenuController {
    /**
     * Creates a main menu.
     * @constructor
     * @param { MainMenuControllerDelegate } delegate An object to handle button selection.
     * @param { Players } players All players in the game.
     */
    constructor(delegate, players) {
        this.delegate = delegate;
        this.players = players;
    }
    /**
     * Opens the main menu for the PortalPal interface.
     * The main menu allows the user to select a player whose portals they want to view.
     * @returns { boolean } If the menu was shown (or not).
     */
    open() {
        const form = new ActionFormData();
        form.title('PortalPal');
        form.button("Your Portals", "textures/items/diamond_helmet");
        for (const player of this.players.others) {
            form.button(player.minecraftPlayer.name, "textures/items/gold_helmet");
        }
        try {
            form.show(this.players.you.minecraftPlayer).then((response) => {
                if (response.selection !== undefined) {
                    if (response.selection == 0) {
                        this.delegate.mainMenuSelectedPlayer(this.players.you);
                    }
                    else {
                        const index = response.selection - 1; // Offset by 1 for the "Your Portals" button.
                        this.delegate.mainMenuSelectedPlayer(this.players.others[index]);
                    }
                }
            });
            return true;
        }
        catch {
            return false;
        }
    }
}
