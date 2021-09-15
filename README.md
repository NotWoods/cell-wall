![](images/logo.png)

# CellWall

A multi-device display for showing interactive data, such as photos, weather
information, calendar appointments, and more.

CellWall is my project to repurpose a batch of old hand-me-down cell phones into
a useful display in my apartment. It uses ADB to let each phone connect
to a server and receive data about what to show.

![](images/finished.jpg)

## Putting the hardware together

The hardware boils down to a bunch of cell phones stuck onto a plank of wood, with USB cables connecting them to a server. A detailed run-through is coming soon.

### Parts list

#### Wood plank (the "Wall")

- [Plywood handy panel](https://www.homedepot.ca/product/alexandria-moulding-1-4-inch-x-2-feet-x-2-feet-birch-plywood-handy-panel/1000434557)
- [White acrylic paint](https://amzn.to/2L5YzS7)
- [Paint brush](https://amzn.to/35eqiHk)
- [Sandpaper](https://amzn.to/2Lpnsbc)
- Tools to mount the plank onto your wall, such as:
  - [Command Strips](https://amzn.to/3pMTZa4) for an apartment
  - [Wood screws](https://amzn.to/2Lpo1lk) for a house.

#### Mounting and connecting the phones (the "Cell"s)

- Old cell phones and/or tablets running Android
- Raspberry Pi or another computer to use as the server
- [Velcro strips](https://amzn.to/3bdwEdM)
- [USB cables](https://www.monoprice.com/product?p_id=4867)
- [Wire clips](https://amzn.to/391YTJL)
- [USB hub](https://amzn.to/2JM19w0)

Note that most of these links are affiliate links for Amazon. As an Amazon Associate I earn from qualifying purchases. Using these links helps out the project!

## Using the software

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

### Prerequisites

- Node.js 14 or greater
- Android Studio 4.1 or greater
- Android Debug Bridge
- PNPM

### Installing dependencies

Install NPM dependencies for the server:

```shell
pnpm recursive install
```

Install Gradle dependencies for the client by opening the `./android` folder as
an Android Studio project and syncing Gradle.

Alternatively, from the command line:

```shell
cd ./android
gradlew build
```

### Deployment

The server communicates with phones over ADB. ADB should be installed and the phones should be in debug mode. Check that all phones appear when running `adb devices`.

Run the server by compiling the TypeScript code and launching it with node:

```shell
pnpm run build # Runs `tsc` to compile TypeScript
pnpm start
```

### Environment variables

Some paths and API keys are set via environment variables. The project uses `dotenv`, so an `.env` file will automatically be loaded by the server.

See [env.ts](javascript/server/src/env.ts) for a list of environment variables.

## Built with

- [Fastify](https://www.fastify.io/) - Web server
- [ADB](https://developer.android.com/studio/command-line/adb) - Communication from server to phones
- [Android Architecture Components](https://developer.android.com/topic/libraries/architecture/) -
  Used for MVVM architecture on client
