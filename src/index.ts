import Webex from "webex";
import Transcription from "@wxsd/webex-transcription";
import Window from "window";

const token = "<YOUR_TOKEN>";

export default interface CustomNodeJsGlobal extends NodeJS.Global {
  window: any
}

declare const global: CustomNodeJsGlobal;

class RTC {
  constructor() {}
}

class mockWindow {
  window: any;

  constructor() {
    this.window = new Window();
    this.window.RTCPeerConnection = RTC;
  }
}

const { window } = new mockWindow();

global.window = window;

const webex = new Webex(token);

(async () => {

  try {
    await webex.meetings.register();
    await webex.meetings.syncMeetings();

    // all the active meetings that a user if part of
    const meetings = webex.meetings.meetingCollection.meetings;

    // targeted meeting object
    // const meeting = meetings["meetingID"];

    // first meeting object
    const meeting = Object.values(meetings)[0];

    const transcription = new Transcription(token, meeting, webex.sessionID);

    await transcription.connect();

    transcription.getTranscription((trs) => {
      console.log(trs);
    });
  } catch (error) {
    console.log(error);
  }
  
})();