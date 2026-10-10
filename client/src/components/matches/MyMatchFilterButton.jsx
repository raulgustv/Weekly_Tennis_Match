// 🔵 NUEVO (archivo completo): botón para alternar entre ver todos los
// emparejamientos generados o solo aquellos en los que juega el usuario.
// Es solo un filtro visual (no llama a la API). El padre (MatchPlayers.jsx)
// decide cuándo mostrarlo y aplica el filtro.
import { Button } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

const MyMatchFilterButton = ({ onlyMine, onToggle }) => {
  return (
    <Button
      icon={onlyMine ? <TeamOutlined /> : <UserOutlined />}
      onClick={onToggle}
      type={onlyMine ? "primary" : "default"}
      block
    >
      {onlyMine ? "Show all matches" : "Show only my match"}
    </Button>
  );
};

export default MyMatchFilterButton;