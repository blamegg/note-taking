import { HomePageCard } from "@/constant";
import Image from "next/image";

export const HomeCard = () => {
  return (
    <>
      {HomePageCard.map((home, index) => {
        return (
          <div key={index} className="grid grid-cols-2 gap-5">
            <div className="grid place-items-center">
              <div className="w-full h-60 px-10">
                <Image
                  src={home.img?.src}
                  alt=""
                  className="h-full w-full object-cover rounded-xl"
                  loading="lazy"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div>
              <h5 className="text-2xl uppercase font-bold">{home.heading}</h5>
              <p className="text-sm text-pretty">{home.content}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};
