import { Modal, Typography, Input, Button } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

const { Title } = Typography;
const { TextArea } = Input;

const WhatsappMessage = ({ open, setOpenMessage, match }) => {

    const [text, setText] = useState("");
    const [copyMessage, setCopyMessage] = useState("Copy message")
    const [buttonType, setButtonType] = useState('default')
    const [timeoutId, setTimeoutId] = useState(null);

    const generatePlayersList = (players = [], maxPlayers) => {
        return Array.from({length: maxPlayers}, (_, i) => {
            const p = players[i];

            if(p){
                return `${i+1}. ${p.user.name}`;
            }
            return `${i+1}.`;
        }).join("\n")
    }

    const generateBackupList = (backUps = [], maxBackups) => {
        return Array.from({length: maxBackups}, (_, i) => {
            const b = backUps[i];

            if(b){
                return `${i+1}. ${b.user.name}`;
            }
            return `${i+1}.`;
        }).join("\n")
    }

    useEffect(() => {
        if (!match) return;

        const [hour, minute] = match.startTime.split(":");

        const matchDateTime = dayjs(match.date)
            .hour(Number(hour))
            .minute(Number(minute));

        const deadline = matchDateTime.subtract(26, "hour");

        const playersText = generatePlayersList(match?.players, match?.maxPlayers)
        const backupsText = generateBackupList(match?.backUps, match?.maxBackups)


        const message = `🎾 Tennis Doubles Game 🎾

Only for visibility please join using the link
https://weekly-tennis-match.vercel.app/games

DEADLINE: ${deadline.format("H[h]")} - ${deadline.format("dddd, MMM D, YYYY")}
Date:  ${matchDateTime.format("dddd, MMM D, YYYY HH[h]")}
Location: ${match.location.name} - ${match.location.address}

Players:
${playersText}

Backups: 
${backupsText}

Payment: ${(match.price/match.maxPlayers).toFixed(2)}€
${match.paymentMethods.map((pm) => `${pm.type}: ${pm.value}`).join("\n")}

TO JOIN:  
- Visit: https://weekly-tennis-match.vercel.app/games and join the match
- Pay (backup list doesn’t require payment).-
- Add your name; eg. John Doe (bizum)
`;

        setText(message);

    }, [match]);

    if (!match) return null;

    return (
        <Modal
            open={open}
            onCancel={() => setOpenMessage(false)}
            footer={null}
        >
            <Title level={5}>WhatsApp Message</Title>

            <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoSize={{ minRows: 10, maxRows: 20 }}
            />

            <Button
                style={{ marginTop: 12}}
                onClick={() => {
                    navigator.clipboard.writeText(text);
                    //window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                    setCopyMessage("Copied ✅");
                    setButtonType('primary')
                    
                    if(timeoutId) clearTimeout(timeoutId);
                    const id = setTimeout(() => {
                        setCopyMessage("Copy message")
                        setButtonType('default')
                    }, 3000);
                    setTimeoutId(id)
                }}
                type={buttonType}
            >
                {copyMessage}
            </Button>
        </Modal>
    );
};

export default WhatsappMessage;