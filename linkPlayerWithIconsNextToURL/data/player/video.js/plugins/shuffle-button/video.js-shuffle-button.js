/* globals videojs, api */
'use strict';

{
  const Plugin = videojs.getPlugin('plugin');
  const Button = videojs.getComponent('Button');

  class ShuffleButtonPlugin extends Plugin {
    constructor(player, options) {
      super(player, options);

      player.on('ready', () => {
        if (player.controlBar.shuffleButton) {
          return;
        }

        // Subclass the component (see 'extend' doc for more info)
        const ShuffleButton = videojs.extend(Button, {
          handleClick: () => {
            player.playlist.shuffle(true);
            api.next();
          },
          buildCSSClass: () => 'vjs-control vjs-button vjs-shuffle-button'
        });
        // Register the new component
        Button.registerComponent('shuffleButton', ShuffleButton);
        // forward
        const shuffleButton = player.controlBar.shuffleButton = player.controlBar.addChild('shuffleButton');
        shuffleButton.el().title = 'Shuffle';
        player.controlBar.el().insertBefore(
          shuffleButton.el(),
          player.controlBar.stopButton.el().nextSibling
        );
      });
    }
  }
  videojs.registerPlugin('shuffleButtonPlugin', ShuffleButtonPlugin);
}
