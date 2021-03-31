# Local Development with containers

### First run

Assuming you have local docker installed, do the following on your first run

- in the root of the _full-monty_ checkout, create/update the _.env_ file. Please make sure you have your `NPM_TOKEN` defined inside. You can use _dot_env.dist_ file as a template.
- update your _hosts_ file to have dns records for things like local.m.topshop.com etc.
- If you have a local HTTP server or monty running on ports 3000 and 80/443, make sure to stop them.
- cd into appropriate directory where this file is (eg. `cd docker/localdev`)
- run `make docker_build` will make docker pull relevant images and do initial monty image build. might take a bit of time due to network speed
- `make install` will install relevant node modules **inside** the container. i.e. your local filesystem _node_modules_ wont be created/updated (there are details on how to do so with `install_local` command).
- `make build` or `make build_prod` will run the npm build commands for dev or prod environment. if you just testing, `build_prod` is a faster option with less debugging etc.
- double check that you have _.env_ file defined in the root of the checkout.
- `make start` should start monty and relevant containers.

You could optionally run `make install_local`, which would update/create your local _node_modules_. This might take some extra time, since this is essentially happening over a network drive. Ideally you would want to delete your _node_modules_ prior to that, to avoid disappointment. This is useful for your local IDE to pickup on the libraries. _NOTE:_ this will be run against linux, so there is a chance that if you attempt to run some npm commands locally and not through container, things might not go too well.

To test - access http://local.m.topshop.com/ to see that things are loading/working. Keep in mind that it might take over a minute for the monty app to start. You can bash http://local.m.topshop.com/health to make sure that it works (the page should say _Ok_).

### Usage

Feel free to run this with your custom docker/docker-compose commands, but there is a Makefile included with some handy shortcuts.

In general, running `make start` should get you going after a reboot. If you are rebuilding assets/content locally (webpack or whatnot) the content should be updated in the container, since its mapping that stuff inside the container. Pretty much everything except _node_modules_ is on mapped volume.

If you are not a fan of watching the _stdout/stderr_ in your console, or prefer using some other tool to monitor your container output, you can use `make start_d` to start things up in detached mode.

The monty container comes with [nodemon](http://nodemon.io) to handle your node server changes, so running `make start_nodemon` will start monty with monitoring delay of 10 seconds and watching _src_ folder. You can always run that with tailored settings you prefer. 

Running `make install` should be pretty snappy after the initial run, since the volume persists between container reboots/rebuilds

`make debug` should help you with node debugging on standard ports. have a look at _Makefile_ to see what they are.

Assuming your containers are running, `make shell` will attach your terminal to the container allowing you to run whatever custom commands you want.

Alongside the monty, we are spinnig up traefik and redis. Redis is needed for caching in monty. Traefik is essentially a load balancer, which allows https use as well as run multiple things on port 80. This also gives us an easy way to introduced https to localdev (sure, they are self signed but hey). You can access it at http://traefik.localhost

So keep in mind that http://local.m.topshop.com goes through that. If you specify the port http://local.m.topshop.com:3000/ that would hit the container directly.

### Testing

#### Lint and unit tests

There is a `make run_lint` and `make run_unit_test` commands available for running it inside the container against your local files.

NOTE: Make sure you run `make install` prior to running those, since it needs all those npm modules.

#### CoreAPI integration tests

TBC

#### E2E

TBC

#### Functional tests with cypress

TBC

### Troubleshooting

- Things don't start - `make stop`, `make down`, restart docker, do `make install` and `make build` again. Make sure you don't have local monty or http server running on ports 80/443 and 3000 already.

- More dns records needed - make sure your hosts file is updated. accessing the url with port 3000 should work. If you want a nice url without :3000 part - need to update _docker-compose.yml_ to make sure that monty container has relevant things in its labels for traefik. But by default it would match all URLs starting with _local.m._
