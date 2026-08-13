import {
  BookOutlined,
  DollarOutlined,
  NotificationOutlined,
  TrophyOutlined,
  UserOutlined,
  ToolOutlined,
  FolderOpenOutlined,
  CheckSquareOutlined
} from "@ant-design/icons";
import HelpJoinMatch from "../helpCenter/categories/HelpJoinMatch";
import HelpWallet from "../helpCenter/categories/HelpWallet";
import HelpNTRP from "../helpCenter/categories/HelpNTRP";
import HelpProfile from "../helpCenter/categories/HelpProfile";
import HelpNotifications from "../helpCenter/categories/HelpNotifications";
import HelpComingSoon from "../helpCenter/categories/HelpComingSoon";
import HelpMatchDetail from "../helpCenter/categories/HelpMatchDetail";
import HelpMatchGenerated from "../helpCenter/categories/HelpMatchGenerated";


export const categories = [
  {
    key: "matches",
    title: "Joining Matches",
    description: "Learn how to register and play matches.",
    icon: <BookOutlined />,
    color: "#1677ff",
   content: (onClose) => <HelpJoinMatch onClose={onClose} />,
  },
    {
    key: "match-details",
    title: "Match details",
    description: "See more about match details page.",
    icon: <FolderOpenOutlined />,
    color: "#d46b08",
   content: (onClose) => <HelpMatchDetail onClose={onClose} />,
  },
    {
    key: "match-ready",
    title: "Ready to play",
    description: "What happens on the match date",
    icon: <CheckSquareOutlined />,
    color: "#389e0d",
   content: (onClose) => <HelpMatchGenerated onClose={onClose} />,
  },
  {
    key: "wallet",
    title: "Wallet & Payments",
    description: "Deposits, refunds, and payment methods.",
    icon: <DollarOutlined />,
    color: "#52c41a",
    content: (onClose) => <HelpWallet onClose={onClose} />,
  },
  {
    key: "ranking",
    title: "NTRP Level",
    description: "Understand NTRP.",
    icon: <TrophyOutlined />,
    color: "#faad14",
    content: (onClose) => <HelpNTRP onClose={onClose} />,
  },
  {
    key: "profile",
    title: "My Profile",
    description: "Manage your personal information.",
    icon: <UserOutlined />,
    color: "#722ed1",
    content: (onClose) => <HelpProfile onClose={onClose} />,
  },
  {
    key: "notifications",
    title: "Notifications",
    description: "Emails and browser notifications.",
    icon: <NotificationOutlined />,
    color: "#eb2f96",
    content: (onClose) => <HelpNotifications onClose={onClose} />,
  },
  {
    key: "coming-soon",
    title: "Coming soon",
    description: "This is what we want to do later",
    icon: <ToolOutlined />,
    color: "#13c2c2",
    content: (onClose) => <HelpComingSoon onClose={onClose} />,
  },
];