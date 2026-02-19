import { useEffect, useState } from "react";
import MatchSummaryTabs from "./MatchSummaryTabs";
import { Card } from "antd";
import dayjs from "dayjs";

const UpComingMatches = ({ matches, loadMatches }) => {
  const matchTabs = matches.map((m) => ({
    key: m._id,
    label: dayjs(m?.date).format("DD-MM-YYYY"),
  }));

  const [tabKeyActive, setTabKeyActive] = useState(matches[0]?._id);

  const activeMatch = matches.find((m) => m._id === tabKeyActive);

  useEffect(() => {
    if (matches.length > 0) {
      setTabKeyActive(matches[0]?._id);
    }
  }, [matches]);

  return (
    <Card
      title="Upcoming matches"
      loading={loadMatches}
      tabList={matchTabs}
      activeTabKey={tabKeyActive}
      onTabChange={(key) => setTabKeyActive(key)}
      tabProps={{ size: "small" }}
      tab={{ overflowX: "auto" }}
      style={{ width: "100%" }}
    >
      {activeMatch && (
        <MatchSummaryTabs matchSummary={activeMatch} />
      )}
    </Card>
  );
};

export default UpComingMatches;
