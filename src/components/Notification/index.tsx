import { useContext, useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import "react-modern-drawer/dist/index.css";
import { userContext } from "@/authContext/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { query, limit } from "firebase/firestore";
import { FaBullseye } from "react-icons/fa6";

export const Notification = () => {
  const [notification, setNotification] = useState<[] | string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const { session } = useContext(userContext);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const getNotificationDB = async (max: number | null) => {
    const refNote = collection(db, `notify_${session.userInfo.uid}`);
    let notifications: string[] = [];
    try {
      const q = query(refNote, limit(max ?? 5));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        notifications.push(doc.data().notificationTitle);
      });
      setNotification(notifications);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    getNotificationDB(null);
  }, [isOpen]);

  const handleMore = () => {
    getNotificationDB(100);
    setShowAll(true);
  };

  const handleLess = () => {
    getNotificationDB(5);
    setShowAll(false);
  };

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
              {notification.map((e, index) => {
                return (
                  <p
                    key={index}
                    className="px-2 py-1 bg-gray-200 text-sm mt-1 mb-1 rounded-md capitalize"
                  >
                    {e}
                  </p>
                );
              })}
              {showAll ? (
                <button
                  onClick={handleLess}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  Show Less
                </button>
              ) : (
                <button
                  onClick={handleMore}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  Show More
                </button>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
