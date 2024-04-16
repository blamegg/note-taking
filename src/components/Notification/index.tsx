import { useContext, useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import "react-modern-drawer/dist/index.css";
import { userContext } from "@/authContext/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { query, limit } from "firebase/firestore";

export const Notification = () => {
  const [notification, setNotification] = useState<[] | string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const { session } = useContext(userContext);
  const [currentLimit, setCurrentLimit] = useState(5);

  useEffect(() => {
    getNotificationDB(5);
  }, [isOpen]);

  const toggleDrawer = () => {
    setIsOpen((prevState) => {
      if (prevState) {
        setCurrentLimit(5);
      }
      return !prevState;
    });
  };

  const getNotificationDB = async (currentLimits: number) => {
    const refNote = collection(db, `notify_${session.userInfo.uid}`);
    let notifications: string[] = [];
    try {
      const q = query(refNote, limit(currentLimits));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        notifications.push(doc.data().notificationTitle);
      });
      setNotification(notifications.reverse());
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const handleMore = () => {
    const newLimit = currentLimit + 5;
    setCurrentLimit(newLimit);
    getNotificationDB(newLimit);
    setShowAll(true);
  };

  const totalNotification = async () => {
    const refNote = collection(db, `notify_${session.userInfo.uid}`);
    let notifications: string[] = [];
    const querySnapshot = await getDocs(refNote);
    querySnapshot.forEach((doc) => {
      notifications.push(doc.data().notificationTitle);
    });
    return notifications.length;
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
        className={`!w-[280px] sm:!w-[400px] !h-[50%] overflow-auto`}
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
              <button
                onClick={handleMore}
                className="text-blue-500 hover:underline focus:outline-none capitalize"
              >
                Show More
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
