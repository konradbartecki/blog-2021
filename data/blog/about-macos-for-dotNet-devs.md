---
title: State of macOS for .NET devs (2021)
date: '2021-03-09'
tags: ['career', 'macos']
draft: false
summary: My thoughts when using macOS for .NET devleopment for over a year
---

I advise you to check out my former colleague post: https://damianantonowicz.pl/2020/06/14/en-windows-vs-macos-for-xamarin-developer/

Here's what I also have to add:

## Things I am missing coming from Windows

1. macOS dock cannot be enabled on all displays
1. macOS cannot handle different display (DPI) scaling per monitor
1. HDMI volume is not working, it outputs 100% of volume all the time, you need external third party apps to do that
1. Cannot control volume per application like in Windows
1. No window snapping to the side of the screen, you need to install third party app
1. Virtual desktops working unintuitively

   each physical screen has it's own set of virtual desktops and changing virtual desktop from A to B on one physical screen does not automatically change the virtual desktop from A to B on remaining physical screens

1. M1 macs do not support more than 1 external display
1. Polish diacritics have to be typed using `win`/`meta` key on standard PC keyboard
1. Font rendering on regular `1920x1080` monitors looks bad
1. Intel Macbooks Pros throttle like crazy, for example my 2019 MacBook Pro 15 inch with 8 core Intel i9 struggles with regular Teams calls resulting in voice skipping for both me and people receiving my voice and camera.
1. Cannot disable mouse acceleration, important when gaming
1. `cmd <-> opt` keys mapping for standard PC keyboard will work unintuitively when later using RDP or Windows in Parallels
1. if you want your macOS to be always on you have to:

   - have your power cable on
   - if you have your lid closed you have to have external display connected
   - fun fact: you can use `caffeinate` command to stop mac from sleeping because of inactivity, but requirements mentioned above still apply

1. Bootcamp poor user experience:

   - Speakers sound clearly worse
   - Touchpad experience is not as good as in native macOS
   - No TPM available
   - Occasional problems with Thunderbolt 3 devices not loading in Bootcamp Windows until few restarts.

1. If you want to connect remotely to macOS you basically have to choose between `VNC` or `SSH`
1. If you want to connect remotely to `RDP` device from `macOS` then RDP performance is visibly worse compared to Windows
1. **.NET 5 is not fully supported on ARM M1**
1. If you want to start up some process on unattended computer startup, let's say you want to start up a VM without logging in or you want to start up a remote connection server, then you are basically out of your luck, when Windows handles it quite cool

## Apps that don't have all of the features like Windows counterparts

### OBS

- does not have twitch statistics widget

### Terraria

- Poorly optimized, runs much worse on bigger maps on 9th-gen i9 CPU compared to desktop i5 3rd gen CPU
