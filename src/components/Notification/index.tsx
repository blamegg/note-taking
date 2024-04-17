import { useContext, useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import "react-modern-drawer/dist/index.css";
import { userContext } from "@/authContext/AuthContext";
import { collection, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { query, limit } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";

export const Notification = () => {
  const [notification, setNotification] = useState<[] | string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [totalNotification, setTotalNotification] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [count, setCount] = useState(0);
  const { session } = useContext(userContext);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    getNotificationDB(5);
    getTotalNotification();
    notificationCount();
  }, [isOpen]);

  useEffect(() => {
    const collectionRef = collection(db, `notify_${session.userInfo.uid}`);
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const isNewDocument =
            notification.findIndex((item) => item === change.doc.id) === -1;

          if (isNewDocument) {
            setCounter((prev) => prev + 1);
          }
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
      setCount(0);
      return null;
    }
    const refNote = collection(db, `notify_${session.userInfo.uid}`);
    let notifications: string[] = [];
    try {
      const q = query(
        refNote,
        orderBy("createdAt", "desc"),
        limit(currentLimits)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        notifications.push(doc.data().notificationTitle);
      });
      setNotification(notifications);
      setCount(notifications.length);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  // const getNotificationDB = async (currentLimits: number) => {
  //   if (currentLimits === 0) {
  //     setNotification([]);
  //     return null;
  //   }
  //   const refNote = collection(db, `notify_${session.userInfo.uid}`);
  //   let notifications: string[] = [];
  //   try {
  //     const q = query(
  //       refNote,
  //       orderBy("createdAt", "desc"),
  //       limit(currentLimits)
  //     );
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       notifications.push(doc.data().notificationTitle);
  //     });
  //     setNotification(notifications);
  //   } catch (error) {
  //     console.error("Error getting documents: ", error);
  //   }
  // };

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

  console.log("re");

  return (
    <>
      <div>
        <div
          onClick={toggleDrawer}
          className="relative rounded-full bg-black p-1 cursor-pointer"
        >
          <IoMdNotificationsOutline className="h-5 w-5 text-white" />
          <div className="h-5 w-5 absolute -top-2 -right-2 p-[2px] rounded-full bg-red-500  text-white text-[8px] font-bold grid place-items-center">
            {counter}
          </div>
        </div>
      </div>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        lockBackgroundScroll
        direction="right"
        className={`!w-[280px] sm:!w-[400px] !h-[50%] overflow-auto !rounded-md !mt-2 !me-2 `}
      >
        <div className="px-6 py-5">
          <div>
            <div className="flex items-center justify-between sticky top-1 z-10 bg-white px-2 py-2">
              <h5 className="text-xl font-semibold uppercase">
                notifications {notificationCount() ?? "0"}
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
                <div className="mt-4" onClick={clearNotification}>
                  <div className="relative inline-flex group">
                    <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt outline-none"></div>
                    <a
                      href="#"
                      title="Get quote now"
                      className="relative inline-flex items-center justify-center px-2 py-1 font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl text-xs"
                      role="button"
                    >
                      Clear
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mt-4" onClick={handleMore}>
                  <div className="relative inline-flex group">
                    <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt outline-none"></div>
                    <a
                      href="#"
                      title="Get quote now"
                      className="relative inline-flex items-center justify-center px-2 py-1 font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl text-xs"
                      role="button"
                    >
                      Show More
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
