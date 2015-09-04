# travel-log

travel-log is an engine concept for a series of linked mini-games written by
multiple authors.

*It is still in planning stage.*

It is designed around the principle of an immutable append-only log which is the 
only communication between "worlds".

The prototype will use a central host which marshals copies of the log between 
worlds, but some kind of crypto chain would probably be better.

There are three primary components:

1. The host
2. Worlds
3. UI clients

## Host

The host maintains the log, transfers control between worlds, and passes 
messages between the current world and the current UI client.

## Worlds

The worlds are implemented as web workers - each world can post messages that:

1. Request a *copy* of the current full log from the host process
2. Append a message to the log

Typical messages to the log might be memorising some kind of state (the player
found/did something), requesting that the host update the UI, or that the host 
exit the process and transfer control to another world. Aside from some reserved 
messages, the log is free form, however it is expected that (optional) 
conventions will arise.

Worlds can inspect the log to see what actions the player has taken in other
worlds - for example, a story-based game want to know if the player has already
chosen a name in an earlier game, and use it if they have. World authors will
probably want to search the log based on certain criteria to find just the 
information that they want - they may decide to only trust log entries from
certain other worlds for example, or have an "entry requirement" of certain 
actions having been logged prior to visiting. They may only allow entry *from*
certain worlds.

Other than restrictions in how the worker communicates with the host, the world
minigame can do anything it likes, so any type of game can be created within
the limitation of the messaging system defined by the current UI client. 

## UI clients

UI clients should be pluggable and requested by worlds, eg a CLI client, an SVG 
client, a canvas client, a WebGL client. If a player has specified that they 
only for example support CLI, they will only be able to travel between worlds
supporting CLI. Cleverly made worlds may support multiple UI clients.

A worker can request that the host 
