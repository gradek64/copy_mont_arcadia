# Dev System Setup

<!-- TOC depthFrom:2 depthTo:3 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Introduction](#introduction)
- [Setup Steps](#setup-steps)
	- [Apple ID](#apple-id)
	- [Xcode](#xcode)
	- [iTerm2 (Optional)](#iterm2-optional)
	- [Spectacle (Optional)](#spectacle-optional)
	- [Homebrew](#homebrew)
	- [AWS CLI (Optional)](#aws-cli-optional)
	- [Git Version Control](#git-version-control)
	- [Node Version Manager](#node-version-manager)
	- [Docker for Mac (Optional)](#docker-for-mac-optional)

<!-- /TOC -->

## Introduction

The purpose of this document is to help a new starter get their new OS X laptop ready for coding. If you are running a Windows machine you will need to look elsewhere for help.

## Setup Steps

Follow the below instructions in order. Some steps can be skipped. However, those steps will say as much. The order of these steps is important as subsequent steps will make assumptions about preceding steps.

### Apple ID

Create an **Apple ID** if you don't have one already.

> **NOTE** – It can be helpful to associate your personal Apple ID on your work MacBook Pro. If you are happy to do so then please proceed to the next step.

To create a new Apple ID to go the Apple website, [appleid.apple.com](https://appleid.apple.com/account#!&page=create).

> **WARNING** – If you have just started at Arcadia it is possible that you do not yet have access to your email account. If this is the case, and you wish to create an Apple ID using your work email, you will not be able to proceed with these instructions until you can activate your Apple ID – activation of an Apple ID will require access to the email account to which the Apple ID belongs.

#### Q. Why do I need an Apple ID?

  * Without an Apple ID you will not be able to install apps distributed through the App Store. In itself this might seem trivial. However, in a later step you will be asked to install Xcode and this should be done through the App Store.

### Xcode

Open the App Store app on your mac. The App Store should be located in the dock tray along the bottom of your screen (assuming your UI is set to the default arrangement).

Ensure you are signed into the App Store. You can confirm as much by clicking, from the navigation menu, `Store -> View My Account (<apple-id-email>)`.

Search for **Xcode** in the search box. The search box should be located to the top right of the UI for the App Store. Click the `Get` button beneath the Xcode app icon which should be the first item in the list of apps returned from the keyword search.

> **NOTE** – Xcode is a large app. It will take some time to download and install. Perhaps ask someone near to you where the kettle is and help yourself to a cup of tea.

After Xcode has completed its download and installation open Xcode at least once. You should be presented with a License Agreement which must be first accepted.

#### Q. Why do I need Xcode?

 * In a later step you will be asked to install Homebrew. Some of the exciting packages that Homebrew will enable you to install onto your computer will require the native [C compiler](https://en.wikipedia.org/wiki/List_of_compilers) to complete their installation.

#### Q. Shouldn't the _Command Line Tools_ suffice?

 * No.

### iTerm2 (Optional)

Navigate to the downloads page of the iTerm2 website, [iterm2.com/downloads](https://www.iterm2.com/downloads.html), and download the latest stable release of the app for OS X. At the time of writing the latest version was, `iTerm2 v3.0.10`.

#### Q. iTerm2 version 3, wtf?

 * I agree, this is terribly confusing. However, version 3 is the latest version of iTerm2. I have no idea why it is not **iTerm3**.

Once the download has completed follow the standard OS X app installation process to add the new binary to your `/Applications` folder.

#### Q. How do I perform the standard OS X app installation process?

 * If this is really something you don't know, then ask the developer sitting next to you (or Google it). It's just too long-winded to explain.

After you have installed iTerm2 to your local machine (i.e. added the app to the `/Applications` folder), open it.

Open the preferences for iTerm2 from the navigation menu, `iTerm2 -> Preferences...` (or, if you're a heavyweight dev, use the hotkey `cmd + /`).

#### Q. Why do I need iTerm2?

 * It's much more customisable than **Terminal** app that is distributed with OS X.

### Spectacle (Optional)

Navigate to the the Spectacle website, [spectacleapp.com](https://www.spectacleapp.com) and click the large DOWNLOAD SPECTACLE button, front and centre.

Once the download has completed follow the standard OS X app installation process to add the new binary to your `/Applications` folder.

After Spectacle has been

https://www.spectacleapp.com

#### Q. Why do I need Spectacle?

 * As a modern day web developer being competent is, in part, measured by expedience. Spectacle is an extremely powerful app window layout manager that makes it easy to view all windows you're working with at once. It's all about making your work faster, as a well as smarter!

### Homebrew

Open iTerm2 (or whichever is your preferred terminal app).

Open your favourite browser and navigate to the Homebrew website, [brew.sh](http://brew.sh).

Notice, front and centre of the homepage are the words, INSTALL HOMEBREW. Copy the shell command that appears beneath these words and paste it into the terminal, and press enter.

Follow the on-screen instructions to complete the installation.

Once the installation has complete it would be beneficial to complete at least one `brew` command to ensure your system is Homebrew ready. From the open terminal run, `brew doctor`. This will perform a series of diagnostic checks on your platform and identify any erroneous configuration you might have, as well as instructions on how to go about fixing these configuration issues. Should Homebrew report any WARNING message, please complete the actions listed to correct your system's configuration.

#### Q. Why do I need Homebrew?

 * The tag-line of the Homebrew website says, _The missing package manager for macOS_. This is a true statement.

### AWS CLI (Optional)

### Git Version Control

We use `git` as our version control software.

Open your terminal and run the command,

```bash
$ brew install git
```

Once this has completed the latest version of the `git` binary will be available on your system.

> **NOTE** – After `git` has been installed it is _extremely_ important to complete the minimum configuration steps, otherwise referred to as the First-Time Git Setup on the documentation website, [git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup).

Run the below command in the shell to set your name;

```bash
$ git config --global user.name "<first> <last>"
```

Run the following command in the shell to set your email;

```bash
$ git config --global user.email <first>.<last>@arcadiagroup.co.uk
```

> **NOTE** - These are the minimum steps required to install and configure `git` to the latest version. However, for extra credit, consider giving your setup a proper PRO upgrade by completing the [these steps](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account) on the GitHub website on setting up SSH based authentication.

#### Q. Why do I need `git`?

 * It's the version control software used on the Monty project.

#### Q. Why do I need to set my Name and Email?

 * Whenever you commit code using the `git` binary your commit will be signed using these two values. This way, when the complete commit history of the repository is being explored, it will be clear which developer is responsible for which code change.

#### Q. Where are the configuration options stored?

 * Whenever you set global configuration options for `git` the `~/.gitconfig` file is updated.

### Node Version Manager

Open your terminal and run following command;

```bash
$ brew install nvm
```

Once this has completed the latest version of the `nvm` will be available.

> **NOTE** – After `nvm` has been installed it is _extremely_ important to complete the minimum configuration steps. These steps will be listed in the CAVEATS section of the log messages written to the screen by Homebrew during installation.

Open your terminal and run following command;

```bash
$ mkdir ~/.nvm
```

Before `nvm` will work it is important to run the initialisation script. Add the following two lines to the `~/.bash_profile` file;

```bash
export NVM_DIR="$HOME/.nvm"
source "/usr/local/opt/nvm/nvm.sh"
```

> **NOTE** – Whenever the `~/.bash_profile` file has been edited you will need to restart the shell to apply the new changes.

Finally, complete the first-time setup of `nvm` by installing the latest version of `node` and `npm` by running the following in the terminal;

```bash
$ nvm install node
```

Congratulations, `node` and `npm` are now installed!

#### Q. Why do I need `nvm`?

 * It is a powerful way to manage multiple versions of Node.js on a single machine.

#### Q. Why do I need the `~/.nvm` folder?

 * This is the location where the `nvm` script will install all `node` and `npm` versions. Additionally, whenever you install a package globally, this is where `nvm` will have those packages saved it.

#### Q. Why do I need to add those lines to my `~/.bash_profile` file?

 * The `/usr/local/opt/nvm/nvm.sh` _is_ the `nvm` script – when the `nvm.sh` script has been parsed by the shell the `nvm` command will become available at the command line.
 * By setting the environment variable of `${NVM_DIR}` the `nvm` script will know where to store all files required when a version of `node` and `npm` is added to the user's system.

### Docker for Mac (Optional)

Navigate to the downloads page of the Docker website, [docker.com/products/docker](https://www.docker.com/products/docker), and download **Docker for Mac**.

Once the download has completed follow the standard OS X app installation process to add the new binary to your `/Applications` folder.

#### Q. Why do I need Docker for Mac?

 * All deployments of the Monty project for production are completed by creating a new Docker container which includes the source code at the commit intended for production. Working from a container when doing local development will give you the greatest likeness between your dev work and production.

#### Q. But what workflow using Docker could I follow?

  * Take a look at [this demo](https://youtu.be/vE1iDPx6-Ok?t=34m41s) from the Day 1 Keynote at Docker, 2016. It clearly shows a slick way to work as a developer when the code is run from a container using Docker for Mac.
