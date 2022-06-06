import path from "path";
import {
  PlaywrightTestConfig,
  PlaywrightWorkerOptions,
} from "@playwright/test";
import { TestArgs } from "./index.lib";
import indexConfig from "../../index.config";

const projects: Array<
  Pick<PlaywrightWorkerOptions, "browserName"> & Omit<TestArgs, "openloginURL">
> = [
  {
    browserName: "chromium",
    user: { email: `testuser${process.env.TEST_RUN_ID}@openlogin.com` },
  },
  {
    browserName: "firefox",
    user: { email: `testuser${process.env.TEST_RUN_ID}@openlogin.com` },
  },
  {
    browserName: "webkit",
    user: { email: `testuser${process.env.TEST_RUN_ID}@openlogin.com` },
  },
];

const config: PlaywrightTestConfig = {
  ...indexConfig,
  testDir: __dirname,
  projects: projects.map(({ browserName, user }) => ({
    name: browserName,
    use: {
      browserName,
      storageState: path.resolve(__dirname, `${browserName}.json`),
      user,
    },
  })),
};

export default config;
