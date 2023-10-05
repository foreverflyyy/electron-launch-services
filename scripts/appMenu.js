const { shell, dialog } = require('electron');
const newShotDialog = {
    type: 'info',
    title: 'Hello',
    message: 'Do you like this?',
    buttons: ['Yes', 'No']
};

module.exports = function appMenu() {
  return (
    [
      {
        label: 'File',
        submenu: [
          {
            label: 'Click me',
            click() {
                dialog.showMessageBox(newShotDialog, function(index) {})
            },
          },
        ],
      },
    ]
  );
};