// src/components/wallet/WalletInfoAlert.jsx
// NEW FILE: the "How wallet works" alert is extracted from the page into its own component.
import React from 'react';
import { Alert } from 'antd';

const WalletInfoAlert = () => (
    <Alert
        // CHANGED: title text kept, content rewritten for the manual top-up flow.
        title="How wallet works"
        type="info"
        showIcon
        description={
            <div>
                {/* CHANGED: warning now states that top-ups are handled manually. */}
                <b>
                    Note: Wallet top-ups are currently handled manually by the admin. This
                    feature does not send or process any payment automatically.
                </b>

                <p>
                    Instead of paying for every match separately, you can send a larger amount
                    to the admin in advance and keep the funds in your wallet for future matches.
                </p>

                {/* CHANGED: the old 5-step automatic flow was replaced by these 3 manual steps. */}
                <ol>
                    <li>
                        <strong>Contact the admin:</strong> Let them know how much money you are
                        going to add to your wallet.
                    </li>

                    <li>
                        <strong>Arrange the payment method:</strong> Agree with the admin on how
                        you will pay (Bizum, PayPal, or any other available method).
                    </li>

                    <li>
                        <strong>The admin adds your funds:</strong> Once the admin has received
                        your payment, they will add the amount to your wallet balance.
                    </li>
                </ol>
            </div>
        }
    />
);

export default WalletInfoAlert;