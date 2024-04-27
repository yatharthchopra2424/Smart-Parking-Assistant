import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as tb from "react-icons/tb";
import * as ff from "react-icons/fa6";

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Parking Slots',
    path: '/reports',
    icon: <ff.FaSquareParking/>,
    cName: 'nav-text'
  },
  {
    title: 'Scanner',
    path: '/scans',
    icon: <tb.TbGridScan />,
    cName: 'nav-text'
  },
  {
    title: 'History',
    path: '/History',
    icon: <FaIcons.FaHistory />,
    cName: 'nav-text'
  },

  {
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];