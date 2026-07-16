import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'frur52ku',
    dataset: 'production'
  },
  deployment: {
    // Hosted Studio application id from sanity deploy
    appId: 'bpm6fv7aewgr0llrwi1cfqhw',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
