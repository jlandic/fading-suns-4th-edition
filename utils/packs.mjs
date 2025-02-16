import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import fs from "fs/promises";
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import logger from "fancy-log";

const PACK_OUTPUT = "packs";
const PACK_INPUT = "source";

const packageCommand = () => {
  return {
    command: "package [action] [pack] [entry]",
    describe: "Manage packs",
    builder: (yargs) => {
      yargs.positional("action", {
        describe: "Action to perform",
        type: "string",
        choices: ["unpack", "pack", "clean"],
      });

      yargs.positional("pack", {
        describe: "Pack to process",
        type: "string",
      });

      yargs.positional("entry", {
        describe:
          "Name of the pack entry to process. Only for extract & clean actions",
        type: "string",
      });
    },
    handler: async (argv) => {
      const { action, pack } = argv;

      switch (action) {
        case "pack":
          return await compile(pack);
        case "unpack":
          return;
        // return await unpack(pack, entry);
        case "clean":
          return;
        // return await cleanPacks(pack, entry);
      }
    },
  };
};

const compile = async (packName) => {
  const folders = await fs.readdir(PACK_INPUT, { withFileTypes: true });

  const packs = folders.filter(
    (file) => file.isDirectory() && (!packName || file.name === packName)
  );

  for (const folder of packs) {
    const src = path.join(PACK_INPUT, folder.name);
    const dest = path.join(PACK_OUTPUT, folder.name);
    logger.info(`Packing ${src} to ${dest}`);

    await compilePack(src, dest, {
      recursive: true,
      log: true,
      yaml: true,
      options: {
        transformEntry: (entry) => {},
      },
    });
  }
};

// const unpack = async (pack, entry) => {};
// const cleanPacks = async (pack, entry) => {};

// eslint-disable-next-line
const argv = yargs(hideBin(process.argv))
  .command(packageCommand())
  .help()
  .alias("help", "h").argv;
