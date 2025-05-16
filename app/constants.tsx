export const loadingIndicator = (
  <div role="status" className="flex justify-center">
    <svg
      aria-hidden="true"
      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-800"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"

    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>

  </div>
);

export const Locations = [
  "Chennai",
  "Bangalore",
  "Hyderabad",
];

import { CiHeart, CiSettings, CiViewList } from "react-icons/ci";
export const ProfileList = [
  {
    name: "My Account",
    icon: <CiViewList className="text-highlight text-2xl" />,
    reference: "/account",
  },
  {
    name: "Wishlist",
    icon: <CiHeart className="text-highlight text-2xl" />,
    reference: "/wishlist",
  },
  {
    name: "Settings",
    icon: <CiSettings className="text-highlight text-2xl" />,
    reference: "/settings",
  },
];


import { RiEBikeLine } from "react-icons/ri";
import { IoBedOutline } from "react-icons/io5";
import { LuWashingMachine } from "react-icons/lu";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { CiDumbbell } from "react-icons/ci";
import { PiBabyCarriageLight } from "react-icons/pi";
export const Categories = [
  { category: "furniture", name: "Furniture", icon: <IoBedOutline /> },
  { category: "appliances", name: "Appliances", icon: <LuWashingMachine /> },
  { category: "electronics", name: "Electronics", icon: <HiOutlineDevicePhoneMobile /> },
  { category: "vehicles", name: "Vehicles", icon: <RiEBikeLine /> },
  { category: "fitness", name: "Fitness", icon: <CiDumbbell /> },
  { category: "baby-products", name: "Baby", icon: <PiBabyCarriageLight /> },
];

export const CategoriesPath = Categories.map((category) => ({
  ...category,
  pathName: `/products/${category.category}`,
}));

import { ClipboardList, } from "lucide-react";
export const SideBarLinks = [
  {
    name: "edit products",
    path: "/admin/products",
    icons: ClipboardList,
    submenu: [
      { name: "Furniture", path: "/admin/products/furniture", icon: IoBedOutline },
      { name: "Appliances", path: "/admin/products/appliances", icon: LuWashingMachine },
      { name: "Electronics", path: "/admin/products/electronics", icon: HiOutlineDevicePhoneMobile },
      { name: "Vehicles", path: "/admin/products/vehicles", icon: RiEBikeLine },
      { name: "Fitness", path: "/admin/products/fitness", icon: CiDumbbell },
      { name: "Baby", path: "/admin/products/baby-products", icon: PiBabyCarriageLight },
    ],
  },
  {
    name: "Contributions",
    path: "/admin/contributions",
    icons: ClipboardList,
    submenu: [
      { name: "All Contributions", path: "/admin/contributions/all-contributions", icon: BsBoxSeam, },
      { name: "Approved", path: "/admin/contributions/approved-contributions", icon: FiCheckCircle, },
      { name: "Rejected", path: "/admin/contributions/rejected-contributions", icon: FiXCircle, },
    ],
  },
  {
    name: "orders",
    path: "/admin/orders",
    icons: ClipboardList,
  },
  
];


import { BsBoxSeam } from "react-icons/bs";
import { IoClipboardOutline } from "react-icons/io5";
import { FiCheckCircle, FiXCircle, FiUserCheck, FiInbox } from "react-icons/fi";

export const AgentSidebarLinks = [
  {
    name: "Contributions", path: "/service-agent/contributions", icons: IoClipboardOutline,
    submenu: [
      { name: "All Contributions", path: "/service-agent/all-contributions", icon: BsBoxSeam, },
      { name: "Unassigned", path: "/service-agent/unassigned-contributions", icon: FiInbox, },
      { name: "Assigned", path: "/service-agent/assigned-contributions", icon: FiUserCheck, },
      { name: "Approved", path: "/service-agent/approved-contributions", icon: FiCheckCircle, },
      { name: "Rejected", path: "/service-agent/rejected-contributions", icon: FiXCircle, },
    ],
  },
];