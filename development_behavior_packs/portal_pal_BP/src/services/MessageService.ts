import { system, world } from '@minecraft/server';
import type { PortalPalPlayer } from '../entities/PortalPalPlayer';
import { PortalColor } from '../enumerations/PortalColor';
import type { Portal } from '../value_objects/Portal';

/**
 * This class uses the "Raw Message JSON" format.
 * https://learn.microsoft.com/en-us/minecraft/creator/reference/content/rawmessagejson?view=minecraft-bedrock-stable
 */
export class MessageService {
    private static readonly symbolMapping = {
        [PortalColor.purple]: "§u",
        [PortalColor.magenta]: "§d",
        [PortalColor.red]: "§c",
        [PortalColor.yellow]: "§e",
        [PortalColor.green]: "§a",
        [PortalColor.turquoise]: "§b",
        [PortalColor.blue]: "§9"
    }

    private readonly playerToMessage: PortalPalPlayer;

    /**
     * Creates a service to send messages to a player.
     * Also handles playing success and failure sound effects.
     * @constructor
     * @param { PortalPalPlayer } playerToMessage The player that is being teleported.
     */
    constructor(playerToMessage: PortalPalPlayer) {
        this.playerToMessage = playerToMessage;
    }

    /**
     * Sends a message after attempting to add a new portal.
     * @param { Portal } forPortal The portal being added.
     * @param { boolean } wasSuccessful If adding the portal was successful.
     */
    public sendPortalAddMessage(forPortal: Portal, wasSuccessful: boolean): void {
        const colorSymbol = MessageService.symbolMapping[forPortal.color];
        let message: string;

        if (wasSuccessful) {
            message = `Added ${colorSymbol}${forPortal.name}§r to your saved portals.`;
        } else {
            message = `§l§mERROR:§r There was a problem adding ${colorSymbol}${forPortal.name}§r to your saved portals.`;
        }
        
        this.playerToMessage.minecraftPlayer.sendMessage(message);
    }

    /**
     * Sends a message after attempting to edit a portal.
     * @param { Portal } forPortal The portal being edited.
     * @param { boolean } wasSuccessful If editing the portal was successful.
     */
    public sendPortalEditMessage(forPortal: Portal, wasSuccessful: boolean): void {
        const colorSymbol = MessageService.symbolMapping[forPortal.color];
        let message: string;

        if (wasSuccessful) {
            message = `Updated ${colorSymbol}${forPortal.name}§r portal.`;
        } else {
            message = `§l§mERROR:§r There was a problem updating ${colorSymbol}${forPortal.name}§r portal.`;
        }
        
        this.playerToMessage.minecraftPlayer.sendMessage(message);
    }

    /**
     * Sends a message after attempting to delete a portal.
     * @param { Portal } forPortal The portal being deleted.
     * @param { boolean } wasSuccessful If deleting the portal was successful.
     */
    public sendPortalDeleteMessage(forPortal: Portal, wasSuccessful: boolean): void {
        const colorSymbol = MessageService.symbolMapping[forPortal.color];
        let message: string;

        if (wasSuccessful) {
            message = `Deleted the portal ${colorSymbol}${forPortal.name}§r.`;
        } else {
            message = `§l§mERROR:§r There was a problem deleting the portal ${colorSymbol}${forPortal.name}§r.`;
        }
        
        this.playerToMessage.minecraftPlayer.sendMessage(message);
    }

    /**
     * Sends a message after attempting to teleport tp a portal.
     * @param { Portal } forPortal The portal being teleported to.
     * @param { boolean } wasSuccessful If teleporting was successful.
     */
    public sendPortalTeleportMessage(forPortal: Portal, wasSuccessful: boolean): void {
        const colorSymbol = MessageService.symbolMapping[forPortal.color];
        let message: string;

        if (wasSuccessful) {
            message = `Teleported to ${colorSymbol}${forPortal.name}§r...`;
        } else {
            message = `§l§mERROR:§r Failed to teleport to ${colorSymbol}${forPortal.name}§r.`;
        }
        
        this.playerToMessage.minecraftPlayer.sendMessage(message);
        this.playSound(wasSuccessful);
    }

    /**
     * Sends a message.
     * @param { string } message The text to send.
     * @param { boolean } wasSuccessful If deleting the portal was successful.
     */
    public sendMessage(message: string, isError: boolean = false, playSound: boolean = false): void {
        if (isError) {
            message = `§l§mERROR:§r ${message}`;
        }

        this.playerToMessage.minecraftPlayer.sendMessage(message);

        if (playSound) {
            this.playSound(!isError);
        }
    }

    /**
     * Plays a success or failure sound with the following behavior:
     * 1. A "success" sound effect is played for all players to hear teleporting.
     * 2. A "failure" sound effect is played only for the user who is using the PortalPal.
     * @param { boolean } wasSuccessful If the action prompting the sound effect was a success (or not).
     */
    private playSound(wasSuccessful: boolean): void {
        // TODO
        // 1 - Make the success sound play for everyone, not just the player doing the teleporting.
        //     Dimension class has a function called playSound(...) that should work for this.
        // 2 - Try to get the ticks lower, so there isn't so much lag after the action and before a sound.
        // Also, handle playSound throwing an exception.
        if (wasSuccessful) {
            system.runTimeout(() => {
                this.playerToMessage.minecraftPlayer.playSound("portal_pal.teleport");
            }, 3);
        } else {
            system.runTimeout(() => {
                this.playerToMessage.minecraftPlayer.playSound("portal_pal.failure");
            }, 1);
        }
    }

    /**
     * Print message to the scren for debugging.
     * @param { string } text The string to print.
     */
    public static log(text: string): void {
        world.sendMessage(text);
    }
}
