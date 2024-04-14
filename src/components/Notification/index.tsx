import { useContext, useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import "react-modern-drawer/dist/index.css";
import { userContext } from "@/authContext/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export const Notification = () => {
  const [notification, setNotification] = useState<[] | string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [initialDisplayCount, setInitialDisplayCount] = useState<number>(5);
  const { session } = useContext(userContext);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const getNotificationDB = async () => {
    let notifications: string[] = [];
    const querySnapshot = await getDocs(
      collection(db, `notify_${session.userInfo.uid}`)
    );
    querySnapshot.forEach((doc) => {
      notifications.push(doc.data().notificationTitle);
    });
    setNotification(notifications.reverse());
  };

  useEffect(() => {
    getNotificationDB();
  }, []);

  const handleSeeMore = () => {
    setShowAll(true);
  };

  const handleSeeLess = () => {
    setShowAll(false);
    setInitialDisplayCount(5);
  };

  getNotificationDB();

  return (
    <>
      <div>
        <div
          onClick={toggleDrawer}
          className="rounded-full bg-black p-1 cursor-pointer"
        >
          <IoMdNotificationsOutline className="h-5 w-5 text-white" />
        </div>
      </div>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        lockBackgroundScroll
        direction="right"
        className={`!w-[280px] sm:!w-[400px] ${
          showAll ? "!h-full" : "!h-[40%]"
        }`}
      >
        <div className="px-6 py-5">
          <div>
            <div className="flex items-center justify-between">
              <h5 className="text-xl font-semibold uppercase">notifications</h5>
              <div
                className="rounded-full bg-black p-1 cursor-pointer xl:right-5"
                onClick={toggleDrawer}
              >
                <RiCloseFill className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex justify-start mt-4"></div>
            <div className="mt-5">
              {notification
                .slice(0, showAll ? notification.length : initialDisplayCount)
                .map((e: string, index: number) => {
                  return (
                    <p
                      key={index}
                      className="px-2 py-1 bg-gray-200 text-sm mt-1 mb-1 rounded-md capitalize"
                    >
                      {e}
                    </p>
                  );
                })}
              {!showAll && notification.length > initialDisplayCount && (
                <button
                  onClick={handleSeeMore}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  See More
                </button>
              )}
              {showAll && (
                <button
                  onClick={handleSeeLess}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
