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
          maintainer: 'Your Name',
          homepage: 'https://example.com',
          description: 'Your application description goes here.',
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
          maintainer: 'Your Name',
          homepage: 'https://example.com',
          description: 'Your application description goes here.',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'Your Name',
          homepage: 'https://example.com',
          description: 'Your application description goes here.',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {
        options: {
          maintainer: 'Your Name',
          homepage: 'https://example.com',
          description: 'Your application description goes here.',
        },
      },
    },
  ],
};
