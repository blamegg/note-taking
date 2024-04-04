"use client";

import { CustomLayout, HomeCard } from "@/components";
import "drophp/lib/styles/theme.css";

const Home = () => {
  return (
    <CustomLayout>
      <section className="mt-5">
        <h5 className="text-5xl font-extrabold text-center">Home Page</h5>
        <section className="w-4/5 mx-auto mt-5">
          <h5 className="text-2xl text-center font-bold uppercase">
            Why makes notes?
          </h5>
          <div className="space-y-5 mt-5 mb-5">
            <HomeCard />
          </div>
        </section>
      </section>
    </CustomLayout>
  );
};

export default Home;
