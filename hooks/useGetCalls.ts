import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const client = useStreamVideoClient(); //captamos las llamadas
  const { user } = useUser();

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;

      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [
            {
              field: "starts_at",
              direction: -1,
            },
          ],
          filter_conditions: {
            //filter if this conditions exists
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id }, //si somos  los creadores de la llamada
              { members: { $in: [user.id] } }, //si somos parte de la llamada
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id]);

  const now = new Date()


  const endedCalls = calls.filter(({state: {startsAt, endedAt}} : Call ) => {
    return (startsAt && new Date(startsAt) < now || !!endedAt)
  }) //Check if when the call started is less than now or if the call has already ended
  
  const upcomingCalls = calls.filter(({state : {
    startsAt
  }} : Call) => {
    return startsAt && new Date(startsAt) > now
})

  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading
}
};


