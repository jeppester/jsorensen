# Power savings

After having exclusively used [my development server](my-new-old-development-server.html) for a few weeks, there was one thing that kept bothering me: I didn't like to have a server running all the time.

Even though it was still cheaper than a cloud offering, it just felt wrong to have it running when it wasn't being used, and the fan-humming in my utility room was a frequent reminder of the total waste of power that was going on.

To solve that problem I eventually decided setting up Wake On Lan (WOL), and then suspend the server whenever I wasn't using it.

## WOL over VPN
Here's how I got WOL working:
1. I enabled WOL in the BIOS
2. I enabled WOL in Ubuntu (I followed [this SO-answer](https://askubuntu.com/a/892083))

Then I suspended my server, and I successfully woke my computer - happy times!

![suspended server](suspended-server.gif)
_My server, now suspended_

Then, to make things even better, I made some aliases for both operations, and finally, to be totally on the safe side, I decided to try turning on the computer over the VPN, aaaand... nothing happened.

I'm not a network expert (yet) so I had no clue that:

_You (obviously) can't broadcast a magic package (network layer 2) on a VPN connected network when using a TUN-connection, because TUN only supports network layer 3._

_You HAVE to use a (more network heavy) TAP-connection to get layer 2 access, and even then the broadcast might possibly get stopped by the router - as a safety measure._

After some desperation I managed to compile all that knowledge from a [few](https://en.wikipedia.org/wiki/Wake-on-LAN#Principle_of_operation) [different](https://serverfault.com/a/785029) [sources](https://security.stackexchange.com/a/46444) - and a bunch of more sources, that I now can't find/remember.

Somewhere around that point I also found out that my router has built-in WOL functionality, so I could just:
1. Open my browser
2. Navigate to my router's web interface
3. Log in
4. Browse to the wake on lan feature
5. Select my server from the list of network devices, and then bam! the server was up and running!

Having to go through all those steps would however damage the whole "just connect and continue where you left off"-concept quite a lot though. It was surely something I didn't want to be part of the story, when I was to proudly present the solution for my co-workers - I was determined to make it work.

The obvious first step was to try and use a TAP connection - which the preinstalled router software unfortunately wouldn't let me do. So I installed [asuswrt-merlin](https://www.asuswrt-merlin.net/) giving me way more VPN options, and allowing me to choose TAP connection from a fine select input.

But... it just did not work! The connection kept dropping before it was established. If it was the router or laptop I don't now, but the more I tried to debug the issue, the more I also read about how TAP-connections are more heavy, and shouldn't be used unless absolutely necessary. Eventually I gave up and decided to go brush my teeth and head to bed.

## The solution
Then as I lied in my bed, trying to not think too much about my failure, it suddenly occured to me; if my router could wake my server, I could perhaps SSH into my router, and do whatever the WOL web interface was doing.

The next day I spend roughly 10 minutes on figuring out:
1. How to SSH into the router
2. Which tool the router's WOL-functionality was using (turned out to be `ether-wake`)
3. An SSH command that would run the right `ether-wake` command from my router and exit.

It worked! Finally!

I now have the following two aliases, and they've made me happy everyday since:
- On my laptop:

  `alias wake-dev-server="ssh [user]@[router-ip] \"ether-wake -i br0 -b [server-mac]\""`

- On my server:

  `alias suspend-server="echo 'systemctl suspend' | sudo at now + 1 minute; exit"`

## Savings
I initially had the whole calculation floating around here, taking up a lot of space and possibly - had I made a mistake - exposing my inability to make correct calculations...

So here are just the important parts.

Based on:
- 150 watts ON-power usage
- 10 watts suspend-power usage
- 40 ON-hours a week

The average power usage is now down to: 43 watts - A more than 70% decrease, taking the overall monthly cost down to roughly 62 DKK (~9$) per month.

So for 62 DKK per month (~9$) I get a 4 dedicated cores and 8 gigs of ram. I can definitely live with that!
