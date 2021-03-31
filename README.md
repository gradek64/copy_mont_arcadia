# full-monty

[![Greenkeeper badge](https://badges.greenkeeper.io/ag-digital/full-monty.svg?token=d6d05a7f8b764aae7e0625271cc2f40697edaf45ea09baa1386d5f9730cd6259&ts=1511537060877)](https://greenkeeper.io/)
[![NSP Status](https://nodesecurity.io/orgs/arcadia-group/projects/4e046823-87ab-48c1-8994-21d44c5c5de8/badge)](https://nodesecurity.io/orgs/arcadia-group/projects/4e046823-87ab-48c1-8994-21d44c5c5de8)

This is the new e-commerce project.

## Building Project

### Localdev with Docker

can read about it here [docker/localdev/README.md](docker/localdev/README.md)

### For MacOS/OSX (Manual)

1. Install homebrew - the package manager for MacOS -

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

2. Install Git/NVM/Redis using Brew

`brew install git nvm redis`

> You may need to do additional work to set up each of the above. Use "brew info XXXX" (e.g. brew info nvm) to do additional set up.

3. Re-open terminal to reinitialise terminal with NVM.

4. Install the correct version of node (v12.14.1) and npm (v6.13.4)

`nvm use && nvm alias default 12.14.1`

5. Clone the full monty codebase (Ensure you have your GITHub account set up with the SSH Key of your computer)

`git clone git@github.com:ag-digital/full-monty.git`

6. `cd full-monty`

7. Start Redis.

`redis-server . &`

8. Log into NPM to access private NPM repositories

`npm login`

9. Set up feature flags

`npm run features:fetch`

10. `npm install` - install our node modules

11. Place .env file (from another developer) in base directory

12. `npm run dev` - builds and starts the application in dev mode

13. In your browser, go to: http://localhost:8080

### Building the docker image when using OSX or Windows

#### Baseline requirements for all platforms
* Docker >= 1.10
* Docker-compose >= 1.6 (https://docs.docker.com/compose/install/)

 1. Download and run the [Docker Toolbox binary installer](https://www.docker.com/docker-toolbox) as provided by Docker.

 For Windows users the installer file will be, `DockerToolbox-x.x.xx.exe`, and for OS X users the installer file will be, `DockerToolbox-x.x.xx.pkg`.

 The Docker Toolbox installer is a multipart installer that bundles together several dependencies, including; Docker Client, Docker Machine, Docker Compose, Docker Kitematic, and VirtualBox.

 *NOTE: For OS X it is best to use the Docker standalone installer and avoid the Homebrew installation method - let Docker install and upgrade its own dependencies.*

 2. Open a terminal window and run the following command:

 ```sh
 $ git clone git@github.com:ag-digital/full-monty.git
 ```

 This will `clone` the **Full Monty** repository from GitHub onto your local system.

 *NOTE: Once the command has completed the repository will be found at, `./full-monty`.*

 3. From the open terminal window change directory into the newly cloned repo. Use the following command to do so:

 ```sh
 $ cd ./full-monty
 ```
 4. Build the Docker machine that will host the project's container.

 ```sh
 $ docker-machine create --driver virtualbox default
 ```

 This instruction to the `docker-machine` binary will create a new virtual machine called **default**. The new virtual machine will be the host to the project's docker container. This host VM is provided  using [Oracle VM VirtualBox](https://www.virtualbox.org/), an open source project.

 5. From the open terminal window update the shell environment to make it aware of the new Docker instance.

 ```sh
 $ eval "$(docker-machine env default)"
 ```

 This step is a convenience action. It will make working with Docker easier as the current shell session will now be aware of the host for the container. This command sets the environment variables that dictate docker such that all run commands are against a particular virtual machine.

 *NOTE: It might be helpful to add `eval "$(docker-machine env default)"` to your `.bash_profile` or `.zshrc` file such that it is run each time a new terminal window is opened.*

 6. Point your hosts file to the docker machine (when using OSX or Windows)

 Edit your etc/hosts file to map docker-machine ip default to localhost. This maps the docker-machines ip to your machines localhost so that the client can be viewed in your browser

 7. Run the feature fetching script. This will clone the feature flag repo into ./packages/monty-feature-flags. For further info, review the (repo)[https://github.com/ag-digital/monty-feature-flags]
 ```sh
 ./scripts/features_fetch.sh
 ```
 8. Insert the below at the bottom of the /etc/hosts

```
127.0.0.1 local.m.topshop.com
127.0.0.1 local.m.de.topshop.com
127.0.0.1 local.m.us.topshop.com
127.0.0.1 local.m.topman.com
127.0.0.1 local.m.wallis.co.uk
127.0.0.1 local.m.wallismode.de
127.0.0.1 local.m.wallisfashion.com
127.0.0.1 local.m.dorothyperkins.com
127.0.0.1 local.m.evans.co.uk
127.0.0.1 local.m.missselfridge.com
127.0.0.1 local.m.euro.missselfridge.com
127.0.0.1 local.m.burton.co.uk
127.0.0.1 local.m.eu.burton-menswear.com
127.0.0.1 local.m.fr.topshop.com
127.0.0.1 local.m.fr.topman.com
127.0.0.1 local.m.eu.topshop.com
127.0.0.1 local.m.eu.topman.com
127.0.0.1 local.m.evansmode.de
127.0.0.1 local.m.euro.dorothyperkins.com
```

 9. Build it.
 Ask a colleague for the credentials files for the application and place them in the root of your application with names ".env", ".env-test-runner" and ".env-monitor". Then:

 ```sh
 docker-compose up -d monty
 ```

 10. Run it

 ```sh
 docker run -i fullmonty_monty
 ````

### Building the project when using a linux distribution
1. Clone this repo
2. Ask a colleague for the credentials file and place it inside the project root dir with the name ".env". Then run: ```sh docker-compose up -d monty```

### install & Run Cypress

## Getting started
- install cypress 3.3.1 globally `npm install -g cypress@3.3.1`
- after install make sure you are at the root of the full-monty project and run `npm install` 
  - you can find all the functional cypress test in test/functional/
  
## Run Cypress via CLI
- from the root of the monty folder run `npm run functional:cli`
  - this command will run it all for you and will start cypress with the mock server 
- simply follow and choose the options that you require.
  - this command will run it all for you and will start cypress with the mock server
  - DEV or BUILD
    - Dev => this will run a dev build of Monty
    - Build => This will run a prod build of Monty
  - Desktop VS Mobile
    - Desktop => run Cypress suite on a desktop viewport
    - Mobile => run Cypress suite on a mobile viewport
  - Open Vs Run
    - Open => see the cypress browser open, with the dialogue to choose test to run
    - Run => run headless cypress browser
  - Rerun failures
    - No => will not retry to run failing test
    - Yes => will try to rerun a failing test 3 times before, failing the test

## Run Cypress manually
1. Build monty assets (.js, .css etc) =>  `npm run build`
2. to run test   `npm run functional` or `npm run functional:mobile`
3. to run all the suite of test locally, run  `LOW_MEMORY=true npm run functional`  or `LOW_MEMORY=true npm run functional:mobile`
  - `LOW_MEMORY=true ` prevents Cypress from running out of memory 
  -  those scripts are setting for you CORE_API_PORT, disabled QUBIT, set the environment for  functional testing
     and start cypress  
  -  for more information about cypress check the readme in test/functional
  
### Running the tests
Make sure the values in your .env file are NOT wrapped in quotes. Then:
```sh
docker-compose run monty_tests
```

If wanting to debug inside the running container: ```docker-compose run monty_tests /bin/bash``` and then run the tests: ```docker/run_tests.sh```
To cleanup, rebuild and run tests: ```docker-compose down && docker-compose build && docker-compose run monty_tests```

### Other things to keep in mind

If you need to get inside the container for debugging purposes:
```sh
docker-compose run --service-ports monty /bin/sh
```

To restart the container(s) (does not rebuild):
```sh
docker-compose restart monty
```

In order to (re)build the image(s):
```sh
docker-compose build monty
```

In order to clean up and start from scratch:
```sh
docker-compose down && docker-compose build monty && docker-compose up -d monty
```

## Client-side debugging

Access the website using the query parameter `montydebug=true`. A circular icon will appear next to the shopping bag icon on the top right of the header. Clicking this will expose a menu that will offer different debugging features.

`http://local.m.topman.com:8080/?montydebug=true`

## Server-side debugging

Run the applicationw with the DEBUG environment variable:

`export DEBUG=monty:*`

## Deploying and destroying

Requirements:
* aws cli installed and configured with credentials that allow elasticbeanstalk, s3 and route53 access
* docker installed and credentials that can push to the dockerhub image repository as environment variables $DOCKER_HUB_USERNAME and $DOCKER_HUB_PASSWORD
* curl
* openssh
* jq for replacing the dynamodb seed table data with the host machine's environment variables

Run ```scripts/deploy.sh <commit hash> <name of elastic beanstalk environment to create/update>```. The script will inform you of what required environment variables you might need to define.

In order to destroy the elastic beanstalk environment: ```scripts/destroy.sh <name of elastic beanstalk environment to destroy>```

## Host URLs

[https://arcadiagroup.atlassian.net/wiki/display/SE/Mobile+Environment+URLs](https://arcadiagroup.atlassian.net/wiki/display/SE/Mobile+Environment+URLs)

