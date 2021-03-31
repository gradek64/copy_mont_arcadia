# Configuring https for local development

Below are the steps required to allow https development of monty sites. This solution uses [Caddy](https://caddyserver.com/docs/) as a reverse proxy and certificate authority to provide TLS support and proxy requests to the local monty instance.

## prerequisites

```sh
brew install caddy
```

## setup

These commands need to be run from the `full-monty/docs/local-https` directory.

Configure Caddy:

```sh
cp config/Caddyfile /usr/local/etc/Caddyfile
```

Start Caddy to create certificates:
_This command may ask for your password_

```sh
caddy run --config /usr/local/etc/Caddyfile
```

Now quit this caddy instance (ctrl+c) and start it as a service.

```sh
brew services start caddy
```

Configure Webpack dev server

Add `WEBPACK_USE_HTTPS=true` to your `.env` file, without this change live reloading and hot module replacement will not work.

## usage

Once configured start monty with `npm run dev` and go to one of the below domains:

- [local.m.burton.co.uk](https://local.m.burton.co.uk,)
- [local.m.de.topshop.com](https://local.m.de.topshop.com,)
- [local.m.dorothyperkins.com](https://local.m.dorothyperkins.com,)
- [local.m.eu.burton-menswear.com](https://local.m.eu.burton-menswear.com,)
- [local.m.eu.topman.com](https://local.m.eu.topman.com,)
- [local.m.eu.topshop.com](https://local.m.eu.topshop.com,)
- [local.m.euro.dorothyperkins.com](https://local.m.euro.dorothyperkins.com,)
- [local.m.euro.evansfashion.com](https://local.m.euro.evansfashion.com,)
- [local.m.euro.missselfridge.com](https://local.m.euro.missselfridge.com,)
- [local.m.evans.co.uk](https://local.m.evans.co.uk,)
- [local.m.evansmode.de](https://local.m.evansmode.de,)
- [local.m.evansusa.com](https://local.m.evansusa.com,)
- [local.m.fr.topman.com](https://local.m.fr.topman.com,)
- [local.m.fr.topshop.com](https://local.m.fr.topshop.com,)
- [local.m.missselfridge.com](https://local.m.missselfridge.com,)
- [local.m.missselfridge.de](https://local.m.missselfridge.de,)
- [local.m.missselfridge.fr](https://local.m.missselfridge.fr,)
- [local.m.topman.com](https://local.m.topman.com,)
- [local.m.topshop.com](https://local.m.topshop.com,)
- [local.m.us.missselfridge.com](https://local.m.us.missselfridge.com,)
- [local.m.us.topshop.com](https://local.m.us.topshop.com,)
- [local.m.wallis.co.uk](https://local.m.wallis.co.uk,)
- [local.m.wallisfashion.com](https://local.m.wallisfashion.com,)
- [local.m.wallismode.de](https://local.m.wallismode.de)

## testing

Check caddy is running as a service with `brew services list`, you should see:

```sh
Name       Status  User  Plist
caddy      started <uid> /Users/<uid>/Library/LaunchAgents/homebrew.mxcl.caddy.plist
```

You can see the configuration by running:

```sh
curl http://localhost:2019/config/ | jq
```

You should see a json object containing the below hosts:

```json
  "host": [
    "localhost",
    "local.m.burton.co.uk",
    "local.m.de.topshop.com",
    "local.m.dorothyperkins.com",
    "local.m.eu.burton-menswear.com",
    "local.m.eu.topman.com",
    "local.m.eu.topshop.com",
    "local.m.euro.dorothyperkins.com",
    "local.m.euro.evansfashion.com",
    "local.m.euro.missselfridge.com",
    "local.m.evans.co.uk",
    "local.m.evansmode.de",
    "local.m.evansusa.com",
    "local.m.fr.topman.com",
    "local.m.fr.topshop.com",
    "local.m.missselfridge.com",
    "local.m.missselfridge.de",
    "local.m.missselfridge.fr",
    "local.m.topman.com",
    "local.m.topshop.com",
    "local.m.us.missselfridge.com",
    "local.m.us.topshop.com",
    "local.m.wallis.co.uk",
    "local.m.wallisfashion.com",
    "local.m.wallismode.de"
  ]
```

## Issues

Caddy throws a bunch of TLS errors for various domains, like gtm and tealeaf, some of these just need to be added to the caddy config but others need to be investigated.
