"use client";

import { LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { logout } from "~/lib/actions/auth";

import { User } from "~/lib/schema";

export default function Account({ user }: { user: User | null }) {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const handleAccountClick = () => {
    setIsShowMenu(!isShowMenu);
  };
  return (
    <>
      <div
        onClick={() => handleAccountClick()}
        className="absolute right-3 top-3 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-yellow-400 bg-red-900 text-xl font-normal text-white"
      >
        {user?.firstName[0] || "G"}
      </div>
      {isShowMenu && <AccountMenu user={user} />}
    </>
  );
}

function AccountMenu({ user }: { user: User | null }) {
  const menuItems = [
    { id: 1, name: user?.email || "Guest", icon: UserRound },
    { id: 2, name: user ? "Logout" : "Login", icon: LogOut },
  ];
  return (
    <div className="absolute right-3 top-14 z-50 flex h-auto w-48 flex-col gap-1 rounded bg-white p-2 text-sm">
      {user?.firstName} {user?.lastName}
      {menuItems.map((item, index) => (
        <div
          key={item.id}
          className="flex cursor-pointer items-center gap-2 rounded p-3 hover:bg-gray-100"
          onClick={async () => {
            if (item.id === 2) {
              if (user) {
                await logout();
              } else {
                const loginModal = document.getElementById("login_modal");
                if (loginModal instanceof HTMLDialogElement) {
                  loginModal.showModal();
                }
              }
            }
          }}
        >
          <item.icon size={15} />
          {item.name}
        </div>
      ))}
      <div className="m-auto mt-1 block w-3 rounded-lg border border-gray-300" />
    </div>
  );
}
