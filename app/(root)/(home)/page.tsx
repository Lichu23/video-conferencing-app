import MeetingTypeList from "@/components/MeetingTypeList";


const Home = () => {
  const now = new Date();

  const time = now.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "full",
  }).format(now);

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-2xl bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[270px] text-center text-base font-normal">
            Upcoming Meeting at: 11:41 AM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="font-extrabold text-3xl lg:text-4xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-xl">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList/>
    </section>
  );
};

export default Home;
