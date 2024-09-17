import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full font-bold ">
      <Image
        src="/icons/loading-circle.svg"
        alt="Loading image"
        width={50}
        height={50}
      />
    </div>
  );
};

export default Loader;
