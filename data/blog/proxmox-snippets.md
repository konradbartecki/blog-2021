---
title: Proxmox snippets
date: '2021-03-05'
tags: ['proxmox', 'virtualization']
draft: false
summary: Collection of useful snippets for Proxmox hypervisor
---

## Convert ZFS to VHDX

```
qemu-img convert -f raw /dev/zvol/rpool/data/vm-100-disk-1 -O vhdx -o subformat=dynamic /file.vhdx
```

## VMA Extract

VMA is a backup format for Proxmox VMs, it has this one small disadvantage where you basically need a working Proxmox OS to extract it, however I had some success while using this docker image below:

```
https://github.com/ganehag/pve-vma-docker/blob/master/Dockerfile
docker build -t foo . && docker run -v /home/konrad:/backup -it foo
```
