

## RESPECT Server (local testing)

To test SPIX inside the RESPECT APK launcher, you need to run the local RESPECT server.

**Prerequisites:** JDK 21 and the repo cloned at `~/Respect`.

```sh
~/Respect/start-server.sh
```

The script will:
1. Kill any stale process already on port 8098
2. Print your current LAN IP (e.g. `http://192.168.x.x:8098/`)
3. Start the Ktor server

**Connect from the RESPECT Android APK:**
- Server URL: `http://<YOUR_LAN_IP>:8098/`
- Login: `admin` / `Flow2026!`
- SPIX manifest: `https://spix.flowonline.app/respect-manifest.json`

---

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
