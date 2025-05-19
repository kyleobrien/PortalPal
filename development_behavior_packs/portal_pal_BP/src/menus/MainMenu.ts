import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { MenuManager } from '../MenuManager';
import { Players } from '../Players';

export class MainMenu {
    private readonly delegate: MenuManager;
    private readonly players: Players;
    
    /**
     * Creates a main menu.
     * @constructor
     * @param delegate - A MenuManager instance that handles button selection.
     * @param players - A Players instance that contains all player information.
     */
    constructor(delegate: MenuManager, players: Players) {
        this.delegate = delegate;
        this.players = players;
    }

    /**
     * Opens the main menu for the PortalPal interface.
     * The main menu allows the user to select a player whose portals they want to view.
     */
    public open(): void {
        let form = new ActionFormData().title('PortalPal');
        
        form.button("Your Portals", "textures/items/diamond_helmet");

        for (const player of this.players.otherPlayers) {
            form.button(player.name, "textures/items/gold_helmet");
        }

        form.show(this.delegate.players.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.delegate.mainMenuSelectedPlayer(this.delegate.players.you);
                } else {
                    let index = response.selection - 1;
                    this.delegate.mainMenuSelectedPlayer(this.players.otherPlayers[index]);
                }
            }
        });
    }
}
