"use client";

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";

const MeetingTypeList = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  const [meetingValues, setMeetingValues] = useState({
    dateTime: new Date(),
    description: "",
    meetingLink: "",
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!meetingValues.dateTime) {
        toast({
          title: "Please select a date and time",
          variant: "destructive",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create meeting");

      const startsAt =
        meetingValues.dateTime.toISOString() ||
        new Date(Date.now()).toISOString();
      const description = meetingValues.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!meetingValues.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting Created",
        variant: "default",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
        variant: "destructive",
      });
    }
  };

  const  meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Start an instant meeting"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="New Meeting"
        description="via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          className="text-center"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="font-semibold">Add a description</label>
            <Textarea
              autoFocus
              className="focus-visible:ring-0 focus-visible:ring-offset-0  bg-[#252A41] border-none"
              onChange={(e) => {
                setMeetingValues({
                  ...meetingValues,
                  description: e.target.value,
                });
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="font-semibold">Select Date & Time</label>
            <div>
              <ReactDatePicker
                selected={meetingValues.dateTime}
                onChange={(date) =>
                  setMeetingValues({ ...meetingValues, dateTime: date! })
                }
                showTimeSelect
                className="bg-[#252A41] w-full rounded p-2 focus:outline-none"
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="d, MMM, yyyy h:mm aa"
              />
            </div>
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({title: "Link copied"})
          }}
          image="/icons/checked.svg"
          buttonIcon="icons/copy.svg"
          buttonText="Copy invitation"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
