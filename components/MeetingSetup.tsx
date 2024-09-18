"use client";
import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface MeetingSetupProp {
  setIsSetupComplete: (value: boolean) => void
}

const MeetingSetup = ({setIsSetupComplete} : MeetingSetupProp) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false); //if mic and audio is activate
  const call = useCall();


  if (!call) {
    throw new Error("usecall must be used within StreamCall component");
  }

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  return (
    <div className="flex-center h-screen w-full flex-col gap-3 text-white">
      <h1 className="text-4xl font-bold">Setup</h1>
      <div className="font-semibold text-2xl"><VideoPreview /></div>
      <div className="flex flex-center">
        <label className="flex gap-2  text-lg">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>

      <Button onClick={() => {
        call.join()
        setIsSetupComplete(true)
      }} className="rounded-md bg-green-500 font-bold text-base">
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
