import { useContext, useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import "react-modern-drawer/dist/index.css";
import { userContext } from "@/authContext/AuthContext";
import { collection, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { query, limit } from "firebase/firestore";
import { orderByKey } from "firebase/database";

export const Notification = () => {
  const [notification, setNotification] = useState<[] | string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [totalNotification, setTotalNotification] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(5);
  const { session } = useContext(userContext);

  useEffect(() => {
    getNotificationDB(5);
    getTotalNotification();
  }, [isOpen]);

  const notificationCount = () => {
    const val = totalNotification - currentLimit;
    if (val <= 0) return "all read";
    return val;
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => {
      if (prevState) {
        setCurrentLimit(5);
      }
      return !prevState;
    });
  };

  const getNotificationDB = async (currentLimits: number) => {
    if (currentLimits === 0) {
      setNotification([]);
      return null;
    }
    const refNote = collection(db, `notify_${session.userInfo.uid}`);
    let notifications: string[] = [];
    try {
      const q = query(refNote, limit(currentLimits));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        notifications.push(doc.data().notificationTitle);
      });
      console.log(notification);
      setNotification(notifications);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const handleMore = () => {
    const newLimit = currentLimit + 5;
    setCurrentLimit(newLimit);
    getNotificationDB(newLimit);
  };

  const getTotalNotification = async () => {
    const refNote = collection(db, `notify_${session.userInfo.uid}`);
    let notifications: string[] = [];
    const querySnapshot = await getDocs(refNote);
    querySnapshot.forEach((doc) => {
      notifications.push(doc.data().notificationTitle);
    });
    setTotalNotification(notifications.length);
  };

  const clearNotification = () => {
    getNotificationDB(0);
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
        className={`!w-[280px] sm:!w-[400px] !h-[50%] overflow-auto !rounded-md !mt-2 !me-2`}
      >
        <div className="px-6 py-5">
          <div>
            <div className="flex items-center justify-between sticky top-1 z-10 bg-white px-2 py-2">
              <h5 className="text-xl font-semibold uppercase">
                notifications {notificationCount()}
              </h5>
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
              {notificationCount() === "all read" ? (
                <button
                  onClick={clearNotification}
                  className="text-blue-500 hover:underline focus:outline-none capitalize"
                >
                  Clear
                </button>
              ) : (
                <button
                  onClick={handleMore}
                  className="text-blue-500 hover:underline focus:outline-none capitalize"
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
