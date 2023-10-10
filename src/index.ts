/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
  console.log('Scripting API ready');
  console.log('Player tags: ', WA.player.tags)

  // Show configuration tile for editors only
  if (WA.player.tags.includes('editor')) {
    WA.room.showLayer('exitNorthConfig')
    WA.room.showLayer('exitSouthConfig')
    WA.room.showLayer('exitWestConfig')
    WA.room.showLayer('exitEastConfig')
  }

  // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
  bootstrapExtra().then(() => {
    console.log('Scripting API Extra ready');
  }).catch(e => console.error(e));
}).catch(e => console.error(e));

let currentZone: string;
let currentPopup: any;

const config = [
  {
    zone: 'needHelp',
    message: 'Do you need some guidance? Here is the Hispagatos Wiki',
    cta: [
      {
        label: 'Documentation',
        className: 'primary',
        callback: () => WA.openTab('https://man.sr.ht/~rek2/Hispagatos-wiki/'),
      }
    ]
  },
  {
    zone: 'followUs',
    message: 'Hey! Have you already started following us?',
    cta: [
      {
        label: 'Https',
        className: 'primary',
        callback: () => WA.openTab('https://hispagatos.org'),
      },
      {
        label: 'Gemini',
        className: 'primary',
        callback: () => WA.openTab('gemini://hispagatos.org'),
      }
    ]
  },
]


WA.onEnterZone('needHelp', () => {
  currentZone = 'needHelp'
  openPopup(currentZone, currentZone + 'Popup')
});
WA.onEnterZone('followUs', () => {
  currentZone = 'followUs'
  openPopup(currentZone, currentZone + 'Popup')
});
WA.onLeaveZone('needHelp', closePopup);
WA.onLeaveZone('followUs', closePopup);


function openPopup(zoneName: string, popupName: string) {
  const zone = config.find((item) => {
    return item.zone == zoneName
  });
  if (typeof zone !== 'undefined') {
    // @ts-ignore otherwise we can't use zone.cta object
    currentPopup = WA.openPopup(popupName, zone.message, zone.cta)
  }
}
function closePopup() {
  if (typeof currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}
