import { system, world, Player, ItemUseAfterEvent } from '@minecraft/server';
import { ActionMenu } from './menus/ActionMenu';
import { MainMenu } from './menus/MainMenu';
import { PortalMenu } from './menus/PortalMenu';
import { PortalService, SavedData } from './PortalService';
import { PropertiesMenu } from './menus/PropertiesMenu';
import { Logger } from './Logger';

export class MenuManager {
    // TODO: Can I make this private?
    public you: Player;
    private otherPlayers: Player[];

    private readonly portalService: PortalService;

    constructor() {
        this.portalService = new PortalService();
    }

    public start(event: ItemUseAfterEvent) {
        this.you = event.source;

        let mainMenu = new MainMenu(this,
                                    this.you,
                                    this.findAllOtherPlayersBut(this.you));
        mainMenu.open();
    }

    /**************************************
     ******* Handle Menu Selections ******* 
     **************************************/

    // MAIN MENU
    
    public mainMenuSelected(chosenPlayer: Player) {
        let savedData;

        if (this.isPlayerYou(chosenPlayer)) {
            savedData = this.portalService.fetchDataFor(chosenPlayer, false);
        } else {
            savedData = this.portalService.fetchDataFor(chosenPlayer, true);
        }

        let portalMenu = new PortalMenu(this, chosenPlayer, savedData);
        portalMenu.open();
    }

    // PORTAL MENU

    public portalMenuSelected(forPlayer: Player, index: number, savedData: SavedData) {
        if (this.isPlayerYou(forPlayer)) {
            let actionMenu = new ActionMenu(this, this.you);
            actionMenu.open();

        } else {
            // warp to that point

        }
    }

    public portalMenuAddNewPortal() {
        let propertiesMenu = new PropertiesMenu(this, false);
        propertiesMenu.open();
    }

    public portalMenuTeleportToCurrentLocation(targetPlayer: Player) {
        let teleportOptions = {
            checkForBlocks: true,
            dimension: targetPlayer.dimension
        };

        if (targetPlayer.id == this.you.id) {
            this.you.sendMessage("Can't teleport to yourself. You're already there!");
            this.playSound(this.you, false);
        } else {
            let name = this.possessiveName(targetPlayer.name);
            if (this.you.tryTeleport(targetPlayer.location, teleportOptions)) {
                this.you.sendMessage(`Teleported to ${name} current location...`);
                this.playSound(this.you, true);
            } else {
                this.you.sendMessage(`ERROR: Failed to teleport to ${name} current location!`);
                this.playSound(this.you, false);
            }
        }
    }

    public portalMenuTeleportToSpawn(targetPlayer: Player) {
        let spawnPoint = targetPlayer.getSpawnPoint();

        if (spawnPoint != undefined) {
            let spawnPointLocation = {
                x: spawnPoint.x,
                y: spawnPoint.y,
                z: spawnPoint.z
            };

            let teleportOptions = {
                checkForBlocks: true,
                dimension: spawnPoint.dimension
            };

            if (this.you.tryTeleport(spawnPointLocation, teleportOptions)) {
                let name: string;
                if (targetPlayer.id == this.you.id) {
                    name = "your";
                } else {
                    name = this.possessiveName(targetPlayer.name);
                }
                this.you.sendMessage(`Teleported to ${name} spawn point...`);
                this.playSound(this.you, true);
            } else {
                this.you.sendMessage(`ERROR: Failed to teleport to ${name} spawn point!`);
                this.playSound(this.you, false);
            }
        } else {
            this.you.sendMessage(`ERROR: Failed to teleport to ${name} spawn point. It doesn't exist!`);
            this.playSound(this.you, false);
        }
    }

    public handlePropertiesSubmit(formValues, isExistingPortal) {
        let portal = {
            "name": formValues[0],
            "color": formValues[1],
            "private": formValues[2],
            "location": this.you.location,
            "dimension": this.you.dimension
        }

        let success = this.portalService.addPortal(this.you, portal);
        
        if (success) {
            this.you.sendMessage(`Added ${portal.name} to your saved portals.`);
        } else {
            this.you.sendMessage(`There was a prolem adding ${portal.name} to your saved portals.`);
        }

        // TEST
        let saved = this.portalService.fetchDataFor(this.you);
        Logger.log(JSON.stringify(saved));
    }

    // TODO: This doesn't seem to work great. I want to play a sound in an area and everyone around should hear it.
    public playSound(player, success) {
        if (success) {
            system.runTimeout(() => {
                player.playSound("portal_pal.teleport");
            }, 5);
        } else {
            system.runTimeout(() => {
                player.playSound("portal_pal.failure");
            }, 5);
        }
    }

    private possessiveName(name: string) {
        let posessiveName = name;
        let lastCharacter = name.charAt(name.length - 1);

        if (lastCharacter == "s") {
            posessiveName += "'";
        } else {
            posessiveName += "'s";
        }

        return posessiveName;
    }

    public isPlayerYou(player: Player): boolean {
        if (player.id == this.you.id) {
            return true;
        }

        return false;
    }

    public findAllOtherPlayersBut(you: Player): Player[] {
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        
        otherPlayers.sort((a, b) => a.name.localeCompare(b.name));

        return otherPlayers;
    }
}
