import JoinMatch from '../images/help/JoinMatch.jpg'
import JoinMatch2 from '../images/help/JoinAfterPayment.jpg'
import Safari1 from '../images/help/Safari1.PNG'
import Safari2 from '../images/help/Safari2.PNG'  

export const articles = [
  {
    id: "join-match",
    categoryKey: "matches",
    title: "How to join a match",
    readTime: "1 min ready",
    sections: [
    {
      title: "",
      text: "Go to the Matches page and browse the available matches. Check the date, time, location and average NTRP before joining.",
    },
    {
      title: "Join the Match",
      text: (
        <p>Click on join to join the match. If the match is full you may join as a back up <small>(Only four spots available)</small></p>
      ),
      image: JoinMatch
    },
    {
      title: "Payment method",
      text: (
        <div>
          <p>Select a valid payment method (wallet is always available) </p> <small>We are working to enable more payment methods</small>
        </div>
      ),
      image: JoinMatch2
    }
  ]
  },
  {
    id: "backup-players",
    categoryKey: "matches",
    title: "Backup players",
    readTime: "1 min de lectura",
    sections: [
    {
      title: "What is a Backup Player?",

      text: "A backup player is someone who is available to replace another player if a spot becomes available before the match starts. This helps ensure that matches remain full and balanced."
    },

    {
      title: "Joining as a Backup",

      text: "You can choose to join a match as a backup player from the very beginning, even if there are still regular spots available. This is a great option if you are unsure about your availability or simply prefer to be called only if needed."
    },

    {
      title: "Automatic Backup List",

      text: "If all regular player spots have already been filled, you can still join the waiting list as a backup. Players are added in the order they register, and if someone cancels, invitations are sent automatically following that order."
    },

    {
      title: "Receiving an Invitation (coming soon)",

      text: "When a place becomes available, the next eligible backup player receives an invitation. Once accepted, the player is moved into the match and the backup list is updated automatically."
    }

  ]

  },
  {
    id: "cancel-match",
    categoryKey: "matches",
    title: "Leaving/cancelling a match",
    readTime: "2 min",
    sections: [

    {
      title: "Cancelling Your Registration",

      text: "You can cancel your participation at any time by opening the match details and clicking the 'Cancel Registration' button."
    },

    {
      title: "Cancellation Deadline",

      text: "Cancellations are only allowed up to 24 hours before the match starts. Once the match is less than 24 hours away, self-service cancellations are no longer available."
    },

    {
      title: "Late Cancellations",

      text: "If you need to cancel within 24 hours of the match, you must contact an administrator. Depending on the reason and circumstances, late cancellations may result in penalties or temporary suspensions to help keep matches fair for all players."
    },

    {
      title: "What Happens to Your Spot?",

      text: "When you cancel before the deadline, your spot is automatically offered to the next eligible player on the backup list. This helps keep every match full and balanced."
    }

  ]
  },
  {
  id: "wallet-payments",

  categoryKey: "wallet",

  title: "Wallet & Payments",

  readTime: "2 min",

  sections: [

    {
      title: "Your Wallet",

      text: "Your Wallet stores your available balance, which is used to pay for matches. Whenever you join a paid match, the corresponding amount is automatically deducted from your available balance."
    },

    {
      title: "Adding Funds",

      text: "At the moment, wallet top-ups are managed directly through a Weekly Tennis administrator. Once your payment has been confirmed, the requested amount will be added to your wallet balance."
    },

    {
      title: "Future Online Payments",

      text: "We are working on bringing back online payment methods, including Bizum, so you will soon be able to add funds instantly and securely without contacting an administrator."
    },

    {
      title: "Refunds",

      text: "If you cancel your registration within the allowed cancellation period, any applicable refund will be credited back to your Wallet balance, ready to be used for future matches."
    }

  ]
},
{
  id: "refunds",

  categoryKey: "wallet",

  title: "Refunds",

  readTime: "2 min",

  sections: [

    {
      title: "Automatic Refunds",

      text: "Refunds are processed automatically when you cancel your registration within the allowed cancellation period or when a match is cancelled due to insufficient players."
    },

    {
      title: "Wallet Credit",

      text: "Any refunded amount is credited directly back to your Wallet balance. You can use this balance to join future matches without making another payment."
    },

    {
      title: "Withdrawing Your Balance",

      text: "If you decide to stop playing and no longer wish to use Weekly Tennis, you may request the remaining balance in your Wallet to be refunded. To do so, simply contact an administrator, who will review your request and process the refund using the original payment method whenever possible."
    }

  ]
},
{
  id: "ranking-ntrp",

  categoryKey: "ranking",

  title: "Understanding NTRP",

  readTime: "2 min",

  sections: [

    {
      title: "What is NTRP?",

      text: "NTRP (National Tennis Rating Program) is a rating system used to estimate a player's tennis level. Weekly Tennis uses your NTRP to help create balanced matches and provide a better playing experience for everyone."
    },

    {
      title: "Our Rating Scale",

      text: "In Weekly Tennis, we primarily use a simplified NTRP scale from 1.0 to 5.0. Players above 5.0 are considered highly competitive or advanced players. While our community is mainly focused on recreational and social tennis, players of every level are always welcome."
    },

    {
      title: "Be Honest About Your Level",

      text: "Choosing your real playing level is one of the most important things you can do. An accurate NTRP helps us create fair teams, competitive matches, and a better experience for everyone on the court."
    },

    {
      title: "Why It Matters",

      text: "If your rating is significantly higher or lower than your actual level, matches may become unbalanced and less enjoyable for other players. Honest ratings lead to fairer matchmaking, more competitive games, and a stronger tennis community."
    }

  ]
},
{
  id: "edit-profile",

  categoryKey: "profile",

  title: "Profile Management",

  readTime: "2 min",

  sections: [

    {
      title: "Current Availability",

      text: "Profile editing features are currently limited while we continue improving the platform. At the moment, editing your personal information directly from the app is temporarily unavailable."
    },

    {
      title: "Coming Soon",

      text: "The ability to update your phone number and email address will be available in a future update. We are also working on enabling password changes directly from your account."
    },

    {
      title: "Why Can't I Change My Password?",

      text: "Password reset and change functionality requires additional email domain configuration, which is currently being implemented. We appreciate your patience while this feature is completed."
    },

    {
      title: "Forgot Your Password?",

      text: "If you have lost or forgotten your password, please contact a Weekly Tennis administrator. They will provide you with the appropriate instructions to regain access to your account."
    }

  ]
},
{
  id: "notifications-settings",

  categoryKey: "notifications",

  title: "Browser Notifications",

  readTime: "3 min",

  sections: [

    {
      title: "Why Enable Notifications?",

      text: "Weekly Tennis uses browser notifications to keep you informed about backup invitations, match reminders, cancellations, schedule changes and other important updates. We strongly recommend enabling notifications so you never miss an important event."
    },

    {
      title: "Android Devices",

      text: "On Android devices, notifications are simple to enable. The first time you visit Weekly Tennis, your browser will ask for permission to send notifications. Tap 'Allow' and you're all set."
    },

    {
      title: "iPhone & iPad (Safari)",

      text: "Apple requires websites to be added to your Home Screen before they can send push notifications. If you are using an iPhone or iPad, follow these steps."
    },

    {
      title: "Step 1",

      text: "Open Weekly Tennis using Safari. Other browsers on iPhone do not support web push notifications in the same way."
    },

    {
      title: "Step 2",
      text: "Tap the Share button at the bottom of Safari.",
      image: Safari1
    },

    {
      title: "Step 3",
      text: "Scroll down and tap 'Add to Home Screen'.",
      image: Safari2
    },

    {
      title: "Step 4",

      text: "Confirm by tapping 'Add'. A Weekly Tennis icon will appear on your Home Screen just like a normal app."
    },

    {
      title: "Step 5",

      text: "Open Weekly Tennis from the new Home Screen icon. The application may ask for notification permission. Tap 'Allow'."
    },

    {
      title: "Already Added?",

      text: "If Weekly Tennis is already on your Home Screen but notifications are still disabled, open iPhone Settings → Notifications, find Weekly Tennis and make sure notifications are enabled."
    },

    {
      title: "Need Help?",

      text: "If you're still unable to receive notifications, please contact a Weekly Tennis administrator and we'll be happy to help."
    }

  ]
}
];