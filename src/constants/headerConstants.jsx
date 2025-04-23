import { AiFillHome } from 'react-icons/ai';
import { BsFillMapFill, BsCloudSunFill } from 'react-icons/bs';
import { HiInformationCircle } from 'react-icons/hi';
import { IoMdSettings } from 'react-icons/io';
import { TbBeach } from 'react-icons/tb';

export const NAV_ITEMS = [
  { text: 'Home', path: '/' },
  { text: 'Map', path: '/map/light' },
  { text: 'Weather', path: '/weather' },
  { text: 'Recommendations', path: '/recommendations' },
  { text: 'About', path: '/about' },
];

export const NAV_ICONS = {
  Home: <AiFillHome size="25" />,
  Map: <BsFillMapFill size="22" />,
  Weather: <BsCloudSunFill size="25" />,
  Recommendations: <TbBeach size="25" />,
  About: <HiInformationCircle size="26" />,
  Settings: <IoMdSettings size="26" />,
};
