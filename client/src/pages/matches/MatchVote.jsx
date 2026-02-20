import { Row, Col } from "antd";
import { useAuth } from "../../context";
import { useMatches } from "../../context/MatchContext";
import VoteCard from "../../components/matches/VoteCard";
import EmptyVote from "../../components/matches/EmptyVote";

const MatchVote = () => {

    const { matches, loadMatches } = useMatches();
    const { user } = useAuth();

    const voteMatches = matches
        .filter(m =>
            m.status === "Played" &&
            m.players?.some(p => p.user?._id === user._id)
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    
        if (!voteMatches || voteMatches.length === 0) return <EmptyVote />


    return (
        <Row gutter={[16, 16]}>
            {voteMatches.map((m) => (
                <Col key={m._id} lg={12} md={16} sm={24} xs={24}>
                    <VoteCard
                        match={m}
                        loadMatches={loadMatches}
                        userId={user._id}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default MatchVote;
