# TODO

## Enhancements

-   Allow a private mode for a player so they can't warp to you.
    -   They still show in the main menu (possibly with a special icon to reflect the status).
    -   Players cannot warp to their current location or spawn point.
-   Improve the playing of the teleportation sound so that it plays for everyone in the vicinity (outgoing and incoming).
-   Get better success and failure sounds.
-   Get better artwork for all textures, icons, etc.
-   Use [Raw Message JSON](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/rawmessagejson?view=minecraft-bedrock-stable) to improve the messaging to players.
-   Show those who are offline, but have saved portals.
-   Get all the player messaging and sound playing into some class. Maybe a "You" class.

## Bugs

-   Determine size of saved JSON and prevent the player from saving more than 10KB.
-   Potential issues with handling weird characters in json.

## Other

-   Finish handling all errors that I've punted on.
-   Add JSDoc support to everything.
