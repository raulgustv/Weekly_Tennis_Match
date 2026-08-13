import HelpArticleBackup from "../helpCenter/articles/HelpArticleBackup";
import HelpArticleJoin from "../helpCenter/articles/HelpArticleJoin";
import HelpArticleLeaveMatch from "../helpCenter/articles/HelpArticleLeaveMatch";
import HelpArticleNTRP from "../helpCenter/articles/HelpArticleNTRP";
import HelpArticleRefunds from "../helpCenter/articles/HelpArticleRefunds";
import HelpArticleTardiness from "../helpCenter/articles/HelpArticleTardiness";
import HelpArticleWallet from "../helpCenter/articles/HelpArticleWallet";
import { calculateReadTime } from "./readTime";


export const articles = [
    {
        id: "join-match",
        categoryKey: "matches",
        title: "How to join a match",
        readTime: calculateReadTime(HelpArticleJoin),
        component: HelpArticleJoin
    },

    {
        id: "backup-players",
        categoryKey: "matches",
        title: "Backup players",
        readTime: calculateReadTime(HelpArticleBackup),
        component: HelpArticleBackup,
    },
    {
        id: "cancel-match",
        categoryKey: "matches",
        title: "Leaving/cancelling a match",
        readTime: calculateReadTime(HelpArticleLeaveMatch),
        component: HelpArticleLeaveMatch,
    },
    {
        id: "tardiness",
        categoryKey: "late tardiness",
        title: "Arriving late to a match",
        readTime: calculateReadTime(HelpArticleTardiness),
        component: HelpArticleTardiness,
    },
    {
        id: "wallet-payments",
        categoryKey: "wallet payments",
        title: "Wallet & Payments",
         readTime: calculateReadTime(HelpArticleWallet),
        component: HelpArticleWallet,
    },

    {
        id: "refunds",
        categoryKey: "refunds adjustments",
        title: "Refunds and adjustments",
        readTime: calculateReadTime(HelpArticleRefunds),
        component: HelpArticleRefunds,
    },
    {
        id: "ranking-ntrp",
        categoryKey: "ranking",
        title: "Understanding NTRP",
        readTime: calculateReadTime(HelpArticleNTRP),
        component: HelpArticleNTRP,
    }
];