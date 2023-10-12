module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        options: {
          maintainer: 'Launching services',
          homepage: 'https://example.com',
          description: 'App for launch services.',
        },
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Launching services',
          homepage: 'https://example.com',
          description: 'App for launch services.',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'Launching services',
          homepage: 'https://example.com',
          description: 'App for launch services.',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {
        options: {
          maintainer: 'Launching services',
          homepage: 'https://example.com',
          description: 'App for launch services.',
        },
      },
    },
  ],
};
