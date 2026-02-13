import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckOutlined
} from "@ant-design/icons";
import { Button, Flex } from "antd";
import colors from "../../themes/colors";

const Voting = ({ onVote }) => {

    

  return (
    <Flex gap={8} justify="space-evenly">
      <Button
        icon={<ArrowUpOutlined style={{ color: colors.lightGreen }} />}
        onClick={() => onVote(1)}
      >
        Higher
      </Button>

      <Button
        icon={<CheckOutlined style={{ color: colors.yellow }} />}
        onClick={() => onVote(0)}
      >
        Correct
      </Button>

      <Button
        icon={<ArrowDownOutlined style={{ color: colors.danger }} />}
        onClick={() => onVote(-1)}
      >
        Lower
      </Button>
    </Flex>
  );
};

export default Voting;
