# TODO

## Features

-   Allow a private mode for a player so that they can't warp to you.
    -   They still show in the main menu (possibly with a special icon to reflect the status).
    -   Players cannot warp to their current location or spawn point.

## Improvements

-   Improve the playing of the teleportation sound so that it plays for everyone in the vicinity (outgoing and incoming).
-   Consider getting better success and failure sounds.
-   [Raw Message JSON](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/rawmessagejson?view=minecraft-bedrock-stable) to improve the messaging to players.
-   Finish handling all errors that I've punted on.
-   Change to always show current players as well as those who are offline, but have saved portals.
-   Add JSDoc support to everything.

## Bugs

-   Determine size of saved JSON and prevent the player from saving more than 10KB.

--------------

-   Do I need to escape characters going into the json?
-   Assets:
    -   Icons for all the buttons.
    -   Better PortalPal texture.
    -   Better behavior and texture pack artwork.
-   Code review and clean up.
